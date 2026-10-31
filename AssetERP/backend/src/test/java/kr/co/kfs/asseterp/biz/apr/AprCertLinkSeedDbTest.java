package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.CertLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpCertService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V22 증명서(B01~B04) 결재창 제목·본문을 asseterpdb에서 읽는다. 쓰는 시험은 테스트 트랜잭션 롤백(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, CertLinkSeedProvider.class, FormMappingLinkSeedSupport.class, EmpCertService.class})
class AprCertLinkSeedDbTest {

    @Autowired AprLinkSeedService service;
    @Autowired EmpCertService certService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = 202609229873969", Long.class);
    }

    private Long certId(String linkCode) {
        return jdbc.queryForObject("select max(emp15_cert_id) from emp15_cert where emp15_company_id = 28000 and emp15_link_cd = ?", Long.class, linkCode);
    }

    @Test
    void 증명서_제목과_수신_참조를_만든다() {
        Long certId = certId("B01");
        AprLinkSeedRes res = service.seed(user(), classTreeId(), "B01", certId);
        String linkName = jdbc.queryForObject("select f_cdnm('LinkCode', 'B01', 28000, f_sysdate())", String.class);
        assertThat(res.title()).startsWith(linkName + " 발급_(").contains(")_");
        assertThat(res.receiveName()).isEqualTo("-");
        assertThat(res.referenceName()).isEqualTo("-");
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.effectDate()).isNotNull();
    }

    /** 이 회사(28000)에는 B01 양식이 없어 임시로 양식을 걸어 치환을 본다 */
    @Test
    void 양식의_치환_키를_증명서_값으로_바꾼다() {
        Long certId = certId("B01");
        Long formId = jdbc.queryForObject("select f_create_seq()", Long.class);
        jdbc.update("insert into com10_form_mapping (com10_form_mapping_id, com10_company_id, com10_title, com10_content) values (?, 28000, 'V22시험', ?)",
                formId, "<p>#{성명}|#{사번}|#{발급일}|#{주민번호}|#{근속년수}|#{회사명}|#{없는키}</p>");
        jdbc.update("update dcr30_link set dcr30_form_mapping_id = ? where dcr30_company_id = 28000 and dcr30_link_cd = 'B01'", formId);

        AprLinkSeedRes res = service.seed(user(), classTreeId(), "B01", certId);
        String name = jdbc.queryForObject("select f_emp_kor_nm(emp15_person_id) from emp15_cert where emp15_cert_id = ?", String.class, certId);
        String no = jdbc.queryForObject("select emp01_emp_no from emp01_person inner join emp15_cert on emp15_person_id = emp01_person_id where emp15_cert_id = ?", String.class, certId);
        String company = jdbc.queryForObject("select sys01_company_nm from sys01_company where sys01_company_id = 28000", String.class);
        assertThat(res.content()).startsWith("<p>" + name + "|" + no + "|").contains("|" + company + "|#{없는키}</p>").doesNotContain("#{성명}");
    }

    @Test
    void 없는_증명서와_회사_밖_행은_열_수_없다() {
        assertThrows(BusinessException.class, () -> service.seed(user(), 1L, "B02", -1L));
        assertThrows(BusinessException.class, () -> service.seed(user(), 1L, "B02", null));
    }

    @Test
    void 상신_문서_ID를_증명서_행에_기록한다() {
        Long certId = certId("B01");
        certService.updateApprId(user(), certId, 202609229873969L);
        Long apprId = jdbc.queryForObject("select emp15_appr_id from emp15_cert where emp15_cert_id = ?", Long.class, certId);
        assertThat(apprId).isEqualTo(202609229873969L);
        assertThrows(BusinessException.class, () -> certService.updateApprId(user(), -1L, 1L));
    }

    @Test
    void 주민번호_가림과_근속년수는_원본_계산식() throws Exception {
        var mask = CertLinkSeedProvider.class.getDeclaredMethod("maskedCtzNo", String.class);
        mask.setAccessible(true);
        assertThat(mask.invoke(null, (Object) null)).isEqualTo("미입력");
        assertThat(mask.invoke(null, "900101-1234567")).isEqualTo("900101-1******");
        var work = CertLinkSeedProvider.class.getDeclaredMethod("workYear", LocalDate.class, String.class, LocalDate.class);
        work.setAccessible(true);
        assertThat(work.invoke(null, null, null, LocalDate.of(2026, 10, 31))).isEqualTo("입사일 미입력");
        assertThat(work.invoke(null, LocalDate.of(2020, 3, 15), null, LocalDate.of(2026, 10, 31))).isEqualTo("6년 7개월");
        assertThat(work.invoke(null, LocalDate.of(2020, 11, 1), null, LocalDate.of(2026, 10, 31))).isEqualTo("5년 11개월");
        assertThat(work.invoke(null, LocalDate.of(2026, 5, 1), null, LocalDate.of(2026, 10, 31))).isEqualTo("5개월");
        assertThat(work.invoke(null, LocalDate.of(2020, 3, 15), "2023-01-20", LocalDate.of(2026, 10, 31))).isEqualTo("2년 10개월");
    }
}
