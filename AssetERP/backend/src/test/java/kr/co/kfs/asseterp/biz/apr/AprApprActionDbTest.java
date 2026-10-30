package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprActionRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprActionStateRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprActionService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V02 결재 처리 쓰기를 asseterpdb의 실제 문서로 돌리고 롤백한다 (@MybatisTest는 테스트마다 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprApprActionService.class, AprApprDetailService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprApprActionDbTest {

    @Autowired AprApprActionService service;
    @Autowired AprApprDetailService detail;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).roles(List.of("ROLE_USER")).build();
    }

    /** 202609229873969: 상신자 29035 · 결재자 202312071648256 한 명(대기) · 링크 없음 */
    private static final long SIMPLE = 202609229873969L;
    /** 202608249852607: 상신자 29035 → 29049 승인 → 202306221546363 대기 → 202406201712129 대기 */
    private static final long MIDDLE = 202608249852607L;
    /** 202609219873793: 상신자 29049 · A01 링크 문서 · 결재자 202312071648256 대기 */
    private static final long LINKED = 202609219873793L;

    private String stepStatus(long apprId, long stepEmpId) {
        return jdbc.queryForObject("select apr04_step_status_cd from apr04_appr_step where apr04_appr_id = ? and apr04_step_emp_id = ?", String.class, apprId, stepEmpId);
    }

    private String docStatus(long apprId) {
        return jdbc.queryForObject("select apr01_status_cd from apr01_appr where apr01_appr_id = ?", String.class, apprId);
    }

    @Test
    void 단추는_사원과_문서_상태에_따라_켜진다() {
        AprApprActionStateRes approver = service.getState(user(202312071648256L), SIMPLE);
        assertThat(approver.canConfirm()).isTrue();
        assertThat(approver.canCancelRequest()).isFalse();
        AprApprActionStateRes submitter = service.getState(user(29035L), SIMPLE);
        assertThat(submitter.canConfirm()).isFalse();
        assertThat(submitter.canCancelRequest()).isTrue();     // 아직 아무도 결재하지 않았으니 상신취소
        AprApprActionStateRes outsider = service.getState(user(1L), SIMPLE);
        assertThat(outsider.canConfirm() || outsider.canCancelApproval() || outsider.canCancelRequest()).isFalse();

        // 진행중 문서: 내가 승인한 29049는 승인취소, 대기중인 첫 결재자만 승인, 두번째 대기자는 아직 차례 아님
        assertThat(service.getState(user(29049L), MIDDLE).canCancelApproval()).isTrue();
        assertThat(service.getState(user(202306221546363L), MIDDLE).canConfirm()).isTrue();
        assertThat(service.getState(user(202406201712129L), MIDDLE).canConfirm()).isFalse();
        assertThat(service.getState(user(29035L), MIDDLE).canCancelRequest()).isFalse();     // 이미 결재가 진행됨
    }

    @Test
    void 승인은_결재선과_문서_상태를_바꾸고_서명을_붙인다() {
        AprApprActionRes res = service.confirm(user(202312071648256L), SIMPLE, "confirm", "확인했습니다");
        assertThat(res.ok()).isTrue();
        assertThat(stepStatus(SIMPLE, 202312071648256L)).isEqualTo("20");
        assertThat(docStatus(SIMPLE)).isEqualTo("30");   // 마지막 결재자 → 완료
        assertThat(jdbc.queryForObject("select apr04_note from apr04_appr_step where apr04_appr_id = ? and apr04_step_emp_id = ?", String.class, SIMPLE, 202312071648256L)).isEqualTo("확인했습니다");
        assertThat(jdbc.queryForObject("select apr04_appr_emp_id from apr04_appr_step where apr04_appr_id = ? and apr04_step_emp_id = ?", Long.class, SIMPLE, 202312071648256L)).isEqualTo(202312071648256L);
        // 이미 결재한 사람은 다시 승인할 수 없다
        assertThat(service.confirm(user(202312071648256L), SIMPLE, "confirm", null).ok()).isFalse();
    }

    @Test
    void 반려는_문서를_반려로_바꾸고_사유가_없으면_기본_문구() {
        assertThat(service.confirm(user(202312071648256L), SIMPLE, "reject", "").ok()).isTrue();
        assertThat(stepStatus(SIMPLE, 202312071648256L)).isEqualTo("30");
        assertThat(docStatus(SIMPLE)).isEqualTo("40");
        assertThat(jdbc.queryForObject("select apr04_reject_reason from apr04_appr_step where apr04_appr_id = ? and apr04_step_emp_id = ?", String.class, SIMPLE, 202312071648256L)).isEqualTo("반려사유 미입력");
    }

    @Test
    void 중간_결재자_승인은_문서를_결재중으로_두고_승인취소로_되돌린다() {
        assertThat(service.confirm(user(202306221546363L), MIDDLE, "confirm", null).ok()).isTrue();
        assertThat(stepStatus(MIDDLE, 202306221546363L)).isEqualTo("20");
        assertThat(docStatus(MIDDLE)).isEqualTo("20");
        // 다음 결재자(202406201712129)가 아직 결재 전이므로 승인취소 가능
        assertThat(service.getState(user(202306221546363L), MIDDLE).canCancelApproval()).isTrue();
        assertThat(service.cancelApproval(user(202306221546363L), MIDDLE).ok()).isTrue();
        assertThat(stepStatus(MIDDLE, 202306221546363L)).isEqualTo("10");
        assertThat(jdbc.queryForObject("select apr04_appr_date from apr04_appr_step where apr04_appr_id = ? and apr04_step_emp_id = ?", java.sql.Timestamp.class, MIDDLE, 202306221546363L)).isNull();
    }

    @Test
    void 상신취소는_문서를_임시저장으로_되돌린다() {
        AprApprActionRes res = service.cancelRequest(user(29035L), SIMPLE, false);
        assertThat(res.ok()).isTrue();
        assertThat(docStatus(SIMPLE)).isEqualTo("99");
        assertThat(stepStatus(SIMPLE, 29035L)).isEqualTo("10");
        // 결재자가 승인한 뒤에는 상신취소할 수 없다
        assertThat(service.cancelRequest(user(29035L), MIDDLE, false).ok()).isFalse();
    }

    @Test
    void 특정_화면에서_상신된_문서는_확인을_받은_뒤_폐기문서로_옮긴다() {
        AprApprActionRes ask = service.cancelRequest(user(29049L), LINKED, false);
        assertThat(ask.ok()).isFalse();
        assertThat(ask.needConfirm()).isTrue();
        assertThat(docStatus(LINKED)).isEqualTo("10");           // 확인 전에는 그대로
        int before = jdbc.queryForObject("select count(*) from apr99_appr_del where apr99_appr_id = ?", Integer.class, LINKED);

        assertThat(service.cancelRequest(user(29049L), LINKED, true).ok()).isTrue();
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, LINKED)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from apr99_appr_del where apr99_appr_id = ?", Integer.class, LINKED)).isEqualTo(before + 1);
    }

    @Test
    void 결재선의_실결재자는_서버가_채운다() {
        List<AprApprStepRes> steps = detail.getSteps(user(29035L), MIDDLE);
        assertThat(steps).isNotEmpty().allMatch(s -> s.apprEmpId() != null && s.seq() != null);
        assertThat(steps.get(0).stepEmpId()).isEqualTo(29035L);
    }
}
