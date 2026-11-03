package kr.co.kfs.asseterp.common.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.Transport;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Component;

/** 실제 SMTP 전송 한 곳. 시험에서는 이 빈을 가짜로 바꿔 메일이 나가지 않게 한다 (AS-IS Transport.send) */
@Component
public class SmtpMailTransport {

    public void send(MimeMessage message) throws MessagingException {
        Transport.send(message);
    }
}
