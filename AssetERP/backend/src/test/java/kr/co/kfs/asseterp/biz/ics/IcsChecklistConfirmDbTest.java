package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistConfirmService;
import kr.co.kfs.asseterp.common.dto.PageRes;
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

    private PageRes<IcsChecklistConfirmRes> search(boolean unCheckYn, boolean unConfirmYn, int offset, int limit) {
        return service.search(CONFIRMER, STD_DATE, "M", null, null, "", unCheckYn, unConfirmYn, offset, limit);
    }

    @Test
    void 확인자의_확인_대상을_페이지로_읽는다() {
        PageRes<IcsChecklistConfirmRes> all = search(false, false, 0, 100);
        assertThat(all.total()).isEqualTo(9);
        assertThat(all.rows()).hasSize(9);

        PageRes<IcsChecklistConfirmRes> page2 = search(false, false, 5, 5);
        assertThat(page2.total()).isEqualTo(9);
        assertThat(page2.rows()).hasSize(4).first().isEqualTo(all.rows().get(5));

        // 대분류 조건·검색어
        Long lClassId = all.rows().get(0).checkLClassId();
        assertThat(service.search(CONFIRMER, STD_DATE, "M", lClassId, null, "", false, false, 0, 100).total()).isBetween(1L, 9L);
        assertThat(service.search(CONFIRMER, STD_DATE, "M", null, null, all.rows().get(0).personName(), false, false, 0, 100).total()).isBetween(1L, 9L);
        // 다른 사람은 이 대상의 확인자가 아니다
        UserPrincipal other = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
        assertThat(service.search(other, STD_DATE, "M", null, null, "", false, false, 0, 100).total()).isZero();
    }

    @Test
    void 작성_행이_없는_행도_확인하고_확인취소한다() {
        List<IcsChecklistConfirmRes> rows = search(false, false, 0, 100).rows();
        List<IcsChecklistConfirmRes> picked = rows.stream().limit(2).toList();
        assertThat(picked).allMatch(r -> r.checklistWriteId() == null);  // 작성 전이라 확인하면 행이 만들어진다
        List<IcsChecklistConfirmReq.Target> targets = picked.stream().map(r -> new IcsChecklistConfirmReq.Target(r.checklistId(), r.personId())).toList();
        long unconfirmedBefore = search(false, true, 0, 100).total();

        assertThat(service.updateConfirmYn(CONFIRMER, new IcsChecklistConfirmReq(true, "2026.09", "M", targets))).isEqualTo(2);  // INSERT
        assertThat(search(false, false, 0, 100).rows()).filteredOn(r -> picked.stream().anyMatch(p -> p.checklistId().equals(r.checklistId()) && p.personId().equals(r.personId())))
                .hasSize(2).allMatch(r -> r.confirmYn() && r.checklistWriteId() != null);
        assertThat(search(false, true, 0, 100).total()).isEqualTo(unconfirmedBefore - 2);  // 미확인 보기에서 빠진다
        assertThat(jdbc.queryForObject("select count(*) from ics15_checklist_write where ics15_company_id = 28000 and ics15_check_yyyymm = '2026.09' and ics15_cycle_type = 'M' and ics15_confirmer_id = 29033 and ics15_confirm_yn = 'true'", Long.class)).isEqualTo(2L);

        assertThat(service.updateConfirmYn(CONFIRMER, new IcsChecklistConfirmReq(false, "2026.09", "M", targets))).isEqualTo(2);  // UPDATE
        assertThat(search(false, true, 0, 100).total()).isEqualTo(unconfirmedBefore);
        assertThat(jdbc.queryForObject("select count(*) from ics15_checklist_write where ics15_company_id = 28000 and ics15_check_yyyymm = '2026.09' and ics15_cycle_type = 'M' and ics15_confirm_yn = 'true'", Long.class)).isZero();
    }

    @Test
    void 상신_조회창은_대분류별_건수를_준다() {
        List<IcsChecklistRelateApprRes> list = service.relateApprs(CONFIRMER, STD_DATE, "M");
        assertThat(list).isNotEmpty();
        assertThat(list.stream().mapToLong(IcsChecklistRelateApprRes::totalCount).sum()).isEqualTo(9);
        assertThat(list).allMatch(r -> r.confirmCount() <= r.totalCount());
    }

    @Test
    void 출력은_전체_행을_엑셀로_준다() {
        assertThat(service.download(CONFIRMER, STD_DATE, "M", null, null, "", false, false)).isNotEmpty();
    }
}
