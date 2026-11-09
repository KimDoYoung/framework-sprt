package kr.co.kfs.asseterp.biz.scenario;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyCreateReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuCopyReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyMenuService;
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
 * 업무 시나리오 SYS-BZ-0003 고객사가 쓸 메뉴를 열어 준다 (docs/2-업무분석/biz-event/SYS/SYS-BZ-0003-메뉴열어주기.md).
 * #1075 [매뉴권한복사(초기)]: 출발지 회사 kfstest → 새 회사. 끝나면 롤백한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysCompanyService.class, SysCompanyMenuService.class})
@DisplayName("SYS-BZ-0003 메뉴 열어 주기")
class SysBz0003ScenarioTest {

    @Autowired SysCompanyService companyService;
    @Autowired SysCompanyMenuService menuService;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal kfsAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private long newCompany() {
        return companyService.createCompany(kfsAdmin,
                new CompanyCreateReq("(주)시나리오시험", "bztest", "1111", LocalDate.of(2020, 3, 2), null, "999-99-99999", "12", "3", "12")).companyId();
    }

    private long kfstest() {
        return jdbc.queryForObject("select sys01_company_id from sys01_company where sys01_loc_nm = 'kfstest'", Long.class);
    }

    private int count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Integer.class, args);
    }

    @Test
    @DisplayName("복사하면 출발지의 회사 메뉴·권한그룹·권한그룹별 메뉴가 도착지에 생긴다")
    void 메뉴를_복사한다() {
        long src = kfstest(), dst = newCompany();
        assertThat(count("select count(*) from sys03_company_menu where sys03_company_id = ?", dst)).isZero();

        menuService.copyMenus(kfsAdmin, new CompanyMenuCopyReq(src, dst));

        assertThat(count("select count(*) from sys03_company_menu where sys03_company_id = ?", dst))
                .isEqualTo(count("select count(*) from sys03_company_menu where sys03_company_id = ?", src));
        assertThat(count("select count(*) from sys04_role where sys04_company_id = ?", dst))
                .isEqualTo(count("select count(*) from sys04_role where sys04_company_id = ?", src));
        assertThat(count("select count(*) from sys07_role_menu rm join sys04_role r on r.sys04_role_id = rm.sys07_role_id where r.sys04_company_id = ?", dst))
                .isPositive();
    }

    @Test
    @DisplayName("두 번 복사하면 회사 메뉴는 그대로지만 권한그룹은 두 벌이 된다(AS-IS 그대로)")
    void 두번_복사하면_권한그룹이_두벌() {
        long src = kfstest(), dst = newCompany();
        menuService.copyMenus(kfsAdmin, new CompanyMenuCopyReq(src, dst));
        int menus = count("select count(*) from sys03_company_menu where sys03_company_id = ?", dst);
        int roles = count("select count(*) from sys04_role where sys04_company_id = ?", dst);

        menuService.copyMenus(kfsAdmin, new CompanyMenuCopyReq(src, dst));

        assertThat(count("select count(*) from sys03_company_menu where sys03_company_id = ?", dst)).isEqualTo(menus);
        assertThat(count("select count(*) from sys04_role where sys04_company_id = ?", dst)).isEqualTo(roles * 2);
    }

    @Test
    @DisplayName("규칙: 출발지·도착지 필수, KFS 관리자만 가능")
    void 막히는_경우() {
        assertThatThrownBy(() -> menuService.copyMenus(kfsAdmin, new CompanyMenuCopyReq(null, 1L)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("출발지");
        assertThatThrownBy(() -> menuService.copyMenus(kfsAdmin, new CompanyMenuCopyReq(1L, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("도착지");
        UserPrincipal staff = UserPrincipal.builder().userId(1L).companyId(5L).roles(List.of("ROLE_USER")).build();
        assertThatThrownBy(() -> menuService.copyMenus(staff, new CompanyMenuCopyReq(1L, 2L)))
                .isInstanceOf(BusinessException.class);
    }
}
