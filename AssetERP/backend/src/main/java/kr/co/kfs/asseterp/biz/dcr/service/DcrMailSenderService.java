package kr.co.kfs.asseterp.biz.dcr.service;

import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.activation.FileDataSource;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.internet.MimeUtility;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailCompanyRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailHistorySaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSendReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSendRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSenderInitRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSenderRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrPublicMailRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrPublicSenderRow;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrMailSenderMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.common.config.properties.MailSignProperties;
import kr.co.kfs.asseterp.common.config.properties.UploadProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.mail.MailServerConfig;
import kr.co.kfs.asseterp.common.mail.SmtpMailTransport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 메일 발송창 (AS-IS client Dcr10_Lookup_MailSender_20261027 + server utils.mail.SendMailSMTP.sendMailSession/sendMailSessionTest + dcr.Dcr10_MailHistory.insertMailHistory, EE35).
 * AS-IS는 발송 필드(publicCheck·privacyInfo)를 서버 객체에 담아 두어 앞 요청의 값이 남았지만, 여기서는 요청마다 새로 정한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrMailSenderService {

    /** 연결·응답 대기(밀리초). AS-IS에는 없어 잘못된 메일서버에서 오래 멈추는 것을 막는다 (CmpMailBookService와 같음) */
    private static final String SMTP_TIMEOUT = "15000";

    private final DcrMailSenderMapper mapper;
    private final SmtpMailTransport transport;
    private final UploadProperties uploadProperties;
    private final MailSignProperties signProperties;

    /** AS-IS 발송창 열림: retrieve()(본인 메일) + checkSender2()(공용메일 권한) + 첨부 그리드(selectApprRelateDoc) */
    public DcrMailSenderInitRes init(UserPrincipal user, Long apprId) {
        DcrMailSenderRow sender = mapper.selectSender(user.getUserId());
        boolean publicAllowed = mapper.countPublicMailRole(user.getUserId()) > 0;
        List<FileRes> files = apprId == null || mapper.countApprInCompany(apprId, user.getCompanyId()) == 0
                ? List.of() : mapper.selectApprRelateDoc(apprId);
        DcrMailCompanyRow company = mapper.selectCompany(user.getCompanyId());
        return new DcrMailSenderInitRes(sender == null ? null : sender.emailAddr(), company == null ? null : company.mailInfo(),
                sender == null ? null : sender.officeTelno(),
                sender == null ? null : sender.mobileTelno(), publicAllowed, files);
    }

    /** AS-IS Cmp10_MailBook.selectByText (Cmp10_Lookup_MailBookList) — 검색어는 서버가 %…%로 */
    public List<DcrPublicMailRes> searchPublicMails(UserPrincipal user, String searchText) {
        return mapper.selectPublicMails(user.getUserId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS SendMailSMTP.mailSenderTest — 실패하면 ok=false와 원본 문구를 돌려준다 */
    public DcrMailSendRes send(UserPrincipal user, DcrMailSendReq req) {
        if (isBlank(req.receptor())) {
            return new DcrMailSendRes(false, "수신(메일주소)은 필수입력 항목입니다");
        }
        if (isBlank(req.header())) {
            return new DcrMailSendRes(false, "제목은 필수입력 항목입니다");
        }
        DcrMailCompanyRow company = mapper.selectCompany(user.getCompanyId());
        String mailInfo = company == null ? null : company.mailInfo();
        Properties config = MailServerConfig.load(mailInfo);
        if (config == null) {
            log.error("메일서버의 설정파일을 읽는데 실패했습니다 : {}", mailInfo);
            return new DcrMailSendRes(false, "메일서버( " + mailInfo + " )가 설정되지 않았습니다. 관리자에게 연락바랍니다.");
        }
        DcrMailSenderRow sender = mapper.selectSender(user.getUserId());
        if (sender == null) {
            return new DcrMailSendRes(false, "발령정보를 찾을 수 없습니다.");
        }

        boolean publicSend = !isBlank(req.publicCheck());
        String account;
        String password;
        if (publicSend) {
            DcrPublicSenderRow pub = mapper.selectPublicSender(user.getCompanyId(), req.publicCheck());
            if (pub == null) {
                return new DcrMailSendRes(false, "공용 메일 계정을 찾을 수 없습니다.");
            }
            account = pub.emailAddr();
            password = pub.decPassword();
        } else {
            account = sender.emailAddr();
            password = sender.decPassword();
        }

        List<Attachment> attachments = attachmentFiles(user, req.apprId(), req.fileIds());

        Properties properties = new Properties();
        properties.putAll(config);
        properties.put("mail.mime.splitlongparameters", "false");
        properties.put("mail.mime.encodeparameters", "false");
        properties.put("mail.mime.decodefilename", "true");
        properties.put("mail.mime.decodetext.strict", "false");
        properties.put("mail.mime.charset", "UTF-8");
        properties.putIfAbsent("mail.smtp.connectiontimeout", SMTP_TIMEOUT);
        properties.putIfAbsent("mail.smtp.timeout", SMTP_TIMEOUT);
        properties.putIfAbsent("mail.smtp.writetimeout", SMTP_TIMEOUT);

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(account, password);
            }
        });

        MimeMessage message;
        try {
            message = buildMessage(session, req, company, sender, account, publicSend, attachments);
        } catch (AddressException e) {
            return new DcrMailSendRes(false, "받는 메일주소가 올바르지 않습니다");
        } catch (MessagingException e) {
            log.debug("# ERROR_SEND_MESSAGE_MessagingException [{}]", e.getMessage());
            return new DcrMailSendRes(false, "메일발송 중 에러가 발생했습니다. " + e.getMessage());
        } catch (Exception e) {
            log.warn("메일 만들기 실패: {}", e.getMessage());
            return new DcrMailSendRes(false, "메일발송 중 에러가 발생했습니다");
        }

        try {
            transport.send(message);
            if ("true".equals(company.mailLogYn())) {
                MimeMessage logMessage = new MimeMessage(message);
                logMessage.setSubject("[AssetERP-발송메일] " + req.header(), "UTF-8");
                logMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(account));
                transport.send(logMessage);
            }
            return new DcrMailSendRes(true, null);
        } catch (Exception e) {
            log.warn("메일 발송 실패: {} ({})", account, e.getMessage());
            return new DcrMailSendRes(false, e + "사용자 이름과 비밀번호가 허용되지 않습니다. 웹메일 비밀번호를 확인하세요.");
        }
    }

    /** AS-IS Dcr10_MailHistory.insertMailHistory: 첨부 기록을 먼저, 이어서 메일 기록 */
    @Transactional
    public Long saveHistory(UserPrincipal user, DcrMailHistorySaveReq req) {
        checkFileIds(user, req.apprId(), req.fileIds());
        long id = mapper.selectNextId();
        if (req.fileIds() != null) {
            for (Long fileId : req.fileIds()) {
                mapper.insertMailFileHistory(id, fileId);
            }
        }
        mapper.insertMailHistory(id, user.getUserId(), req);
        return id;
    }

    // ── 메일 만들기 ──────────────────────────────────────────────────────

    private MimeMessage buildMessage(Session session, DcrMailSendReq req, DcrMailCompanyRow company, DcrMailSenderRow sender,
                                     String account, boolean publicSend, List<Attachment> attachments) throws Exception {
        MimeMessage message = new MimeMessage(session);
        message.setSentDate(new Date());
        message.setFrom(new InternetAddress(MimeUtility.encodeText(sender.korNm(), "UTF-8", "B") + " <" + account + ">"));
        addRecipients(message, Message.RecipientType.TO, req.receptor());
        addRecipients(message, Message.RecipientType.CC, req.ccReceptor());
        message.setSubject(req.header(), "UTF-8");

        MimeMultipart mixed = new MimeMultipart("mixed");
        MimeMultipart related = new MimeMultipart("related");

        MimeBodyPart htmlPart = new MimeBodyPart();
        htmlPart.setContent(buildMailHtml(req.content(), sender, company, publicSend, req.publicCheck(), req.privacyInfo()), "text/html; charset=UTF-8");
        related.addBodyPart(htmlPart);

        File logo = logoFile(company);
        if (logo != null) {
            MimeBodyPart image = new MimeBodyPart();
            image.setDataHandler(new DataHandler((DataSource) new FileDataSource(logo)));
            image.setHeader("Content-ID", "<image>");
            image.setDisposition(MimeBodyPart.INLINE);
            image.setHeader("Content-Type", "image/png");
            related.addBodyPart(image);
        }
        MimeBodyPart relatedWrapper = new MimeBodyPart();
        relatedWrapper.setContent(related);
        mixed.addBodyPart(relatedWrapper);

        for (Attachment attachment : attachments) {
            File file = attachment.file();
            MimeBodyPart filePart = new MimeBodyPart();
            filePart.setDataHandler(new DataHandler((DataSource) new FileDataSource(file)));
            String mimeType = Files.probeContentType(file.toPath());
            filePart.setHeader("Content-Type", mimeType == null ? "application/octet-stream" : mimeType);
            filePart.setFileName(attachment.name());
            filePart.setDisposition(MimeBodyPart.ATTACHMENT);
            mixed.addBodyPart(filePart);
        }
        message.setContent(mixed);
        message.saveChanges();
        return message;
    }

    /** 수신·참조: ';'로 나누고 "이름<주소>"면 이름을 UTF-8 B로 인코딩 (AS-IS addRecipients) */
    private static void addRecipients(MimeMessage message, Message.RecipientType type, String text) throws MessagingException, UnsupportedEncodingException {
        if (isBlank(text)) {
            return;
        }
        for (String item : text.split(";")) {
            String temp = item == null ? "" : item.trim();
            if (temp.isEmpty()) {
                continue;
            }
            String name = "";
            String email = temp;
            int lt = temp.indexOf('<');
            int gt = temp.indexOf('>');
            if (lt >= 0 && gt > lt) {
                name = temp.substring(0, lt).trim();
                email = temp.substring(lt + 1, gt).trim();
            }
            InternetAddress address = name.isEmpty() ? new InternetAddress(email) : new InternetAddress(email, MimeUtility.encodeText(name, "UTF-8", "B"));
            message.addRecipient(type, address);
        }
    }

    /** AS-IS buildMailHtml: 본문 + 서명 표(본인=사원 서명, 공용=회사 서명) */
    String buildMailHtml(String content, DcrMailSenderRow sender, DcrMailCompanyRow company, boolean publicSend, String publicAddress, boolean privacyInfo) {
        MailSignProperties.Sign sign = signProperties.of(company.locationName());
        StringBuilder html = new StringBuilder(content == null ? "" : content);
        html.append("<br><br><table cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#ffffff\" style=\"background-color: #CCCCCC; width: 645px;\"><tbody><tr>")
                .append("<td bgcolor=\"#ffffff\" style=\"word-break: break-all; border:none; background-color: #FFFFFF; height: 92px; width: 159px; padding: 3px 10px 3px 10px;\">")
                .append("<img src=\"cid:image\" height=\"50\"></td>")
                .append("<td bgcolor=\"#ffffff\" style=\"word-break: break-all; border:none; background-color: #FFFFFF; height: 92px; width: 446px; padding: 3px;\">");
        if (!publicSend) {
            html.append("<span style=\"font-weight: bold; font-size: 17px;\">").append(esc(sender.korNm())).append("</span>")
                    .append("<span style=\"font-size: 11px;\">&nbsp; </span><span style=\"font-size: 11px;\">")
                    .append(esc(sender.parentFullNm())).append(" | ").append(esc(sender.posNm()));
            if (privacyInfo) {
                html.append(" (<span style=\"font-size: 11px; font-weight: bold;\">T. </span>").append(esc(sender.officeTelno()))
                        .append(" / <span style=\"font-size: 11px; font-weight: bold;\">M. </span>").append(esc(sender.mobileTelno())).append(")");
            }
            html.append("</span><br><hr>");
        } else {
            html.append("<span style=\"font-weight: bold; font-size: 17px;\">").append(esc(company.companyName())).append("</span><br><hr>");
        }
        html.append("<span style=\"font-size: 11px; font-weight: bold;\">T. </span>").append(esc(sign.tel()))
                .append(" / <span style=\"font-size: 11px; font-weight: bold;\">F. </span>").append(esc(sign.fax()))
                .append(" / <span style=\"font-size: 11px; font-weight: bold;\">E. </span>").append(esc(publicSend ? publicAddress : sender.emailAddr()))
                .append("<br><span style=\"font-size: 11px;\">").append(esc(sign.address())).append("</span></td></tr></tbody></table><br>");
        return html.toString();
    }

    private File logoFile(DcrMailCompanyRow company) {
        MailSignProperties.Sign sign = signProperties.of(company.locationName());
        if (isBlank(sign.image()) || isBlank(uploadProperties.dir())) {
            return null;
        }
        File file = new File(uploadProperties.dir() + "/" + company.locationName() + "/" + sign.image());
        return file.isFile() ? file : null;
    }

    // ── 첨부 ─────────────────────────────────────────────────────────────

    private record Attachment(File file, String name) {
    }

    private List<Attachment> attachmentFiles(UserPrincipal user, Long apprId, List<Long> fileIds) {
        if (fileIds == null || fileIds.isEmpty()) {
            return List.of();
        }
        List<FileRes> allowed = checkFileIds(user, apprId, fileIds);
        List<Attachment> files = new java.util.ArrayList<>();
        for (Long fileId : fileIds) {
            FileRes row = allowed.stream().filter(f -> f.fileId().equals(fileId)).findFirst().orElseThrow();
            File file = new File(row.serverPath(), fileId.toString());
            if (!file.isFile()) {
                continue;
            }
            files.add(new Attachment(file, row.fileNm()));
        }
        return files;
    }

    /** 첨부 파일 ID는 그 문서의 첨부 목록(selectApprRelateDoc)에 있는 것만 — AS-IS는 화면이 보낸 ID를 그대로 읽었다 */
    private List<FileRes> checkFileIds(UserPrincipal user, Long apprId, List<Long> fileIds) {
        if (fileIds == null || fileIds.isEmpty()) {
            return List.of();
        }
        if (apprId == null || mapper.countApprInCompany(apprId, user.getCompanyId()) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "첨부할 수 없는 파일입니다");
        }
        List<FileRes> allowed = mapper.selectApprRelateDoc(apprId);
        Set<Long> ids = allowed.stream().map(FileRes::fileId).collect(Collectors.toSet());
        if (!ids.containsAll(fileIds)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "첨부할 수 없는 파일입니다");
        }
        return allowed;
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static String esc(String s) {
        return s == null ? "" : HtmlUtils.htmlEscape(s);
    }
}
