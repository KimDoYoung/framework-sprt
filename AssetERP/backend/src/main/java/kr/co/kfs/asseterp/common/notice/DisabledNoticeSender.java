package kr.co.kfs.asseterp.common.notice;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/** 기본 구현 — 어떤 경우에도 밖으로 보내지 않고 로그만 남긴다 */
@Slf4j
@Component
@ConditionalOnProperty(name = "asseterp.notice.mode", havingValue = "disabled", matchIfMissing = true)
public class DisabledNoticeSender implements NoticeSender {

    @Override
    public NoticeResult sendTalk(String email, String title, String body) {
        log.info("앱알림 발송 안 함(mode=disabled): {} / {}", email, title);
        return NoticeResult.fail("mode=disabled");
    }

    @Override
    public NoticeResult sendSms(List<String> mobiles, String message) {
        log.info("SMS 발송 안 함(mode=disabled): {}", mobiles);
        return NoticeResult.fail("mode=disabled");
    }

    @Override
    public NoticeResult sendMail(String toEmail, String subject, String htmlBody) {
        log.info("메일 발송 안 함(mode=disabled): {} / {}", toEmail, subject);
        return NoticeResult.fail("mode=disabled");
    }
}
