package kr.co.kfs.asseterp.biz.emp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpMailCheckRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpPersonMailRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpPersonMailSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpPersonMailService;
import kr.co.kfs.asseterp.common.mail.SmtpMailTransport;

/** EE35 본인 메일 계정(Emp10_Lookup_MailRetrieve): 읽기·바꾸기·초기화·검증을 asseterpdb에서 돌리고 롤백한다(03 원칙 2). SMTP는 가짜 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(EmpPersonMailService.class)
class EmpPersonMailDbTest {

    @Autowired EmpPersonMailService service;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean SmtpMailTransport transport;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 메일을_바꾸고_초기화한다() {
        EmpPersonMailRes before = service.get(user());
        assertThat(before.mailAddress()).isEqualTo(jdbc.queryForObject("select emp01_email_addr from emp01_person where emp01_person_id = 29049", String.class));
        assertThat(service.change(user(), new EmpPersonMailSaveReq("zz@k-fstest.co.kr", "pw1234!"))).isEqualTo(1);
        EmpPersonMailRes changed = service.get(user());
        assertThat(changed.mailAddress()).isEqualTo("zz@k-fstest.co.kr");
        assertThat(changed.password()).isEqualTo("pw1234!");     // to_encrypts → to_decrypts 왕복
        assertThat(service.reset(user())).isEqualTo(1);
        assertThat(service.get(user()).password()).isNull();
        assertThat(jdbc.queryForObject("select emp01_email_addr from emp01_person where emp01_person_id = 29049", String.class)).isEqualTo("zz@k-fstest.co.kr");
    }

    @Test
    void 검증_메일은_입력한_계정으로_자기에게_보낸다() throws Exception {
        EmpMailCheckRes ok = service.check(user(), new EmpPersonMailSaveReq("yichun@k-fstest.co.kr", "x"));
        assertThat(ok.ok()).isTrue();
        assertThat(ok.message()).startsWith("Asset-ERP 테스트 메일이 입력하신 메일주소로 발송되었습니다");
        verify(transport).send(any());
        doThrow(new jakarta.mail.MessagingException("535")).when(transport).send(any());
        EmpMailCheckRes fail = service.check(user(), new EmpPersonMailSaveReq("yichun@k-fstest.co.kr", "bad"));
        assertThat(fail.ok()).isFalse();
        assertThat(fail.message()).isEqualTo("사용자 이름과 비밀번호가 허용되지 않습니다. 웹메일 비밀번호를 확인하세요");
    }
}
