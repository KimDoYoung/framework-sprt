package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.service.AlertService;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/**
 * 통합알림(AS-IS server/utils/alert/AlertService, 98d5afdd6 — CH-0277, ecfa0f17b — CH-0400) 규칙. 시험 설정은 회사 위치 kfstest만 메일·SMS 발송.
 * 김형수(202306221546363): 이메일·휴대폰 있음, 회사 28000(kfstest)
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(NoticeTestConfig.class)
class AlertServiceDbTest {

    @Autowired AlertService alert;
    @Autowired JdbcTemplate jdbc;

    private static final long KIM = 202306221546363L;
    /** 메일·SMS 발송이 꺼진 회사(위치 kfimtest) */
    private static final long OFF_COMPANY = 202303231427269L;

    private static List<String> kinds(List<AprNoticeCall> calls) {
        return calls.stream().map(AprNoticeCall::kind).toList();
    }

    @Test
    void 코드별_제목과_같은_문구로_앱알림_메일_SMS가_가고_SMS에는_접속주소가_붙는다() {
        List<AprNoticeCall> calls = alert.plan("M01", KIM, 28000L, Map.of("content", "[Asset-ERP] 화환 시험"));
        assertThat(kinds(calls)).containsExactly("talk", "mail", "sms");
        assertThat(calls.get(0).title()).isEqualTo("화환신청");
        assertThat(calls.get(0).body()).isEqualTo("[Asset-ERP] 화환 시험");
        assertThat(calls.get(1).title()).isEqualTo("[알림] Asset-ERP");
        assertThat(calls.get(1).body()).isEqualTo("[Asset-ERP] 화환 시험");
        assertThat(calls.get(2).to()).isEqualTo("01094903029");
        assertThat(calls.get(2).body()).isEqualTo("[Asset-ERP] 화환 시험\r\n\r\n https://kfstest.k-fs.co.kr:5151/");
    }

    @Test
    void 회사_발송이_꺼져도_M코드는_메일_SMS가_가고_그_밖의_코드는_앱알림만_간다() {
        assertThat(kinds(alert.plan("M03", KIM, OFF_COMPANY, Map.of("content", "x")))).containsExactly("talk", "mail", "sms");
        assertThat(kinds(alert.plan("B03", KIM, OFF_COMPANY, Map.of("content", "x")))).containsExactly("talk");
    }

    @Test
    void 수신을_끈_종류는_보내지_않는다() {
        jdbc.update("insert into emp92_sms_notice (emp92_sms_notice_id, emp92_person_id, emp92_sms_notice_cd, emp92_sms_notice_yn, emp92_mail_notice_yn, emp92_talk_notice_yn) "
                + "values (f_create_seq(), ?, 'A02', 'false', 'true', 'true')", KIM);
        assertThat(kinds(alert.plan("A02", KIM, 28000L, Map.of("count", "3")))).containsExactly("talk", "mail");
    }

    @Test
    void 건수_문구와_건수가_없으면_0건() {
        assertThat(alert.plan("A02", KIM, 28000L, Map.of("count", "3")).get(0).body()).isEqualTo("[Asset-ERP] 사업비요청 3건이 반려되었습니다");
        // 원본-이상한점 234: rejectSendMessage는 "count()" 키로 넘겨 건수가 없다 — ecfa0f17b getCount부터 "null건" 대신 "0건"
        assertThat(alert.plan("A03", KIM, 28000L, Map.of("count()", "3")).get(0).body()).isEqualTo("[Asset-ERP] 지출결의 0건이 반려되었습니다");
    }

    @Test
    void A04_협의승인요청은_제목과_건수_문구() {
        AprNoticeCall talk = alert.plan("A04", KIM, 28000L, Map.of("count", "2")).get(0);
        assertThat(talk.title()).isEqualTo("임직원매매 사전신고 협의승인요청");
        assertThat(talk.body()).isEqualTo("[Asset-ERP] 임직원 매매 사전 협의승인신청 2건이 존재합니다.");
    }

    @Test
    void 이메일_형식이_틀리면_메일만_빠진다() {
        assertThat(AlertService.isValidEmail(" kim@k-fs.co.kr ")).isTrue();
        assertThat(AlertService.isValidEmail("kim@localhost")).isFalse();
        assertThat(AlertService.isValidEmail("kim k-fs.co.kr")).isFalse();
        assertThat(AlertService.isValidEmail("")).isFalse();
        jdbc.update("update emp01_person set emp01_email_addr = 'not-an-email' where emp01_person_id = ?", KIM);
        assertThat(kinds(alert.plan("M01", KIM, 28000L, Map.of("content", "x")))).containsExactly("talk", "sms");
    }

    @Test
    void 결재문서가_없으면_빈_문구() {
        assertThat(alert.plan("T013", KIM, 28000L, Map.of("apprId", -1L)).get(0).body()).isEmpty();
        assertThat(alert.plan("T02", KIM, 28000L, Map.of("apprId", -1L)).get(0).body()).isEmpty();
        assertThat(alert.plan("T011", KIM, 28000L, Map.of("apprId", -1L, "code", "20")).get(0).body()).isEmpty();
    }

    @Test
    void 알림을_보내면_SMS_발송기록이_비고_없이_한_줄_남는다() {
        String marker = "[Asset-ERP] 통합알림 시험 " + System.nanoTime();
        alert.alert("M01", KIM, 28000L, Map.of("content", marker));
        assertThat(jdbc.queryForList("select sms02_note from sms02_history where sms02_content like ?", String.class, marker + "%"))
                .containsExactly((String) null);
    }

    @Test
    void 사원이_없으면_아무것도_보내지_않는다() {
        assertThat(alert.plan("M01", -1L, 28000L, Map.of("content", "x"))).isEmpty();
    }
}
