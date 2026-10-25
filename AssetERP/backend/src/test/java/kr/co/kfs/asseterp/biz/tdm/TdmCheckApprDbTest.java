package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprBatchReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprCmntReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprManlRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStartReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStatusReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprSubmitReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckApprService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckManlService;
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

/** N23 책무이행점검 승인(Tdm59_Tab_CheckAppr)의 제출·종합의견·승인시작·일괄승인·점검항목/조치내역 승인을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({TdmCheckApprService.class, TdmCheckManlService.class})
class TdmCheckApprDbTest {

    @Autowired TdmCheckApprService service;
    @Autowired JdbcTemplate jdbc;
    /** JdbcTemplate으로 바꾼 값은 MyBatis 1차 캐시(같은 트랜잭션)가 모르므로 바꾼 뒤 비운다 */
    @Autowired SqlSessionTemplate session;
    @MockitoBean SysFileService fileService;

    /** kfstest 2026.10 — 임원(=최종승인자) 한 명의 SELF 1행 + SUB 2행(하위 부서 승인 20·10) */
    private static final long COMPANY = 28000L;
    private static final long ROLE = 202507250000036L;
    private static final long APPR = 202309271590772L;
    private static final long EXCT = 202607289814634L;
    private static final long SELF_ID = 202607289814644L;
    private static final long SUB_APPROVED_ID = 202607289814646L;
    private static final long SUB_WAITING_ID = 202607289814675L;
    private static final String YM = "2026.10";
    private static final UserPrincipal USER = UserPrincipal.builder().userId(APPR).companyId(COMPANY).name("N23시험").build();
    private static final UserPrincipal SAME_COMPANY_OTHER = UserPrincipal.builder().userId(-3L).companyId(COMPANY).name("다른사람").build();
    private static final UserPrincipal OTHER_COMPANY = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();

    private long count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Long.class, args);
    }

    private String text(String sql, Object... args) {
        return jdbc.queryForObject(sql, String.class, args);
    }

    private CheckApprListRes row(long id) {
        return service.search(USER, YM, ROLE).stream().filter(r -> r.chckApprCmntId() == id).findFirst().orElseThrow();
    }

    /** 이 승인자의 점검항목 승인(tdm60)·조치내역 승인(tdm61)을 모두 한 상태로 */
    private void setAllApprStatus(String status) {
        jdbc.update("UPDATE tdm60_chck_manl_appr SET tdm60_appr_status_cd = ? WHERE tdm60_appr_emp_id = ? AND tdm60_chck_manl_id IN ("
                + " SELECT tdm52_chck_manl_id FROM tdm52_chck_manl INNER JOIN tdm51_chck_org ON tdm51_chck_org_id = tdm52_chck_org_id"
                + "  WHERE tdm51_company_id = ? AND tdm51_check_ym = ? AND tdm51_role_id = ?)", status, APPR, COMPANY, YM, ROLE);
        jdbc.update("UPDATE tdm61_chck_insuff_appr SET tdm61_appr_status_cd = ? WHERE tdm61_appr_emp_id = ? AND tdm61_chck_insuff_id IN ("
                + " SELECT tdm54_chck_insuff_id FROM tdm54_chck_insuff WHERE tdm54_company_id = ? AND tdm54_role_id = ?)", status, APPR, COMPANY, ROLE);
        session.clearCache();
    }

    private void setApprRow(long id, String status, String submit) {
        jdbc.update("UPDATE tdm59_chck_appr_cmnt SET tdm59_appr_status_cd = ?, tdm59_submit_yn = ? WHERE tdm59_chck_appr_cmnt_id = ?", status, submit, id);
        session.clearCache();
    }

    @Test
    void 승인현황을_조회하고_다른_사람과_다른_회사는_막는다() {
        List<CheckApprListRes> list = service.search(USER, YM, ROLE);
        assertThat(list).hasSize(3);
        CheckApprListRes self = row(SELF_ID);
        assertThat(self.cmntType()).isEqualTo("SELF");
        assertThat(self.finalApprEmpYn()).isTrue();     // 승인자가 임원
        assertThat(self.checkOrgName()).isNotBlank();
        assertThat(self.roleName()).isNotBlank();
        assertThat(row(SUB_APPROVED_ID).apprStatusCode()).isEqualTo("20");
        assertThat(row(SUB_WAITING_ID).apprStatusCode()).isEqualTo("10");
        assertThat(row(SUB_WAITING_ID).checkOrgName2()).startsWith(" - ");
        // 내 승인 행만
        assertThat(service.search(SAME_COMPANY_OTHER, YM, ROLE)).isEmpty();
        assertThatThrownBy(() -> service.searchManls(SAME_COMPANY_OTHER, SUB_APPROVED_ID, false, null, null)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.searchManls(OTHER_COMPANY, SUB_APPROVED_ID, false, null, null)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.searchEndInfo(USER, "2026-10")).isInstanceOf(BusinessException.class);
        assertThat(service.searchEndInfo(USER, YM)).isNotNull();

        // 아래 목록 — SELF 행은 자기 부서에 점검항목이 없는 집계 행이라 비어 있고, SUB 행이 하위 부서의 점검항목을 보여 준다
        assertThat(service.searchManls(USER, SELF_ID, false, null, null)).isEmpty();
        List<CheckApprManlRes> manls = service.searchManls(USER, SUB_APPROVED_ID, false, null, null);
        assertThat(manls).hasSize(7);
        assertThat(manls.get(0).chckManlApprId()).isNotNull();
        assertThat(manls.get(0).finalApprEmpYn()).isTrue();
        assertThat(service.searchManls(USER, SUB_APPROVED_ID, false, null, manls.get(0).chckManlId())).hasSize(1);
        assertThat(service.searchManls(USER, SUB_APPROVED_ID, false, "존재하지않는글자zzzz", null)).isEmpty();
        assertThat(service.searchManls(USER, SUB_APPROVED_ID, false, "", null)).hasSize(7);
        service.searchInsuffs(USER, SUB_APPROVED_ID, false, null);
        assertThat(service.searchRecords(USER, SUB_APPROVED_ID, null)).isNotNull();
        // 이웃 부서
        // 이 데이터의 SUB 행은 최초 승인 단계라 하위·상위 부서의 SELF 행이 없다(화면의 "-"와 같다)
        assertThat(service.searchNeighbor(USER, SUB_APPROVED_ID, "pre")).isNull();
        assertThat(service.searchNeighbor(USER, SUB_APPROVED_ID, "next")).isNull();
        assertThatThrownBy(() -> service.searchNeighbor(USER, SELF_ID, "zzz")).isInstanceOf(BusinessException.class);
    }

    @Test
    void 종합의견_승인은_미승인_항목과_하위부서를_검사하고_승인취소로_되돌린다() {
        setAllApprStatus("10");
        // 미승인 점검항목이 있으면 거부
        assertThatThrownBy(() -> service.updateCmnt(USER, SELF_ID, new CheckApprCmntReq("A", YM, "의견", "종합")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("미승인(또는 반려) 점검항목이 존재합니다");
        setAllApprStatus("20");
        // 하위부서(SUB)가 모두 승인이 아니면 거부
        assertThatThrownBy(() -> service.updateCmnt(USER, SELF_ID, new CheckApprCmntReq("A", YM, "의견", "종합")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("승인하지 않은 하위부서가 존재합니다");
        setApprRow(SUB_WAITING_ID, "20", "false");

        long recordBefore = count("SELECT COUNT(*) FROM tdm55_chck_record");
        CheckApprListRes done = service.updateCmnt(USER, SELF_ID, new CheckApprCmntReq("A", YM, "의견", "종합"));
        assertThat(done.apprStatusCode()).isEqualTo("20");
        assertThat(done.apprCmnt()).isEqualTo("의견");
        assertThat(done.reportCmnt()).isEqualTo("종합");
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordBefore + 1);
        assertThat(text("SELECT tdm55_proc_type FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? ORDER BY tdm55_upd_date DESC, tdm55_chck_record_id DESC LIMIT 1", SELF_ID))
                .isEqualTo("승인완료");   // 임원 = 최종승인자

        // 취소: 승인취소로 이력, 상태 대기
        CheckApprListRes cancelled = service.updateCmnt(USER, SELF_ID, new CheckApprCmntReq("C", YM, null, null));
        assertThat(cancelled.apprStatusCode()).isEqualTo("10");
        assertThat(cancelled.apprCmnt()).isEqualTo("의견");  // 의견을 안 보내면 읽은 값 그대로
        assertThat(text("SELECT tdm55_proc_type FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? ORDER BY tdm55_upd_date DESC, tdm55_chck_record_id DESC LIMIT 1", SELF_ID))
                .isEqualTo("승인취소");

        // 저장(U)은 상태·이력을 건드리지 않는다
        long recordMid = count("SELECT COUNT(*) FROM tdm55_chck_record");
        CheckApprListRes saved = service.updateCmnt(USER, SELF_ID, new CheckApprCmntReq("U", YM, "바꾼의견", null));
        assertThat(saved.apprStatusCode()).isEqualTo("10");
        assertThat(saved.apprCmnt()).isEqualTo("바꾼의견");
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordMid);

        assertThatThrownBy(() -> service.updateCmnt(USER, SELF_ID, new CheckApprCmntReq("X", YM, null, null))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateCmnt(SAME_COMPANY_OTHER, SELF_ID, new CheckApprCmntReq("U", YM, "x", null))).isInstanceOf(BusinessException.class);
    }

    @Test
    void SUB_의견은_반려_점검항목이_있어야_반려하고_반려취소로_되돌린다() {
        setAllApprStatus("20");
        setApprRow(SELF_ID, "10", "false");
        // 이 데이터의 세 행은 모두 최초승인자 — 반려된 점검항목·조치내역이 없으면 반려 불가
        assertThat(row(SUB_APPROVED_ID).firstApprEmpYn()).isTrue();
        assertThatThrownBy(() -> service.updateCmnt(USER, SUB_APPROVED_ID, new CheckApprCmntReq("R", YM, "사유", null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("반려된 점검항목 또는 조치내역이 존재하지 않습니다");

        // 점검항목 하나를 반려(30)로 두면 반려할 수 있다
        long manlApprId = service.searchManls(USER, SUB_APPROVED_ID, false, null, null).get(0).chckManlApprId();
        jdbc.update("UPDATE tdm60_chck_manl_appr SET tdm60_appr_status_cd = '30' WHERE tdm60_chck_manl_appr_id = ?", manlApprId);
        session.clearCache();
        assertThat(service.countRejectedManls(USER, SUB_APPROVED_ID)).isEqualTo(1);
        CheckApprListRes rejected = service.updateCmnt(USER, SUB_APPROVED_ID, new CheckApprCmntReq("R", YM, "사유", null));
        assertThat(rejected.apprStatusCode()).isEqualTo("30");
        assertThat(text("SELECT tdm55_proc_type FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? ORDER BY tdm55_upd_date DESC, tdm55_chck_record_id DESC LIMIT 1", SUB_APPROVED_ID))
                .isEqualTo("승인반려");

        // My부서(SELF)의 승인이 끝났으면 SUB 취소 불가
        setApprRow(SELF_ID, "20", "false");
        assertThatThrownBy(() -> service.updateCmnt(USER, SUB_APPROVED_ID, new CheckApprCmntReq("C", YM, null, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("My부서의 승인(반려)이 완료되었습니다");
        // 대기이면 반려취소 → 대기, 이력은 반려취소
        setApprRow(SELF_ID, "10", "false");
        CheckApprListRes cancelled = service.updateCmnt(USER, SUB_APPROVED_ID, new CheckApprCmntReq("C", YM, null, null));
        assertThat(cancelled.apprStatusCode()).isEqualTo("10");
        assertThat(text("SELECT tdm55_proc_type FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? ORDER BY tdm55_upd_date DESC, tdm55_chck_record_id DESC LIMIT 1", SUB_APPROVED_ID))
                .isEqualTo("반려취소");
    }

    @Test
    void 제출과_제출취소는_가능_여부를_검사하고_임원승인여부를_바꾼다() {
        // 승인이 끝나지 않았으면 제출 불가
        setApprRow(SELF_ID, "10", "false");
        assertThatThrownBy(() -> service.submit(USER, new CheckApprSubmitReq(YM, ROLE, "P")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("제출");
        assertThatThrownBy(() -> service.checkSubmitPossible(USER, YM, ROLE, "C"))
                .isInstanceOf(BusinessException.class);

        // 전부 승인이면 제출 가능
        for (long id : new long[] {SELF_ID, SUB_APPROVED_ID, SUB_WAITING_ID}) {
            setApprRow(id, "20", "false");
        }
        service.checkSubmitPossible(USER, YM, ROLE, "P");
        service.submit(USER, new CheckApprSubmitReq(YM, ROLE, "P"));
        assertThat(count("SELECT COUNT(*) FROM tdm59_chck_appr_cmnt WHERE tdm59_chck_exct_id = ? AND tdm59_submit_yn = 'true'", EXCT)).isEqualTo(3);
        assertThat(text("SELECT tdm53_exct_appr_yn FROM tdm53_chck_exct WHERE tdm53_chck_exct_id = ?", EXCT)).isEqualTo("true");
        assertThat(count("SELECT COUNT(*) FROM tdm59_chck_appr_cmnt WHERE tdm59_chck_exct_id = ? AND tdm59_submit_date IS NOT NULL", EXCT)).isEqualTo(3);
        // 이미 제출했으면 또 제출 불가
        assertThatThrownBy(() -> service.submit(USER, new CheckApprSubmitReq(YM, ROLE, "P"))).isInstanceOf(BusinessException.class);

        // 제출취소
        service.submit(USER, new CheckApprSubmitReq(YM, ROLE, "C"));
        assertThat(count("SELECT COUNT(*) FROM tdm59_chck_appr_cmnt WHERE tdm59_chck_exct_id = ? AND tdm59_submit_yn = 'true'", EXCT)).isZero();
        assertThat(text("SELECT tdm53_exct_appr_yn FROM tdm53_chck_exct WHERE tdm53_chck_exct_id = ?", EXCT)).isEqualTo("false");
        assertThat(count("SELECT COUNT(*) FROM tdm59_chck_appr_cmnt WHERE tdm59_chck_exct_id = ? AND tdm59_submit_date IS NOT NULL", EXCT)).isZero();
    }

    @Test
    void 승인시작과_일괄승인과_점검항목_승인은_상태와_이력을_바꾼다() {
        List<CheckApprManlRes> manls = service.searchManls(USER, SUB_APPROVED_ID, false, null, null);
        List<Long> ids = manls.stream().map(CheckApprManlRes::chckManlId).limit(2).toList();
        // 승인요청(20) 상태로 맞춰 놓고 승인시작
        jdbc.update("UPDATE tdm52_chck_manl SET tdm52_check_status_cd = '20' WHERE tdm52_chck_manl_id IN (?, ?)", ids.get(0), ids.get(1));
        session.clearCache();
        long recordBefore = count("SELECT COUNT(*) FROM tdm55_chck_record");
        service.apprStart(USER, SUB_APPROVED_ID, new CheckApprStartReq("P", ids, List.of()));
        assertThat(count("SELECT COUNT(*) FROM tdm52_chck_manl WHERE tdm52_chck_manl_id IN (?, ?) AND tdm52_check_status_cd = '21'", ids.get(0), ids.get(1))).isEqualTo(2);
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordBefore + 2);
        assertThat(service.searchManls(USER, SUB_APPROVED_ID, false, null, ids.get(0)).get(0).apprStatusCode()).isEqualTo("10");
        // 다른 승인 행의 점검항목을 섞으면 거부
        assertThatThrownBy(() -> service.apprStart(USER, SUB_APPROVED_ID, new CheckApprStartReq("P", List.of(-1L), List.of())))
                .isInstanceOf(BusinessException.class);

        // 일괄승인: 승인(20) + 최종승인자(임원)라서 점검상태 25
        service.batchAppr(USER, SUB_APPROVED_ID, new CheckApprBatchReq("P", ids));
        for (Long id : ids) {
            CheckApprManlRes m = service.searchManls(USER, SUB_APPROVED_ID, false, null, id).get(0);
            assertThat(m.apprStatusCode()).isEqualTo("20");
            assertThat(m.checkStatusCode()).isEqualTo("25");
        }
        // 일괄승인취소: 대기(10) + 점검상태 21
        service.batchAppr(USER, SUB_APPROVED_ID, new CheckApprBatchReq("C", ids));
        for (Long id : ids) {
            CheckApprManlRes m = service.searchManls(USER, SUB_APPROVED_ID, false, null, id).get(0);
            assertThat(m.apprStatusCode()).isEqualTo("10");
            assertThat(m.checkStatusCode()).isEqualTo("21");
        }

        // 점검항목 한 건 승인·반려·취소
        CheckApprManlRes one = service.searchManls(USER, SUB_APPROVED_ID, false, null, ids.get(0)).get(0);
        CheckApprManlRes approved = service.updateManlStatus(USER, SUB_APPROVED_ID, one.chckManlApprId(), new CheckApprStatusReq("A", YM, "승인의견"));
        assertThat(approved.apprStatusCode()).isEqualTo("20");
        assertThat(approved.checkStatusCode()).isEqualTo("25");
        assertThat(approved.apprCmnt()).isEqualTo("승인의견");
        CheckApprManlRes rejected = service.updateManlStatus(USER, SUB_APPROVED_ID, one.chckManlApprId(), new CheckApprStatusReq("R", YM, "반려사유"));
        assertThat(rejected.apprStatusCode()).isEqualTo("30");
        assertThat(rejected.checkStatusCode()).isEqualTo("26");
        CheckApprManlRes cancelled = service.updateManlStatus(USER, SUB_APPROVED_ID, one.chckManlApprId(), new CheckApprStatusReq("C", YM, "반려사유"));
        assertThat(cancelled.apprStatusCode()).isEqualTo("10");
        assertThat(cancelled.checkStatusCode()).isEqualTo("21");
        service.saveManlCmnt(USER, SUB_APPROVED_ID, one.chckManlApprId(), "임시저장");
        assertThat(service.searchManls(USER, SUB_APPROVED_ID, false, null, ids.get(0)).get(0).apprCmnt()).isEqualTo("임시저장");
        assertThat(text("SELECT tdm55_proc_type FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? ORDER BY tdm55_upd_date DESC, tdm55_chck_record_id DESC LIMIT 1", ids.get(0)))
                .isEqualTo("승인(반려)취소");
        // 승인시작취소: 점검상태 21 → 20, 승인 대기(10), 의견 비움
        service.apprStart(USER, SUB_APPROVED_ID, new CheckApprStartReq("C", ids, List.of()));
        assertThat(count("SELECT COUNT(*) FROM tdm52_chck_manl WHERE tdm52_chck_manl_id IN (?, ?) AND tdm52_check_status_cd = '20'", ids.get(0), ids.get(1))).isEqualTo(2);
        assertThat(service.searchManls(USER, SUB_APPROVED_ID, false, null, ids.get(0)).get(0).apprCmnt()).isNull();

        assertThatThrownBy(() -> service.updateManlStatus(SAME_COMPANY_OTHER, SUB_APPROVED_ID, one.chckManlApprId(), new CheckApprStatusReq("A", YM, "x")))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateManlStatus(USER, SUB_APPROVED_ID, one.chckManlApprId(), new CheckApprStatusReq("Z", YM, "x")))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void 조치내역_승인은_조치상태와_이력을_바꾸고_글자수를_검사한다() {
        // 조치내역(2026.07 발생, 승인완료 25)은 SUB_WAITING 행(하위 부서 202308141568403)의 목록에 나온다
        List<CheckApprInsuffRes> insuffs = service.searchInsuffs(USER, SUB_WAITING_ID, false, null);
        assertThat(insuffs).hasSize(1);
        CheckApprInsuffRes one = insuffs.get(0);
        assertThat(one.chckInsuffApprId()).isNotNull();
        assertThat(one.apprStatusCode()).isEqualTo("20");
        assertThat(one.finalApprEmpYn()).isTrue();
        assertThat(service.searchInsuffs(USER, SUB_WAITING_ID, true, null)).isEmpty();      // 미승인건만: 승인(20)은 뺀다
        assertThat(service.searchInsuffs(USER, SUB_WAITING_ID, false, one.chckInsuffId())).hasSize(1);
        CheckApprInsuffRes detail = service.getInsuff(USER, one.chckInsuffId());
        assertThat(detail.apprStatusCode()).isNull();     // selectById에는 승인 열이 없다(AS-IS 그대로)
        assertThat(detail.actionName()).isEqualTo(one.actionName());
        assertThat(service.searchInsuffRecords(USER, one.chckInsuffId())).isNotNull();
        assertThatThrownBy(() -> service.getInsuff(OTHER_COMPANY, one.chckInsuffId())).isInstanceOf(BusinessException.class);

        CheckApprInsuffRes cancelled = service.updateInsuffStatus(USER, SUB_WAITING_ID, one.chckInsuffApprId(), new CheckApprStatusReq("C", YM, null));
        assertThat(cancelled.apprStatusCode()).isEqualTo("10");
        assertThat(cancelled.statusCode()).isEqualTo("21");
        CheckApprInsuffRes rejected = service.updateInsuffStatus(USER, SUB_WAITING_ID, one.chckInsuffApprId(), new CheckApprStatusReq("R", YM, "반려의견"));
        assertThat(rejected.apprStatusCode()).isEqualTo("30");
        assertThat(rejected.statusCode()).isEqualTo("26");
        CheckApprInsuffRes approved = service.updateInsuffStatus(USER, SUB_WAITING_ID, one.chckInsuffApprId(), new CheckApprStatusReq("A", YM, "승인의견"));
        assertThat(approved.apprStatusCode()).isEqualTo("20");
        assertThat(approved.statusCode()).isEqualTo("25");    // 최종승인자(임원) → 승인완료
        assertThat(text("SELECT tdm55_proc_type FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? ORDER BY tdm55_upd_date DESC, tdm55_chck_record_id DESC LIMIT 1", one.chckInsuffId()))
                .isEqualTo("승인완료");
        service.saveInsuffCmnt(USER, SUB_WAITING_ID, one.chckInsuffApprId(), "임시저장");
        assertThat(text("SELECT tdm61_appr_cmnt FROM tdm61_chck_insuff_appr WHERE tdm61_chck_insuff_appr_id = ?", one.chckInsuffApprId())).isEqualTo("임시저장");
        assertThatThrownBy(() -> service.updateInsuffStatus(SAME_COMPANY_OTHER, SUB_WAITING_ID, one.chckInsuffApprId(), new CheckApprStatusReq("A", YM, "x")))
                .isInstanceOf(BusinessException.class);
    }
}
