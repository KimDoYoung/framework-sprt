package kr.co.kfs.asseterp.biz.dcr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.io.File;
import java.nio.file.Files;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import jakarta.mail.Message;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailHistorySaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSendReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSendRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSenderInitRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrMailSenderService;
import kr.co.kfs.asseterp.biz.sys.mapper.SysFileMapper;
import kr.co.kfs.asseterp.common.config.properties.MailSignProperties;
import kr.co.kfs.asseterp.common.config.properties.UploadProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.mail.SmtpMailTransport;

/** EE35 메일 발송창 — 실제 SMTP는 가짜로 바꾸고(메일이 나가지 않는다) 나가는 메일의 모양·첨부·이력을 asseterpdb에서 확인한 뒤 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@EnableConfigurationProperties({UploadProperties.class, MailSignProperties.class})
@Import(DcrMailSenderService.class)
class DcrMailSenderDbTest {

    @Autowired DcrMailSenderService service;
    @Autowired JdbcTemplate jdbc;
    @Autowired SysFileMapper fileMapper;
    @MockitoBean SmtpMailTransport transport;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long apprWithFile() {
        return jdbc.queryForObject("select apr01_appr_id from apr01_appr a where apr01_company_id = 28000 "
                + "and exists (select 1 from sys10_file f where f.sys10_parent_id = a.apr01_appr_id) limit 1", Long.class);
    }

    @Test
    void 열때_본인메일_공용메일권한_첨부를_읽는다() {
        Long apprId = apprWithFile();
        DcrMailSenderInitRes init = service.init(user(), apprId);
        // 본인 메일 = 사원 정보의 메일 주소(DB 사본마다 다르니 DB에서 읽는다)
        assertThat(init.senderEmail()).isEqualTo(jdbc.queryForObject("select emp01_email_addr from emp01_person where emp01_person_id = ?", String.class, user().getUserId()));
        assertThat(init.files()).isNotEmpty();
        assertThat(init.files().get(0).fileNm()).isNotNull();
        // 다른 회사 문서의 첨부는 내려주지 않는다
        Long other = jdbc.queryForObject("select apr01_appr_id from apr01_appr where apr01_company_id <> 28000 limit 1", Long.class);
        assertThat(service.init(user(), other).files()).isEmpty();
    }

    @Test
    void 수신과_제목이_없으면_보내지_않는다() {
        DcrMailSendRes noReceiver = service.send(user(), new DcrMailSendReq(null, " ", null, "제목", "<p>x</p>", null, false, false, null));
        assertThat(noReceiver.ok()).isFalse();
        assertThat(noReceiver.message()).isEqualTo("수신(메일주소)은 필수입력 항목입니다");
        DcrMailSendRes noTitle = service.send(user(), new DcrMailSendReq(null, "a@b.com", null, "", "<p>x</p>", null, false, false, null));
        assertThat(noTitle.message()).isEqualTo("제목은 필수입력 항목입니다");
        org.mockito.Mockito.verifyNoInteractions(transport);
    }

    @Test
    void 본인메일로_보내면_이름있는_수신자와_서명_첨부가_들어가고_기록메일이_하나_더_나간다(@TempDir File dir) throws Exception {
        Long apprId = apprWithFile();
        // 첨부: 문서에 올린 파일 한 건을 임시 폴더의 실제 파일로 가리키게 한다(롤백)
        Long fileId = fileMapper.selectNextId();
        File real = new File(dir, fileId.toString());
        Files.writeString(real.toPath(), "첨부내용");
        fileMapper.insertFile(fileId, apprId, "붙임 자료.txt", dir.getAbsolutePath(), 1.0, "txt", "false");

        DcrMailSendRes res = service.send(user(), new DcrMailSendReq(apprId, "홍길동<hong@kfs.test>;second@kfs.test", "cc@kfs.test",
                "시험 제목", "<p>본문입니다</p>", null, true, true, List.of(fileId)));
        assertThat(res.ok()).as(res.message()).isTrue();

        ArgumentCaptor<MimeMessage> sent = ArgumentCaptor.forClass(MimeMessage.class);
        verify(transport, times(2)).send(sent.capture());   // 회사 sys01_mail_log_yn = true → 보낸 계정에도 사본
        MimeMessage mail = sent.getAllValues().get(0);
        assertThat(mail.getSubject()).isEqualTo("시험 제목");
        assertThat(mail.getRecipients(Message.RecipientType.TO)).hasSize(2);
        assertThat(mail.getRecipients(Message.RecipientType.CC)).hasSize(1);
        MimeMultipart mixed = (MimeMultipart) mail.getContent();
        assertThat(mixed.getCount()).isEqualTo(2);          // 본문(related) + 첨부 1
        assertThat(mixed.getBodyPart(1).getFileName()).isEqualTo("붙임 자료.txt");
        MimeMultipart related = (MimeMultipart) mixed.getBodyPart(0).getContent();
        String html = (String) related.getBodyPart(0).getContent();
        assertThat(html).contains("<p>본문입니다</p>").contains("천영임").contains("cid:image").contains("M. ");
        assertThat(sent.getAllValues().get(1).getSubject()).isEqualTo("[AssetERP-발송메일] 시험 제목");
    }

    @Test
    void 문서에_속하지_않는_파일은_첨부할_수_없다() {
        Long apprId = apprWithFile();
        Long unrelated = jdbc.queryForObject("select sys10_file_id from sys10_file where sys10_parent_id <> ? limit 1", Long.class, apprId);
        assertThatThrownBy(() -> service.send(user(), new DcrMailSendReq(apprId, "a@b.com", null, "t", "c", null, false, false, List.of(unrelated))))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void 전송이_실패하면_원본_문구로_알려준다() throws Exception {
        doThrow(new jakarta.mail.MessagingException("auth failed")).when(transport).send(any());
        DcrMailSendRes res = service.send(user(), new DcrMailSendReq(null, "a@b.com", null, "t", "c", null, false, false, null));
        assertThat(res.ok()).isFalse();
        assertThat(res.message()).contains("사용자 이름과 비밀번호가 허용되지 않습니다. 웹메일 비밀번호를 확인하세요.");
    }

    @Test
    void 메일이력은_첨부기록과_함께_저장된다() {
        Long apprId = apprWithFile();
        Long fileId = service.init(user(), apprId).files().get(0).fileId();
        Long id = service.saveHistory(user(), new DcrMailHistorySaveReq(apprId, "yichun@k-fstest.co.kr", "a@b.com", "c@d.com", "시험", "<p>본문</p>", List.of(fileId)));
        assertThat(jdbc.queryForObject("select dcr10_title_text from dcr10_mail_history where dcr10_mail_history_id = ?", String.class, id)).isEqualTo("시험");
        assertThat(jdbc.queryForObject("select count(*) from dcr11_mail_file_history where dcr11_mail_history_id = ? and dcr11_file_id = ?", Long.class, id, fileId)).isEqualTo(1L);
    }
}
