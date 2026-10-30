package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.transaction.TestTransaction;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprActionRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprActionService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import kr.co.kfs.asseterp.common.notice.NoticeSender;
import kr.co.kfs.asseterp.common.notice.SimNoticeSender;

/**
 * AA01 끝에서 끝까지: 임시 문서를 만들어 결재자 A가 승인하면 알림 시뮬레이터에 다음 결재자 B에게 앱알림·메일·SMS가 도착하는지 본다.
 * 알림은 커밋 뒤에 가므로 이 테스트만 임시 문서를 커밋하고, 끝에 반드시 지운다(finally). 시뮬레이터가 안 떠 있으면 건너뛴다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprApprActionService.class, AprApprDetailService.class, AprNoticeService.class, AprNoticeE2eDbTest.Config.class})
class AprNoticeE2eDbTest {

    private static final String BASE = "http://127.0.0.1:5161";

    @TestConfiguration
    static class Config {
        static NoticeProperties props() {
            return new NoticeProperties("sim", BASE + "/talk/api/sendmsg", "sim-talk-key", BASE + "/index.php/api_v2/sms_change_word", "sim-sms", "sim-sms-key",
                    "027858100", "127.0.0.1", 2525, "erp.sender@k-fs.co.kr", "sim", "erp.sender@k-fs.co.kr", List.of("kfstest"), List.of("kfstest"));
        }

        @Bean
        @Primary
        NoticeProperties e2eNoticeProperties() {
            return props();
        }

        @Bean
        @Primary
        NoticeSender e2eNoticeSender() {
            return new SimNoticeSender(props());
        }
    }

    @Autowired AprApprActionService service;
    @Autowired JdbcTemplate jdbc;

    private final HttpClient http = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private JsonNode get(String path) throws Exception {
        return mapper.readTree(http.send(HttpRequest.newBuilder(URI.create(BASE + path)).GET().build(), HttpResponse.BodyHandlers.ofString()).body());
    }

    @Test
    void 승인하면_다음_결재자에게_알림이_시뮬레이터로_간다() throws Exception {
        boolean up;
        try {
            up = get("/__health").path("ok").asBoolean(false);
        } catch (Exception e) {
            up = false;
        }
        assumeTrue(up, "알림 시뮬레이터가 안 떠 있어 건너뜀");
        get("/__reset");

        long submitter = 29035L;                 // 정서현
        long a = 202312071648256L;               // 김팀장 (먼저 승인)
        long b = 202306221546363L;               // 김형수 (다음 결재자 — 알림 받을 사람)
        long apprId = jdbc.queryForObject("select f_create_seq()", Long.class);
        String title = "AA01 알림 시험 문서 " + apprId;
        try {
            jdbc.update("insert into apr01_appr (apr01_appr_id, apr01_title, apr01_reg_date, apr01_status_cd, apr01_reg_emp_id, apr01_class_tree_id, apr01_company_id, apr01_inout_cd, apr01_content) "
                    + "values (?, ?, now(), '20', ?, 30464, 28000, '20', '<p>AA01 시험</p>')", apprId, title, submitter);
            jdbc.update("insert into apr04_appr_step (apr04_appr_step_id, apr04_appr_id, apr04_step_type_cd, apr04_seq, apr04_step_status_cd, apr04_step_emp_id, apr04_appr_date) values (f_create_seq(), ?, '00', '001', '20', ?, now())", apprId, submitter);
            jdbc.update("insert into apr04_appr_step (apr04_appr_step_id, apr04_appr_id, apr04_step_type_cd, apr04_seq, apr04_step_status_cd, apr04_step_emp_id) values (f_create_seq(), ?, '10', '002', '10', ?)", apprId, a);
            jdbc.update("insert into apr04_appr_step (apr04_appr_step_id, apr04_appr_id, apr04_step_type_cd, apr04_seq, apr04_step_status_cd, apr04_step_emp_id) values (f_create_seq(), ?, '10', '003', '10', ?)", apprId, b);

            UserPrincipal userA = UserPrincipal.builder().userId(a).name("김팀장").companyId(28000L).roles(List.of("ROLE_USER")).build();
            AprApprActionRes res = service.confirm(userA, apprId, "confirm", "시험 승인");
            assertThat(res.ok()).as(res.message()).isTrue();

            // 알림은 커밋 뒤에 간다
            TestTransaction.flagForCommit();
            TestTransaction.end();

            JsonNode calls = get("/__calls");
            assertThat(calls).hasSize(3);
            for (JsonNode c : calls) {
                assertThat(c.path("problems")).as(c.toString()).isEmpty();
                assertThat(c.path("result").asText()).isEqualTo("ok");
            }
            String head = "결재문서  '(기업탐방) " + title + "' 건의 다음 결재자입니다.";
            JsonNode talk = get("/__calls?kind=talk").get(0);
            assertThat(talk.path("to").asText()).isEqualTo("wosawd@k-fs.co.kr");
            assertThat(talk.path("title").asText()).isEqualTo("상신문서(결재순서)");
            assertThat(talk.path("body").asText()).isEqualTo(head);
            JsonNode mail = get("/__calls?kind=mail").get(0);
            assertThat(mail.path("to").asText()).isEqualTo("wosawd@k-fs.co.kr");
            assertThat(mail.path("title").asText()).isEqualTo("[알림] Asset-ERP 전자결재");
            assertThat(mail.path("body").asText()).contains(head);
            JsonNode sms = get("/__calls?kind=sms").get(0);
            assertThat(sms.path("to").asText()).isEqualTo("01094903029");
            assertThat(sms.path("body").asText()).contains("정서현(으)로부터").contains("'" + title + "'").contains("https://kfstest.k-fs.co.kr:5151/");
        } finally {
            if (!TestTransaction.isActive()) {
                TestTransaction.start();
            }
            jdbc.update("delete from apr04_appr_step where apr04_appr_id = ?", apprId);
            jdbc.update("delete from apr01_appr where apr01_appr_id = ?", apprId);
            TestTransaction.flagForCommit();
            TestTransaction.end();
        }
        TestTransaction.start();
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, apprId)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from apr04_appr_step where apr04_appr_id = ?", Integer.class, apprId)).isZero();
    }
}
