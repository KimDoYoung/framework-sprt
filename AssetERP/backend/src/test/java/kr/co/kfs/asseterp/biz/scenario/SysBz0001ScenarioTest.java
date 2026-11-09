package kr.co.kfs.asseterp.biz.scenario;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyCreateReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 업무 시나리오 SYS-BZ-0001 고객사 등록 (docs/2-업무분석/biz-event/SYS/SYS-BZ-0001-고객사등록.md).
 * 문서의 "따라 하기"를 서비스 순서대로 부르고 "DB에 남는 것"을 확인한다. asseterpdb에서 돌고 끝나면 롤백한다.
 * 가상 회사 kalpa는 이미 있으므로 같은 흐름을 서브도메인 bztest로 돌린다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SysCompanyService.class)
@DisplayName("SYS-BZ-0001 고객사 등록")
class SysBz0001ScenarioTest {

    private static final String LOC = "bztest";

    @Autowired SysCompanyService service;
    @Autowired JdbcTemplate jdbc;

    /** KFS 관리자(admin 서브도메인 / admin) */
    private final UserPrincipal kfsAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private CompanyCreateReq newCompany(String loc, String bizNo) {
        return new CompanyCreateReq("(주)시나리오시험", loc, "1111", LocalDate.of(2020, 3, 2), null, bizNo, "12", "3", "12");
    }

    private int count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Integer.class, args);
    }

    @Test
    @DisplayName("단계1 신규고객사 등록 → 회사 행 + 회사 초기화(조직 최상단·공통코드·문서분류·계정과목…), 메뉴·관리자는 아직 없음")
    void 등록하면_회사초기화가_된다() {
        CompanyRes saved = service.createCompany(kfsAdmin, newCompany(LOC, "999-99-99999"));
        long cid = saved.companyId();

        assertThat(saved.locNm()).isEqualTo(LOC);
        assertThat(saved.useYn()).isNotEqualTo("true");                       // 등록 직후에는 로그인할 수 없다
        assertThat(count("select count(*) from org01_code where org01_company_id = ?", cid)).isEqualTo(1);
        assertThat(count("select count(*) from org02_info i join org01_code c on c.org01_code_id = i.org02_code_id where c.org01_company_id = ?", cid)).isEqualTo(1);
        assertThat(count("select count(*) from sys09_code where sys09_company_id = ?", cid)).isPositive();
        assertThat(count("select count(*) from dcr01_class_tree where dcr01_company_id = ?", cid)).isPositive();
        assertThat(count("select count(*) from act01_account_code where act01_company_id = ?", cid)).isPositive();
        assertThat(count("select count(*) from sys30_leave_year where sys30_company_id = ?", cid)).isPositive();
        // 다음 이벤트가 할 일: 메뉴(SYS-BZ-0003)·관리자(SYS-BZ-0002)는 등록만으로 생기지 않는다
        assertThat(count("select count(*) from sys03_company_menu where sys03_company_id = ?", cid)).isZero();
        assertThat(count("select count(*) from sys02_user where sys02_company_id = ?", cid)).isZero();
    }

    @Test
    @DisplayName("단계2 관리정보 탭에서 사용여부를 켜야 로그인 대상이 된다")
    void 사용여부를_켠다() {
        long cid = service.createCompany(kfsAdmin, newCompany(LOC, "999-99-99999")).companyId();
        service.updateCompanyManage(kfsAdmin, new CompanyManageReq(cid, "false", "(주)시나리오시험", LOC, null, "1111",
                "A1", "가상회사(업무분석)", LocalDate.of(2026, 11, 9), null, null, null, "true", null, null, "true"));

        assertThat(jdbc.queryForObject("select sys01_use_yn from sys01_company where sys01_company_id = ?", String.class, cid)).isEqualTo("true");
        assertThat(jdbc.queryForObject("select sys01_erp_product_cd from sys01_company where sys01_company_id = ?", String.class, cid)).isEqualTo("A1");
    }

    @Test
    @DisplayName("규칙: 필수값·서브도메인 중복·사업자번호 중복은 막는다")
    void 막히는_경우() {
        assertThatThrownBy(() -> service.createCompany(kfsAdmin, newCompany("", "999-99-99999")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("서브도메인은 필수");
        assertThatThrownBy(() -> service.createCompany(kfsAdmin, newCompany("kfstest", "999-99-99999")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("서브도메인");
        String kfsBizNo = jdbc.queryForObject("select sys01_biz_no from sys01_company where sys01_loc_nm = 'kfstest'", String.class);
        assertThatThrownBy(() -> service.createCompany(kfsAdmin, newCompany(LOC, kfsBizNo)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("사업자등록번호");
    }
}
