package kr.co.kfs.asseterp.biz.crd;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeSaveReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCompanyRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCompanySaveReq;
import kr.co.kfs.asseterp.biz.crd.service.CrdExcelCodeService;
import kr.co.kfs.asseterp.biz.crd.service.CrdExcelCompanyService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E24(법인카드 업로드 기초자료)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({CrdExcelCompanyService.class, CrdExcelCodeService.class})
class CrdExcelDbTest {

    @Autowired CrdExcelCompanyService companies;
    @Autowired CrdExcelCodeService codes;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 카드사_조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from crd10_excel_company where crd10_company_id = 0", Integer.class);
        assertThat(companies.search(admin)).hasSize(all);

        CrdExcelCompanyRes created = companies.save(admin, List.of(new CrdExcelCompanySaveReq(-1L, "9999", "시험"))).get(0);
        assertThat(created.excelCompanyId()).isPositive();
        assertThat(created.companyId()).isZero();
        assertThat(companies.search(admin)).hasSize(all + 1);

        CrdExcelCompanyRes updated = companies.save(admin, List.of(new CrdExcelCompanySaveReq(created.excelCompanyId(), "9999", "시험2"))).get(0);
        assertThat(updated.excelCompanyId()).isEqualTo(created.excelCompanyId());
        assertThat(updated.note()).isEqualTo("시험2");

        assertThatThrownBy(() -> companies.save(admin, List.of(new CrdExcelCompanySaveReq(-1L, null, null)))).isInstanceOf(BusinessException.class);
        // 다른 회사는 관리자 회사 행을 고치지도 지우지도 못한다
        assertThatThrownBy(() -> companies.save(other, List.of(new CrdExcelCompanySaveReq(created.excelCompanyId(), "9999", "해킹")))).isInstanceOf(BusinessException.class);
        assertThat(companies.delete(other, List.of(created.excelCompanyId()))).isZero();

        assertThat(companies.delete(admin, List.of(created.excelCompanyId()))).isEqualTo(1);
        assertThat(companies.delete(admin, List.of())).isZero();
        assertThat(companies.search(admin)).hasSize(all);
    }

    @Test
    void 구분코드_조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from crd11_excel_code where crd11_company_id = 0 and crd11_bank_cd = '1000'", Integer.class);
        assertThat(codes.search(admin, "1000", false)).hasSize(all);

        CrdExcelCodeRes created = codes.save(admin, List.of(new CrdExcelCodeSaveReq(-1L, "1000", "9999", 999L, "시험"))).get(0);
        assertThat(created.excelCodeId()).isPositive();
        assertThat(codes.search(admin, "1000", false)).hasSize(all + 1);
        assertThat(codes.search(admin, "1000", false).get(all).excelCodeId()).isEqualTo(created.excelCodeId());  // 순서(seq) 오름차순

        CrdExcelCodeRes updated = codes.save(admin, List.of(new CrdExcelCodeSaveReq(created.excelCodeId(), "1000", "9999", 998L, "시험2"))).get(0);
        assertThat(updated.seq()).isEqualTo(998L);
        assertThat(updated.text()).isEqualTo("시험2");

        assertThatThrownBy(() -> codes.save(admin, List.of(new CrdExcelCodeSaveReq(-1L, "1000", null, 1L, null)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> codes.save(admin, List.of(new CrdExcelCodeSaveReq(-1L, "1000", "9999", null, null)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> codes.save(other, List.of(new CrdExcelCodeSaveReq(created.excelCodeId(), "1000", "9999", 1L, null)))).isInstanceOf(BusinessException.class);
        assertThat(codes.delete(other, List.of(created.excelCodeId()))).isZero();

        assertThat(codes.delete(admin, List.of(created.excelCodeId()))).isEqualTo(1);
        assertThat(codes.search(admin, "1000", false)).hasSize(all);
    }
}
