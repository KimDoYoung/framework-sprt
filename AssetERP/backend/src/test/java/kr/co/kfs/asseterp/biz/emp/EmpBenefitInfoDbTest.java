package kr.co.kfs.asseterp.biz.emp;

import kr.co.kfs.asseterp.biz.act.dto.AccountCodeRes;
import kr.co.kfs.asseterp.biz.act.service.ActAccountCodeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoCopyReq;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpBenefitInfoService;
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

/** E25(복리후생비 코드관리)의 쓰기·복사를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpBenefitInfoService.class, ActAccountCodeService.class})
class EmpBenefitInfoDbTest {

    @Autowired EmpBenefitInfoService service;
    @Autowired ActAccountCodeService accounts;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from emp55_benefit_info where emp55_company_id = 0", Integer.class);
        assertThat(service.search(admin, null, "")).hasSize(all);

        BenefitInfoRes created = service.update(admin, null, List.of(new BenefitInfoSaveReq(-1L, "ZZ9", "A21", "A46", "0407040000", "false"))).get(0);
        assertThat(created.benefitInfoId()).isPositive();
        assertThat(created.companyId()).isZero();
        assertThat(created.accountName()).isNotBlank();  // f_get_account_nm
        assertThat(service.search(admin, null, "")).hasSize(all + 1);
        assertThat(service.search(admin, null, "zz9")).hasSize(1);  // 코드 LIKE, 대소문자 무시

        BenefitInfoRes updated = service.update(admin, null, List.of(new BenefitInfoSaveReq(created.benefitInfoId(), "ZZ9", "A22", "A47", null, "true"))).get(0);
        assertThat(updated.issueLinkCode()).isEqualTo("A22");
        assertThat(updated.unUseYn()).isEqualTo("true");

        // 다른 회사는 관리자 회사 행을 보지도 고치지도 지우지도 못한다
        assertThatThrownBy(() -> service.search(other, 0L, "")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.update(other, null, List.of(new BenefitInfoSaveReq(created.benefitInfoId(), "ZZ9", "A22", "A47", null, "true")))).isInstanceOf(BusinessException.class);
        assertThat(service.delete(other, null, List.of(created.benefitInfoId()))).isZero();

        assertThat(service.delete(admin, null, List.of(created.benefitInfoId()))).isEqualTo(1);
        assertThat(service.delete(admin, null, List.of())).isZero();
        assertThat(service.search(admin, null, "")).hasSize(all);
    }

    @Test
    void 기초데이터생성은_고른_행을_고객사_각각으로_복사() {
        List<BenefitInfoRes> base = service.search(admin, null, "");
        List<Long> ids = base.stream().limit(2).map(BenefitInfoRes::benefitInfoId).toList();
        int before1 = jdbc.queryForObject("select count(*) from emp55_benefit_info where emp55_company_id = 28000", Integer.class);
        int before2 = jdbc.queryForObject("select count(*) from emp55_benefit_info where emp55_company_id = 202303231427269", Integer.class);

        assertThat(service.insertInitData(admin, new BenefitInfoCopyReq(List.of(28000L, 202303231427269L), ids))).isEqualTo(4);
        assertThat(service.search(admin, 28000L, "")).hasSize(before1 + 2);
        assertThat(service.search(admin, 202303231427269L, "")).hasSize(before2 + 2);

        assertThatThrownBy(() -> service.insertInitData(other, new BenefitInfoCopyReq(List.of(28000L), ids))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 계정코드_조회창은_사용_전표생성_계정만() {
        List<AccountCodeRes> all = accounts.searchBySlipYn(admin, null, null, null);
        int expected = jdbc.queryForObject("select count(*) from act01_account_code where act01_company_id = 0 and coalesce(act01_use_yn,'false') = 'true' and coalesce(act01_slip_yn,'false') = 'true'", Integer.class);
        assertThat(all).hasSize(expected);
        String code = all.get(0).accountCode();
        assertThat(accounts.searchBySlipYn(admin, null, null, code)).extracting(AccountCodeRes::accountCode).contains(code);
        assertThat(accounts.searchBySlipYn(admin, null, "Z", null)).isEmpty() ;
        assertThatThrownBy(() -> accounts.searchBySlipYn(other, 0L, null, null)).isInstanceOf(BusinessException.class);
    }
}
