package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckBatchCompleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCompleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgStatusRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckStatusReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckManlService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckOrgService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChckInsuffService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** N22 이행점검(Tdm52_Tab_CheckManl)의 점검시작·점검완료·일괄점검·조치계획을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({TdmCheckOrgService.class, TdmCheckManlService.class, TdmChckInsuffService.class})
class TdmCheckManlDbTest {

    @Autowired TdmCheckOrgService orgService;
    @Autowired TdmCheckManlService manlService;
    @Autowired TdmChckInsuffService insuffService;
    @Autowired JdbcTemplate jdbc;
    /** JdbcTemplate으로 바꾼 값은 MyBatis 1차 캐시(같은 트랜잭션)가 모르므로 바꾼 뒤 비운다 */
    @Autowired SqlSessionTemplate session;
    @MockitoBean SysFileService fileService;

    /** kfstest — 점검항목 3건, 한 점검자, 점검상태 null(확정 전) */
    private static final long COMPANY = 28000L;
    private static final long ORG = 202601059251370L;
    private static final long CHECKER = 202511249196672L;
    private static final UserPrincipal USER = UserPrincipal.builder().userId(CHECKER).companyId(COMPANY).name("N22시험").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();

    private long count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Long.class, args);
    }

    private void setStatus(String status) {
        int n = jdbc.update("UPDATE tdm52_chck_manl SET tdm52_check_status_cd = ? WHERE tdm52_chck_org_id = ? AND tdm52_checker_id = ?", status, ORG, CHECKER);
        assertThat(n).isEqualTo(3);
        session.clearCache();
    }

    private List<String> statuses() {
        return jdbc.queryForList("SELECT DISTINCT COALESCE(tdm52_check_status_cd,'-') FROM tdm52_chck_manl WHERE tdm52_chck_org_id = ? AND tdm52_checker_id = ?", String.class, ORG, CHECKER);
    }

    private List<CheckManlDetailRes> items() {
        return manlService.searchByPerson(USER, ORG, CHECKER, false, null);
    }

    @Test
    void 점검자의_점검항목을_조회하고_회사가_다르면_막는다() {
        List<CheckManlDetailRes> list = items();
        assertThat(list).hasSize(3);
        assertThat(list.get(0).checkItem()).startsWith("(");
        assertThat(list.get(0).checkerId()).isEqualTo(CHECKER);
        assertThat(list.get(0).manlOrgId()).isNotNull();
        assertThat(manlService.searchByPerson(USER, ORG, CHECKER, false, "존재하지않는글자zzzz")).isEmpty();
        // 진행&반려건만: 상태가 null인 3건은 빠지고, 진행으로 바꾸면 보인다
        assertThat(manlService.searchByPerson(USER, ORG, CHECKER, true, null)).isEmpty();
        setStatus("11");
        assertThat(manlService.searchByPerson(USER, ORG, CHECKER, true, null)).hasSize(3);
        setStatus("19");
        assertThat(manlService.searchByPerson(USER, ORG, CHECKER, true, null)).isEmpty();
        assertThat(manlService.searchByPerson(USER, ORG, 1L, false, null)).isEmpty();
        assertThatThrownBy(() -> manlService.searchByPerson(OTHER, ORG, CHECKER, false, null)).isInstanceOf(BusinessException.class);
        // 점검자 기준 부서 점검현황 (personId 가지)
        List<CheckOrgStatusRes> orgs = orgService.search(USER, "2025.06", orgIdOf(), CHECKER);
        assertThat(orgs).anyMatch(r -> r.chckOrgId() == ORG && r.monthManlCnt() == 3);
        assertThat(orgService.search(USER, "2025.06", orgIdOf(), 1L)).noneMatch(r -> r.chckOrgId() == ORG);
    }

    private long orgIdOf() {
        return count("SELECT tdm51_org_id FROM tdm51_chck_org WHERE tdm51_chck_org_id = ?", ORG);
    }

    @Test
    void 점검시작과_시작취소는_상태를_바꾸고_이력을_남긴다() {
        assertThatThrownBy(() -> manlService.updateCheckStatus(USER, new CheckStatusReq(ORG, CHECKER, "P")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("점검 대기중인 점검항목이 없습니다");
        assertThatThrownBy(() -> manlService.updateCheckStatus(USER, new CheckStatusReq(ORG, CHECKER, "X")))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> manlService.updateCheckStatus(OTHER, new CheckStatusReq(ORG, CHECKER, "P"))).isInstanceOf(BusinessException.class);

        setStatus("10");
        long recordBefore = count("SELECT COUNT(*) FROM tdm55_chck_record");
        manlService.updateCheckStatus(USER, new CheckStatusReq(ORG, CHECKER, "P"));
        assertThat(statuses()).containsExactly("11");
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordBefore + 3);

        manlService.updateCheckStatus(USER, new CheckStatusReq(ORG, CHECKER, "C"));
        assertThat(statuses()).containsExactly("10");
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordBefore + 6);
        assertThatThrownBy(() -> manlService.updateCheckStatus(USER, new CheckStatusReq(ORG, CHECKER, "C")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("점검 진행중(또는 점검완료)인 점검항목이 없습니다");
    }

    @Test
    void 점검완료는_조치계획과_의견을_검사하고_완료취소는_되돌린다() {
        setStatus("11");
        long id = items().get(0).chckManlId();

        // 저장은 점검일·결과·의견만
        CheckManlDetailRes saved = manlService.update(USER, id, new CheckManlSaveReq("2026-11-05", "9", "해당 없음"));
        assertThat(saved.checkDate()).isEqualTo("2026-11-05");
        assertThat(saved.checkResultCode()).isEqualTo("9");
        assertThat(saved.checkStatusCode()).isEqualTo("11");

        // 미흡인데 조치계획이 없으면 막는다
        assertThatThrownBy(() -> manlService.updateComplete(USER, id, new CheckCompleteReq("P", "2026-11-05", "2", "미흡", "의견")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("조치계획을 등록하세요");
        // 적정이면 증빙이 있어야 한다 — 이 점검의 시작일(2025년)에는 증빙 필수 설정이 켜져 있다(tdm91 2025-01-01 행)
        assertThatThrownBy(() -> manlService.updateComplete(USER, id, new CheckCompleteReq("P", "2026-11-05", "1", "적정", "의견")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("증빙자료가 존재하지 않습니다");
        // 해당없음은 증빙·의견 검사가 없다
        CheckManlDetailRes done = manlService.updateComplete(USER, id, new CheckCompleteReq("P", "2026-11-05", "9", "해당없음", null));
        assertThat(done.checkStatusCode()).isEqualTo("19");
        assertThat(done.checkResultCode()).isEqualTo("9");
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? AND tdm55_proc_type = '점검완료' AND tdm55_proc_result = '해당없음'", id)).isEqualTo(1);

        // 점검완료 상태에서 다시 완료는 되고(AS-IS 막지 않음), 취소는 점검진행으로
        CheckManlDetailRes canceled = manlService.updateComplete(USER, id, new CheckCompleteReq("C", null, null, null, null));
        assertThat(canceled.checkStatusCode()).isEqualTo("11");
        assertThat(canceled.checkResultCode()).isEqualTo("9");
        assertThatThrownBy(() -> manlService.updateComplete(USER, id, new CheckCompleteReq("C", null, null, null, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("점검완료,승인반려");

        // 승인 진행 중에는 아무것도 못 한다
        jdbc.update("UPDATE tdm52_chck_manl SET tdm52_check_status_cd = '21' WHERE tdm52_chck_manl_id = ?", id);
        session.clearCache();
        assertThatThrownBy(() -> manlService.updateComplete(USER, id, new CheckCompleteReq("P", "2026-11-05", "9", "해당없음", null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("승인 진행 중입니다");
        assertThatThrownBy(() -> manlService.updateComplete(OTHER, id, new CheckCompleteReq("C", null, null, null, null))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 조치계획은_최초등록하고_계획변경하며_미흡_완료는_조치계획을_지운다() {
        setStatus("11");
        long id = items().get(0).chckManlId();
        assertThat(insuffService.searchByManl(USER, id)).isNull();

        ChckInsuffRes created = insuffService.save(USER, new ChckInsuffSaveReq(null, id, "2026-11-05", "2026-12-31", CHECKER, "조치명", "조치계획", "2026-11-01"));
        assertThat(created.chckInsuffId()).isNotNull();
        assertThat(created.statusCode()).isEqualTo("10");
        assertThat(created.planActionEmpName()).isNotNull();
        assertThat(created.occYm()).isEqualTo(items().get(0).checkYm());
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? AND tdm55_proc_type = '발생(최초등록)'", created.chckInsuffId())).isEqualTo(1);

        ChckInsuffRes changed = insuffService.save(USER, new ChckInsuffSaveReq(created.chckInsuffId(), id, "2026-11-05", "2027-01-31", CHECKER, "조치명2", "조치계획2", "2026-11-01"));
        assertThat(changed.chckInsuffId()).isEqualTo(created.chckInsuffId());
        assertThat(changed.actionName()).isEqualTo("조치명2");
        assertThat(changed.dueDate()).isEqualTo("2027-01-31");
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? AND tdm55_proc_type = '발생(계획변경)'", created.chckInsuffId())).isEqualTo(1);
        assertThatThrownBy(() -> insuffService.save(OTHER, new ChckInsuffSaveReq(null, id, "2026-11-05", "2026-12-31", CHECKER, "a", "b", null))).isInstanceOf(BusinessException.class);

        // 미흡으로 점검완료는 조치계획이 있어 통과, 적정으로 바꿔 완료하면 조치계획이 지워진다
        CheckManlDetailRes done = manlService.updateComplete(USER, id, new CheckCompleteReq("P", "2026-11-05", "2", "미흡", "의견"));
        assertThat(done.checkStatusCode()).isEqualTo("19");
        assertThat(insuffService.searchByManl(USER, id)).isNotNull();
        manlService.updateComplete(USER, id, new CheckCompleteReq("C", null, null, null, null));
        manlService.updateComplete(USER, id, new CheckCompleteReq("P", "2026-11-05", "9", "해당없음", null));
        assertThat(insuffService.searchByManl(USER, id)).isNull();
    }

    @Test
    void 일괄점검은_한_번에_점검완료하고_일괄취소는_점검진행으로_되돌린다() {
        setStatus("11");
        List<Long> ids = items().stream().map(CheckManlDetailRes::chckManlId).toList();
        long recordBefore = count("SELECT COUNT(*) FROM tdm55_chck_record");

        manlService.batchComplete(USER, new CheckBatchCompleteReq(ids, "2026-11-05", "9", "해당없음", "일괄 의견"));
        assertThat(statuses()).containsExactly("19");
        assertThat(items()).allMatch(r -> "9".equals(r.checkResultCode()) && "일괄 의견".equals(r.checkCmnt()));
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordBefore + 3);

        manlService.batchCancel(USER, ids);
        assertThat(statuses()).containsExactly("11");
        assertThat(items()).allMatch(r -> r.checkResultCode() == null && r.checkDate() == null && r.checkCmnt() == null);
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordBefore + 6);
        assertThatThrownBy(() -> manlService.batchCancel(OTHER, ids)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> manlService.batchComplete(USER, new CheckBatchCompleteReq(List.of(), "2026-11-05", "9", "해당없음", null)))
                .isInstanceOf(BusinessException.class);
    }
}
