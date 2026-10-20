package kr.co.kfs.asseterp.biz.cmp.service;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailBookRes;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailBookSaveReq;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailCheckReq;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailCheckRes;
import kr.co.kfs.asseterp.biz.cmp.mapper.CmpMailBookMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.mail.MailServerConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Properties;

/** AS-IS server/cmp/Cmp10_MailBook.java + server/cmp/Cmp11_MailRole.deleteByMailBookId (G13 Cmp10_Tab_MailBook·Cmp10_Edit_Tab_MailBook), 메일 검증은 utils.mail.SendMailSMTP.checkCompanyMail */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CmpMailBookService {

    /** 연결·응답 대기(밀리초). AS-IS에는 없어 잘못된 메일서버에서 오래 멈추는 것을 막는다 */
    private static final String SMTP_TIMEOUT = "15000";

    private final CmpMailBookMapper mapper;

    /** AS-IS Cmp10_MailBook.selectByCompanyId L26 */
    public List<CmpMailBookRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS Cmp10_MailBook.modelUpdate L38 (새 메일: 새 ID·회사 = 로그인·비밀번호 = createPassword) */
    @Transactional
    public CmpMailBookRes create(UserPrincipal user, CmpMailBookSaveReq req) {
        long id = mapper.selectNextId();
        mapper.insertMailBook(id, user.getCompanyId(), req.emailAddr(), mapper.createPassword(req.decPassword()), req.note());
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** AS-IS Cmp10_MailBook.modelUpdate L38 (고친 메일: 비고만 바뀐다) */
    @Transactional
    public CmpMailBookRes update(UserPrincipal user, Long mailBookId, CmpMailBookSaveReq req) {
        if (mapper.updateNote(user.getCompanyId(), mailBookId, req.note()) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "공용메일을 찾을 수 없습니다");
        }
        return mapper.selectById(user.getCompanyId(), mailBookId);
    }

    /** AS-IS Cmp11_MailRole.deleteByMailBookId L28 → Cmp10_MailBook.delete L73: 권한자를 먼저 지우고 공용메일을 지운다. 지운 공용메일 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long mailBookId) {
        mapper.deleteRolesByMailBookId(user.getCompanyId(), mailBookId);
        return mapper.deleteMailBook(user.getCompanyId(), mailBookId);
    }

    /** AS-IS utils.mail.SendMailSMTP.checkCompanyMail L816-873: 회사의 메일서버로 입력한 주소가 자기 자신에게 시험 메일을 보낸다 */
    public CmpMailCheckRes check(UserPrincipal user, CmpMailCheckReq req) {
        String mailInfo = mapper.selectMailInfo(user.getCompanyId());
        Properties config = MailServerConfig.load(mailInfo);
        if (config == null) {
            log.error("메일서버의 설정파일을 읽는데 실패했습니다 : {}", mailInfo);
            return new CmpMailCheckRes(false, "메일서버( " + mailInfo + " )가 설정되지 않았습니다. 관리자에게 연락바랍니다.");
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
            message.setSubject("Asset-ERP 공용메일발송 테스트", "utf-8");
            MimeBodyPart body = new MimeBodyPart();
            body.setContent("Asset-ERP 발송 테스트 메일입니다. 해당 메일주소가 Asset-ERP에 정상적으로 등록되었습니다. 감사합니다.", "text/html; charset=utf-8");
            MimeMultipart multipart = new MimeMultipart();
            multipart.addBodyPart(body);
            message.setContent(multipart);
        } catch (MessagingException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "메일주소가 올바르지 않습니다");
        }

        try {
            Transport.send(message);
            return new CmpMailCheckRes(true, "Asset-ERP 테스트 메일이 입력하신 메일주소로 발송되었습니다. 미수신시 관리자에게 연락부탁드립니다");
        } catch (Exception e) {
            log.warn("공용메일 검증 실패: {} ({})", username, e.getMessage());
            return new CmpMailCheckRes(false, "사용자 이름과 비밀번호가 허용되지 않습니다. 웹메일 비밀번호를 확인하세요");
        }
    }
}
