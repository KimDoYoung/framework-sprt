package kr.co.kfs.asseterp.biz.emp.service;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpMailCheckRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpPersonMailRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpPersonMailSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpPersonMailMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.mail.MailServerConfig;
import kr.co.kfs.asseterp.common.mail.SmtpMailTransport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Properties;

/** 본인 메일 계정 (AS-IS client Emp10_Lookup_MailRetrieve + server emp.Emp01_Person.changeMail/resetMail + utils.mail.SendMailSMTP.checkMail, EE35) */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpPersonMailService {

    private static final String SMTP_TIMEOUT = "15000";

    private final EmpPersonMailMapper mapper;
    private final SmtpMailTransport transport;

    /** AS-IS Emp01_Person.selectByPersonId — 로그인 사원의 메일주소·복호 비밀번호 */
    public EmpPersonMailRes get(UserPrincipal user) {
        EmpPersonMailRes row = mapper.selectMail(user.getUserId());
        return row == null ? new EmpPersonMailRes(null, null) : row;
    }

    /** AS-IS Emp01_Person.changeMail */
    @Transactional
    public int change(UserPrincipal user, EmpPersonMailSaveReq req) {
        return mapper.changeMail(user.getUserId(), req.mailAddress(), req.password());
    }

    /** AS-IS Emp01_Person.resetMail — 비밀번호를 비운다 */
    @Transactional
    public int reset(UserPrincipal user) {
        return mapper.resetMail(user.getUserId());
    }

    /** AS-IS SendMailSMTP.checkMail L757-814: 회사 메일서버로 입력한 계정이 자기에게 시험 메일을 보낸다 */
    public EmpMailCheckRes check(UserPrincipal user, EmpPersonMailSaveReq req) {
        if (req.mailAddress() == null || req.mailAddress().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "메일주소를 입력하세요");
        }
        String mailInfo = mapper.selectMailInfo(user.getCompanyId());
        Properties config = MailServerConfig.load(mailInfo);
        if (config == null) {
            log.error("메일서버의 설정파일을 읽는데 실패했습니다 : {}", mailInfo);
            return new EmpMailCheckRes(false, "메일서버( " + mailInfo + " )가 설정되지 않았습니다. 관리자에게 연락바랍니다.");
        }
        Properties properties = new Properties();
        properties.putAll(config);
        properties.putIfAbsent("mail.smtp.connectiontimeout", SMTP_TIMEOUT);
        properties.putIfAbsent("mail.smtp.timeout", SMTP_TIMEOUT);
        properties.putIfAbsent("mail.smtp.writetimeout", SMTP_TIMEOUT);

        String username = req.mailAddress();
        String password = req.password();
        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
        MimeMessage message;
        try {
            message = new MimeMessage(session);
            message.setSentDate(new Date());
            message.setFrom(new InternetAddress(username));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(username));
            message.setSubject("Asset-ERP 메일발송 테스트", "utf-8");
            MimeBodyPart body = new MimeBodyPart();
            body.setContent("Asset-ERP 발송 테스트 메일입니다. 해당 메일주소가 Asset-ERP에 정상적으로 등록되었습니다. 감사합니다.", "text/html; charset=utf-8");
            MimeMultipart multipart = new MimeMultipart();
            multipart.addBodyPart(body);
            message.setContent(multipart);
        } catch (MessagingException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "메일주소가 올바르지 않습니다");
        }
        try {
            transport.send(message);
            return new EmpMailCheckRes(true, "Asset-ERP 테스트 메일이 입력하신 메일주소로 발송되었습니다. 미수신시 관리자에게 연락부탁드립니다");
        } catch (Exception e) {
            log.warn("메일 검증 실패: {} ({})", username, e.getMessage());
            return new EmpMailCheckRes(false, "사용자 이름과 비밀번호가 허용되지 않습니다. 웹메일 비밀번호를 확인하세요");
        }
    }
}
