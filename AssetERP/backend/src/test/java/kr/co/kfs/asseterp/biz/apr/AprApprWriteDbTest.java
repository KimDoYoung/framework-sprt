package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveStepReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprWriteRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprWriteService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V03 상신·임시저장 쓰기를 asseterpdb에서 돌리고 롤백한다 (@MybatisTest는 테스트마다 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprApprWriteService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprApprWriteDbTest {

    @Autowired AprApprWriteService service;
    @Autowired JdbcTemplate jdbc;

    private static final long ME = 29035L;
    private static final long APPROVER = 202312071648256L;
    private static final long REFERER = 29049L;
    /** 202609229873969 문서의 문서분류 */
    private static final long SIMPLE = 202609229873969L;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, SIMPLE);
    }

    private static AprApprSaveStepReq step(String type, String seq, long emp) {
        return new AprApprSaveStepReq(null, type, seq, null, emp, "false", null);
    }

    private AprApprSaveReq req(String mode, String title, String inOut, List<AprApprSaveStepReq> steps, boolean confirmed) {
        return new AprApprSaveReq(mode, classTreeId(), null, title, "<p>본문</p>", null, LocalDateTime.of(2026, 11, 2, 0, 0), LocalDateTime.of(2026, 10, 31, 0, 0),
                null, null, null, inOut, null, null, null, null, "의견", confirmed, steps);
    }

    private String docStatus(long id) {
        return jdbc.queryForObject("select apr01_status_cd from apr01_appr where apr01_appr_id = ?", String.class, id);
    }

    private int stepCount(long id) {
        return jdbc.queryForObject("select count(*) from apr04_appr_step where apr04_appr_id = ?", Integer.class, id);
    }

    @Test
    void 임시저장은_새_문서를_넣고_다시_저장하면_고친다() {
        long id = service.nextApprId();
        List<AprApprSaveStepReq> steps = List.of(step("00", "001", ME), step("10", "002", APPROVER), step("30", "003", REFERER));
        AprApprWriteRes res = service.save(user(ME), id, req("save", "시험 제목", "20", steps, false));
        assertThat(res.ok()).isTrue();
        assertThat(res.statusCode()).isEqualTo("99");
        assertThat(docStatus(id)).isEqualTo("99");
        assertThat(stepCount(id)).isEqualTo(3);
        assertThat(jdbc.queryForObject("select apr01_reg_emp_id from apr01_appr where apr01_appr_id = ?", Long.class, id)).isEqualTo(ME);

        assertThat(service.save(user(ME), id, req("save", "고친 제목", "20", steps.subList(0, 2), false)).ok()).isTrue();
        assertThat(jdbc.queryForObject("select apr01_title from apr01_appr where apr01_appr_id = ?", String.class, id)).isEqualTo("고친 제목");
        assertThat(stepCount(id)).isEqualTo(2);
        assertThat(jdbc.queryForObject("select apr04_step_status_cd from apr04_appr_step where apr04_appr_id = ? and apr04_seq = '001'", String.class, id)).isEqualTo("10");
    }

    @Test
    void 결재요청은_상신자_단계를_승인으로_두고_문서를_상신으로_바꾼다() {
        long id = service.nextApprId();
        List<AprApprSaveStepReq> steps = List.of(step("00", "001", ME), step("10", "002", APPROVER), step("30", "003", REFERER));
        AprApprWriteRes res = service.save(user(ME), id, req("request", "상신 시험", "20", steps, false));
        assertThat(res.ok()).isTrue();
        assertThat(res.statusCode()).isEqualTo("10");
        assertThat(jdbc.queryForObject("select apr04_step_status_cd from apr04_appr_step where apr04_appr_id = ? and apr04_seq = '001'", String.class, id)).isEqualTo("20");
        assertThat(jdbc.queryForObject("select apr04_note from apr04_appr_step where apr04_appr_id = ? and apr04_seq = '001'", String.class, id)).isEqualTo("의견");
        assertThat(jdbc.queryForObject("select apr04_appr_emp_id from apr04_appr_step where apr04_appr_id = ? and apr04_seq = '001'", Long.class, id)).isEqualTo(ME);
        assertThat(jdbc.queryForObject("select apr04_step_status_cd from apr04_appr_step where apr04_appr_id = ? and apr04_seq = '002'", String.class, id)).isEqualTo("10");
        assertThat(jdbc.queryForObject("select apr04_step_status_cd from apr04_appr_step where apr04_appr_id = ? and apr04_seq = '003'", String.class, id)).isNull();
        // 상신된 문서는 상신자라도 다시 저장할 수 없다
        assertThat(service.save(user(ME), id, req("save", "다시", "20", steps, false)).ok()).isFalse();
    }

    @Test
    void 결재권자가_없으면_한_번_묻고_확인하면_바로_완료한다() {
        long id = service.nextApprId();
        List<AprApprSaveStepReq> steps = List.of(step("00", "001", ME), step("30", "002", REFERER));
        AprApprWriteRes ask = service.save(user(ME), id, req("request", "바로 완료", "20", steps, false));
        assertThat(ask.ok()).isFalse();
        assertThat(ask.notice()).isEqualTo("confirm");
        assertThat(ask.message()).isEqualTo("결재선에 상신자 외 결재권자가 없습니다. 계속 진행하시겠습니까?");
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, id)).isZero();

        AprApprWriteRes done = service.save(user(ME), id, req("request", "바로 완료", "20", steps, true));
        assertThat(done.ok()).isTrue();
        assertThat(done.statusCode()).isEqualTo("30");
    }

    @Test
    void 입력_검사는_원본_메시지를_그대로_쓴다() {
        long id = service.nextApprId();
        List<AprApprSaveStepReq> steps = List.of(step("00", "001", ME), step("10", "002", APPROVER));
        assertThat(service.save(user(ME), id, req("save", "", "20", steps, false)).message()).isEqualTo("제목은 반드시 입력하셔야 합니다");
        assertThat(service.save(user(ME), id, req("request", "", "20", steps, false)).message()).isEqualTo("상신제목은 필수입력 항목입니다");
        assertThat(service.save(user(ME), id, req("save", "x".repeat(201), "20", steps, false)).message()).isEqualTo("상신제목의 글자수가 초과하였습니다");
        assertThat(service.save(user(ME), id, req("save", "대외", "10", steps, false)).message()).isEqualTo("대외문서에 대표회사는 필수입력항목입니다.");
        AprApprSaveReq inner = new AprApprSaveReq("request", classTreeId(), null, "사내", "<p>x</p>", null, LocalDateTime.now(), LocalDateTime.now(),
                7L, null, null, "20", null, null, null, null, null, false, steps);
        assertThat(service.save(user(ME), id, inner).message()).isEqualTo("사내문서는 인감사용이 불가능합니다.");
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, id)).isZero();
    }

    @Test
    void 남의_문서나_상신된_문서는_고치거나_지울_수_없고_임시저장은_지운다() {
        long id = service.nextApprId();
        List<AprApprSaveStepReq> steps = List.of(step("00", "001", ME), step("10", "002", APPROVER));
        assertThat(service.save(user(ME), id, req("save", "지울 문서", "20", steps, false)).ok()).isTrue();
        assertThat(service.save(user(APPROVER), id, req("save", "가로채기", "20", steps, false)).ok()).isFalse();
        assertThat(service.delete(user(APPROVER), id).ok()).isFalse();
        assertThat(service.delete(user(ME), SIMPLE).ok()).isFalse();   // 상신된 문서

        assertThat(service.delete(user(ME), id).ok()).isTrue();
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, id)).isZero();
        assertThat(stepCount(id)).isZero();
    }
}
