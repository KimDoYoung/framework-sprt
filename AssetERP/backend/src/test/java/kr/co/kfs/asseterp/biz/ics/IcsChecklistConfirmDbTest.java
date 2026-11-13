package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistConfirmService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** K06 내부통제내역 확인(Ics15_Tab_ChecklistConfirm)의 조회·확인 쓰기·상신 조회창을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsChecklistConfirmService.class)
class IcsChecklistConfirmDbTest {

    @Autowired IcsChecklistConfirmService service;
    @Autowired JdbcTemplate jdbc;

    /** 회사 28000의 작성그룹 확인자(sch22_confirmer_id)로 지정된 사원 — 2026-09 월 주기 확인 대상이 9건이다(AS-IS selectChecklistStatusPagingTotal로도 9) */
    private static final UserPrincipal CONFIRMER = UserPrincipal.builder().userId(29033L).companyId(28000L).build();
    private static final LocalDate STD_DATE = LocalDate.of(2026, 9, 30);

    /** 확인자 지정은 DB 데이터라 바뀔 수 있다 — 시험 안에서 직접 지정하고(롤백) 건수는 그때 읽은 값을 기준으로 본다 */
    @BeforeEach
    void 작성그룹_확인자를_지정한다() {
        jdbc.update("update sch22_write_group set sch22_confirmer_id = ? where sch22_company_id = 28000", CONFIRMER.getUserId());
        // 그 달 작성 행도 비우고 시작한다 — DB 사본에 다른 확인자가 확인한 행이 있으면 목록(작성 행의 확인자 우선)과
        // 상신 조회창(지정 확인자만)의 건수가 달라지고, 작성 전 행이 없어진다(원본 SQL 그대로). 롤백된다
        jdbc.update("delete from ics15_checklist_write where ics15_company_id = 28000 and ics15_check_yyyymm = '2026.09' and ics15_cycle_type = 'M'");
    }

    /** fixYn·confirmYn = 제출구분·확인구분 콤보(원본 2026-11-02) 'true'·'false'·null(전체) */
    private PageRes<IcsChecklistConfirmRes> search(String fixYn, String confirmYn, int offset, int limit) {
        return service.search(CONFIRMER, STD_DATE, "M", null, null, "", fixYn, confirmYn, offset, limit);
    }

    @Test
    void 확인자의_확인_대상을_페이지로_읽는다() {
        PageRes<IcsChecklistConfirmRes> all = search(null, null, 0, 1000);
        long total = all.total();
        assertThat(total).isGreaterThan(5);  // 페이지 시험이 성립하려면 6건 이상
        assertThat(all.rows()).hasSize((int) total);

        PageRes<IcsChecklistConfirmRes> page2 = search(null, null, 5, 5);
        assertThat(page2.total()).isEqualTo(total);
        assertThat(page2.rows()).hasSize((int) Math.min(5, total - 5)).first().isEqualTo(all.rows().get(5));

        // 대분류 조건·검색어
        Long lClassId = all.rows().get(0).checkLClassId();
        assertThat(service.search(CONFIRMER, STD_DATE, "M", lClassId, null, "", null, null, 0, 1000).total()).isBetween(1L, total);
        assertThat(service.search(CONFIRMER, STD_DATE, "M", null, null, all.rows().get(0).personName(), null, null, 0, 1000).total()).isBetween(1L, total);
        // 다른 사람은 이 대상의 확인자가 아니다
        UserPrincipal other = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
        assertThat(service.search(other, STD_DATE, "M", null, null, "", null, null, 0, 1000).total()).isZero();
    }

    @Test
    void 작성_행이_없는_행도_확인하고_확인취소한다() {
        List<IcsChecklistConfirmRes> rows = search(null, null, 0, 1000).rows();
        List<IcsChecklistConfirmRes> picked = rows.stream().limit(2).toList();
        assertThat(picked).allMatch(r -> r.checklistWriteId() == null);  // 작성 전이라 확인하면 행이 만들어진다
        List<IcsChecklistConfirmReq.Target> targets = picked.stream().map(r -> new IcsChecklistConfirmReq.Target(r.checklistId(), r.personId())).toList();
        long unconfirmedBefore = search(null, "false", 0, 1000).total();

        assertThat(service.updateConfirmYn(CONFIRMER, new IcsChecklistConfirmReq(true, "2026.09", "M", targets))).isEqualTo(2);  // INSERT
        assertThat(search(null, null, 0, 1000).rows()).filteredOn(r -> picked.stream().anyMatch(p -> p.checklistId().equals(r.checklistId()) && p.personId().equals(r.personId())))
                .hasSize(2).allMatch(r -> r.confirmYn() && r.checklistWriteId() != null);
        assertThat(search(null, "false", 0, 1000).total()).isEqualTo(unconfirmedBefore - 2);  // 확인구분 "미확인"에서 빠진다
        assertThat(jdbc.queryForObject("select count(*) from ics15_checklist_write where ics15_company_id = 28000 and ics15_check_yyyymm = '2026.09' and ics15_cycle_type = 'M' and ics15_confirmer_id = 29033 and ics15_confirm_yn = 'true'", Long.class)).isEqualTo(2L);

        assertThat(service.updateConfirmYn(CONFIRMER, new IcsChecklistConfirmReq(false, "2026.09", "M", targets))).isEqualTo(2);  // UPDATE
        assertThat(search(null, "false", 0, 1000).total()).isEqualTo(unconfirmedBefore);
        assertThat(jdbc.queryForObject("select count(*) from ics15_checklist_write where ics15_company_id = 28000 and ics15_check_yyyymm = '2026.09' and ics15_cycle_type = 'M' and ics15_confirm_yn = 'true'", Long.class)).isZero();
    }

    @Test
    void 상신_조회창은_대분류별_건수를_준다() {
        List<IcsChecklistRelateApprRes> list = service.relateApprs(CONFIRMER, STD_DATE, "M");
        assertThat(list).isNotEmpty();
        assertThat(list.stream().mapToLong(IcsChecklistRelateApprRes::totalCount).sum()).isEqualTo(search(null, null, 0, 1000).total());
        assertThat(list).allMatch(r -> r.confirmCount() <= r.totalCount());
    }

    @Test
    void 출력은_전체_행을_엑셀로_준다() {
        assertThat(service.download(CONFIRMER, STD_DATE, "M", null, null, "", null, null)).isNotEmpty();
    }

    @Test
    void 제출구분_확인구분_콤보는_목록을_나눈다() {
        // 원본 2026-11-02(CH-0041·0178): 미체크·미확인 체크박스가 제출구분·확인구분 콤보로 바뀌었다
        long total = search(null, null, 0, 1000).total();
        PageRes<IcsChecklistConfirmRes> fixed = search("true", null, 0, 1000);
        PageRes<IcsChecklistConfirmRes> unfixed = search("false", null, 0, 1000);
        assertThat(fixed.rows()).allMatch(IcsChecklistConfirmRes::fixYn);
        assertThat(unfixed.rows()).noneMatch(IcsChecklistConfirmRes::fixYn);
        assertThat(fixed.total() + unfixed.total()).isEqualTo(total);

        PageRes<IcsChecklistConfirmRes> confirmed = search(null, "true", 0, 1000);
        PageRes<IcsChecklistConfirmRes> unconfirmed = search(null, "false", 0, 1000);
        assertThat(confirmed.rows()).allMatch(IcsChecklistConfirmRes::confirmYn);
        assertThat(unconfirmed.rows()).noneMatch(IcsChecklistConfirmRes::confirmYn);
        assertThat(confirmed.total() + unconfirmed.total()).isEqualTo(total);
        assertThat(search("아무값", "아무값", 0, 1000).total()).isEqualTo(total);   // 모르는 값은 전체
    }
}
