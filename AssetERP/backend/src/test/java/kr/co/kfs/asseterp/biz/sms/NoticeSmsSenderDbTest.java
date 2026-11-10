package kr.co.kfs.asseterp.biz.sms;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.sms.mapper.SmsGroupSendHistoryMapper;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsHistoryMapper;
import kr.co.kfs.asseterp.biz.sms.service.NoticeSmsSender;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.notice.NoticeResult;
import kr.co.kfs.asseterp.common.notice.NoticeSender;

/** 문자 발송 구현 — 발송 결과에 따른 sms02·sms04 기록과 거절을 asseterpdb에서 확인한다(@MybatisTest는 테스트마다 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class NoticeSmsSenderDbTest {

    @Autowired SmsHistoryMapper historyMapper;
    @Autowired SmsGroupSendHistoryMapper groupHistoryMapper;
    @Autowired JdbcTemplate jdbc;

    /** 보낸 번호·문구를 모으고, ok로 정한 결과를 돌려주는 가짜 발송부 */
    static class FakeNoticeSender implements NoticeSender {
        final List<String> sent = new ArrayList<>();
        final boolean ok;
        FakeNoticeSender(boolean ok) { this.ok = ok; }
        @Override public NoticeResult sendTalk(String email, String title, String body) { return NoticeResult.success(); }
        @Override public NoticeResult sendSms(List<String> mobiles, String message) {
            sent.add(mobiles.get(0) + "|" + message);
            return ok ? NoticeResult.success() : NoticeResult.fail("sim down");
        }
        @Override public NoticeResult sendMail(String toEmail, String subject, String htmlBody) { return NoticeResult.success(); }
    }

    private static NoticeProperties props(String mode) {
        return new NoticeProperties(mode, null, null, null, null, null, null, null, null, null, null, null, List.of("kfs"), List.of());
    }

    private NoticeSmsSender sender(String mode, FakeNoticeSender fake) {
        return new NoticeSmsSender(fake, props(mode), historyMapper, groupHistoryMapper);
    }

    private int count(String table) {
        return jdbc.queryForObject("select count(*) from " + table, Integer.class);
    }

    @Test
    void 한_명_발송이_성공하면_sms02에_남긴다() {
        FakeNoticeSender fake = new FakeNoticeSender(true);
        int before = count("sms02_history");
        sender("sim", fake).send(28000L, null, "010-1234-5678", "[Asset-ERP] 시험", "홍길동");
        assertThat(fake.sent).containsExactly("01012345678|[Asset-ERP] 시험");
        assertThat(count("sms02_history")).isEqualTo(before + 1);
        assertThat(jdbc.queryForObject("select sms02_note from sms02_history where sms02_company_id = 28000 and sms02_content = '[Asset-ERP] 시험' order by sms02_history_id desc limit 1", String.class))
                .isEqualTo("01012345678");
    }

    @Test
    void 단체_발송이_성공하면_sms04에_남긴다() {
        int before02 = count("sms02_history");
        int before04 = count("sms04_group_send_history");
        sender("sim", new FakeNoticeSender(true)).send(28000L, 99L, "010-1234-5678", "[Asset-ERP] 단체", "회사 홍길동");
        assertThat(count("sms04_group_send_history")).isEqualTo(before04 + 1);
        assertThat(count("sms02_history")).isEqualTo(before02);
    }

    @Test
    void 발송이_실패하거나_disabled면_거절하고_남기지_않는다() {
        int before = count("sms02_history");
        assertThatThrownBy(() -> sender("sim", new FakeNoticeSender(false)).send(28000L, null, "010-1", "x", "y")).isInstanceOf(BusinessException.class);
        FakeNoticeSender off = new FakeNoticeSender(true);
        assertThatThrownBy(() -> sender("disabled", off).send(28000L, null, "010-1", "x", "y")).isInstanceOf(BusinessException.class);
        assertThat(off.sent).isEmpty();
        assertThatThrownBy(() -> sender("sim", new FakeNoticeSender(true)).send(28000L, null, null, "x", "y")).isInstanceOf(BusinessException.class);
        assertThat(count("sms02_history")).isEqualTo(before);
    }

    @Test
    void 회사_문자발신_신청은_위치로_본다() {
        String loc = historyMapper.selectCompanyLoc(28000L);
        NoticeSmsSender s = new NoticeSmsSender(new FakeNoticeSender(true),
                new NoticeProperties("sim", null, null, null, null, null, null, null, null, null, null, null, List.of(loc), List.of()), historyMapper, groupHistoryMapper);
        assertThat(s.companyEnabled(28000L)).isTrue();
        assertThat(sender("sim", new FakeNoticeSender(true)).companyEnabled(28000L)).isEqualTo("kfs".equals(loc));
    }
}
