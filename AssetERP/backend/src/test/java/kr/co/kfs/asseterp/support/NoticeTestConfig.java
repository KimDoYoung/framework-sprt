package kr.co.kfs.asseterp.support;

import java.util.List;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import kr.co.kfs.asseterp.common.notice.NoticeResult;
import kr.co.kfs.asseterp.common.notice.NoticeSender;

/** 결재 알림(AA01)을 쓰는 DB 테스트용 설정 — 회사 위치 kfstest에서 메일·SMS를 켜고, 보내는 부품은 아무 데도 보내지 않는다 */
@TestConfiguration
public class NoticeTestConfig {

    @Bean
    @Primary
    NoticeProperties testNoticeProperties() {
        return new NoticeProperties("disabled", null, null, null, null, null, "027858100", null, null, null, null, "erp.sender@k-fs.co.kr",
                List.of("kfstest"), List.of("kfstest"));
    }

    @Bean
    @Primary
    NoticeSender testNoticeSender() {
        return new NoticeSender() {
            @Override
            public NoticeResult sendTalk(String email, String title, String body) {
                return NoticeResult.fail("test");
            }

            @Override
            public NoticeResult sendSms(List<String> mobiles, String message) {
                return NoticeResult.fail("test");
            }

            @Override
            public NoticeResult sendMail(String toEmail, String subject, String htmlBody) {
                return NoticeResult.fail("test");
            }
        };
    }
}
