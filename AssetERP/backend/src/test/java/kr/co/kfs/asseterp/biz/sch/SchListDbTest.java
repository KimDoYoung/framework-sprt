package kr.co.kfs.asseterp.biz.sch;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListResultReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListSaveReq;
import kr.co.kfs.asseterp.biz.sch.mapper.SchListMapper;
import kr.co.kfs.asseterp.biz.sch.service.SchListService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** H06 법규보고 점검(Sch04_List)의 쓰기(upsert·updateConfirm)를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SchListService.class)
class SchListDbTest {

    @Autowired SchListService service;
    @Autowired SchListMapper mapper;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean EmpTransInfoService transInfoService;

    /** 회사관리자(userId < 0)라 조직 조회를 하지 않는다 */
    private static final UserPrincipal ADMIN = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
    private static final LocalDate DAY = LocalDate.of(2026, 10, 20);

    private Sch04ListSaveReq row(long listId, String statusCode, LocalDate manageDate) {
        return new Sch04ListSaveReq(listId, DAY, manageDate, 111L, "ZT시험 법규", "2", "03", 222L, statusCode, null, 333L, null, 444L);
    }

    /** upsert는 없는 listId면 새 ID(f_create_seq)로 넣는다 — 제목으로 찾는다 */
    private long insertedId() {
        return jdbc.queryForObject("select sch04_list_id from sch04_list where sch04_company_id = 28000 and sch04_title = 'ZT시험 법규'", Long.class);
    }

    @Test
    void 저장은_없으면_등록_있으면_처리자_처리일_처리구분만_고친다() {
        service.upsert(ADMIN, List.of(row(999_000_000_001L, "1", DAY)));
        long id = insertedId();
        assertThat(id).isNotEqualTo(999_000_000_001L);

        Sch04ListRes created = mapper.selectById(28000L, id);
        assertThat(created).isNotNull();
        assertThat(created.statusCode()).isEqualTo("1");
        assertThat(created.manageDate()).isEqualTo(DAY);
        assertThat(created.personId()).isEqualTo(-28656L);
        assertThat(created.title()).isEqualTo("ZT시험 법규");
        assertThat(created.mngOrgId()).isEqualTo(444L);
        assertThat(created.confirmYn()).isFalse();
        assertThat(created.noneDataYn()).isFalse();

        // 있으면 updatePersonId — 제목·마감일은 그대로, 처리구분·처리일만 바뀐다
        service.upsert(ADMIN, List.of(new Sch04ListSaveReq(id, DAY.plusDays(9), DAY.plusDays(1), 1L, "바뀌면 안 됨", "3", "99", 1L, "5", "바뀌면 안 됨", 1L, 1L, 1L)));
        Sch04ListRes updated = mapper.selectById(28000L, id);
        assertThat(updated.statusCode()).isEqualTo("5");
        assertThat(updated.manageDate()).isEqualTo(DAY.plusDays(1));
        assertThat(updated.title()).isEqualTo("ZT시험 법규");
        assertThat(updated.closeDate()).isEqualTo(DAY);
        assertThat(updated.note()).isNull();
    }

    @Test
    void 처리결과_저장_확인_확인취소와_다른_회사_차단() {
        service.upsert(ADMIN, List.of(row(999_000_000_002L, "1", DAY)));
        long id = insertedId();

        Sch04ListRes noted = service.updateResult(ADMIN, id, new Sch04ListResultReq("U", "처리했습니다"));
        assertThat(noted.note()).isEqualTo("처리했습니다");
        assertThat(noted.confirmYn()).isFalse();

        Sch04ListRes confirmed = service.updateResult(ADMIN, id, new Sch04ListResultReq("P", null));
        assertThat(confirmed.confirmYn()).isTrue();
        assertThat(confirmed.confirmDate()).isEqualTo(LocalDate.now());
        assertThat(confirmed.confirmerId()).isEqualTo(-28656L);
        assertThat(confirmed.note()).isEqualTo("처리했습니다");

        Sch04ListRes canceled = service.updateResult(ADMIN, id, new Sch04ListResultReq("C", null));
        assertThat(canceled.confirmYn()).isFalse();
        assertThat(canceled.confirmDate()).isNull();
        assertThat(canceled.confirmerId()).isNull();

        UserPrincipal other = UserPrincipal.builder().userId(-79L).companyId(79L).build();
        assertThatThrownBy(() -> service.updateResult(other, id, new Sch04ListResultReq("P", null))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateResult(ADMIN, id, new Sch04ListResultReq("X", null))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 다운로드는_조회_결과를_xlsx로_만든다() {
        byte[] xlsx = service.downloadIcs(ADMIN, LocalDate.of(2025, 10, 1), LocalDate.of(2026, 9, 30), false, "%", "%", "", false);
        assertThat(xlsx.length).isGreaterThan(100);
        assertThat(new String(xlsx, 0, 2)).isEqualTo("PK");
    }
}
