package kr.co.kfs.asseterp.biz.emp;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitPayRequestRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpBenefitService;
import kr.co.kfs.asseterp.biz.sms.service.DisabledSmsSender;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** U05(복리후생비 관리)의 쓰기·문서폐기를 asseterpdb에서 실제로 돌리고 롤백한다 (@MybatisTest는 테스트마다 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpBenefitService.class, DisabledSmsSender.class})
class EmpBenefitDbTest {

    @Autowired EmpBenefitService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();
    private final LocalDate from = LocalDate.of(2020, 1, 1);
    private final LocalDate to = LocalDate.of(2026, 12, 31);

    @Test
    void 지출결의_등록_제거는_기준년월만_바꾼다() {
        List<BenefitRes> top = service.search(user, from, to, "%", "");
        assertThat(top).isNotEmpty();
        List<Long> ids = top.stream().map(BenefitRes::benefitId).toList();

        assertThat(service.updatePayRequestYm(user, ids, "2099.01")).isEqualTo(ids.size());
        assertThat(service.search(user, from, to, "%", "")).isEmpty();  // 지출결의에 들어간 신청은 위 그리드에서 빠진다
        assertThat(service.searchPayRequests(user, "2099.01", "%", "%", "")).hasSize(ids.size());
        assertThat(service.checkPayRequest(user, "2099", "01", ids)).isNull();  // 2099.01에는 상신된 지출결의서가 없다

        assertThat(service.updatePayRequestYm(user, ids, null)).isEqualTo(ids.size());
        assertThat(service.search(user, from, to, "%", "")).hasSize(ids.size());
        assertThatThrownBy(() -> service.updatePayRequestYm(user, List.of(), "2099.01")).isInstanceOf(BusinessException.class);
    }

    @Test
    void 이미_상신된_기준년월이면_등록을_막는다() {
        // 2025.03은 상신 완료(30) 문서가 있다 → 같은 신청구분은 "이미 생성"
        BenefitRes inMarch = service.searchPayRequests(user, "2025.03", "%", "%", "").get(0);
        String msg = service.checkPayRequest(user, "2025", "03", List.of(inMarch.benefitId()));
        assertThat(msg).contains("2025년 03월").contains("지출결의서가 이미 생성되어 있습니다");
        BenefitPayRequestRes status = service.getPayRequest(user, "2025.03", inMarch.benefitCode());
        assertThat(status.payRequestApprStatusCode()).isEqualTo("30");
        assertThat(service.getPayRequestApprId(user, "2025.03", inMarch.benefitCode())).isEqualTo(status.payRequestApprId());
    }

    @Test
    void 지급확인_취소는_지급여부만_바꾼다() {
        BenefitRes row = service.searchPayRequests(user, "2025.03", "%", "false", "").get(0);
        assertThat(service.updateBenefitYn(user, List.of(row.benefitId()), true)).isEqualTo(1);
        assertThat(service.searchPayRequests(user, "2025.03", "%", "true", "")).extracting(BenefitRes::benefitId).contains(row.benefitId());
        assertThat(service.updateBenefitYn(user, List.of(row.benefitId()), false)).isEqualTo(1);
        assertThat(service.searchPayRequests(user, "2025.03", "%", "true", "")).extracting(BenefitRes::benefitId).doesNotContain(row.benefitId());
    }

    @Test
    void 알림내용_저장_문자발송_거절() {
        BenefitRes row = service.search(user, from, to, "%", "").get(0);
        service.updateNote(user, row.benefitId(), "시험 알림");
        assertThat(jdbc.queryForObject("select emp17_note from emp17_benefit where emp17_benefit_id = ?", String.class, row.benefitId())).isEqualTo("시험 알림");
        assertThatThrownBy(() -> service.updateNote(user, -1L, "x")).isInstanceOf(BusinessException.class);
        // 발송 연동(SmsSender)이 없으면 보내지 않고 거절한다
        assertThatThrownBy(() -> service.sendMessage(user, row.benefitId(), "시험 알림")).isInstanceOf(BusinessException.class);
    }

    @Test
    void 문서폐기는_삭제이력을_남기고_상신ID를_비운다() {
        BenefitRes row = service.search(user, from, to, "%", "").stream().filter(r -> r.apprId() != null).findFirst().orElseThrow();
        int before = jdbc.queryForObject("select count(*) from apr99_appr_del", Integer.class);
        service.discardAppr(user, row.benefitId());
        assertThat(jdbc.queryForObject("select count(*) from apr99_appr_del", Integer.class)).isEqualTo(before + 1);
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, row.apprId())).isZero();
        assertThat(jdbc.queryForObject("select emp17_appr_id from emp17_benefit where emp17_benefit_id = ?", Long.class, row.benefitId())).isNull();
    }

    @Test
    void 신청구분_콤보는_이_회사가_쓰는_코드만() {
        assertThat(service.searchTypes(user)).hasSize(5).extracting("code").contains("010BN");
    }
}
