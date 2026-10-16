package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrClassTreeMapper;
import kr.co.kfs.asseterp.biz.dcr.service.DcrClassTreeService;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuCopyReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyMenuService;
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

/**
 * A15 매뉴권한복사(초기)·문서개요복사를 asseterpdb에서 실제로 돌리고 롤백한다(데이터를 남기지 않는다).
 * 도착지는 시험 안에서 만든 빈 회사 → 결과가 출발지(admin 0)와 같은 수인지 본다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysCompanyMenuService.class, DcrClassTreeService.class})
class SysCompanyMenuCopyDbTest {

    @Autowired SysCompanyMenuService menuService;
    @Autowired DcrClassTreeService dcrService;
    @Autowired SysCompanyMenuMapper menuMapper;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private int count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Integer.class, args);
    }

    @Test
    void admin_회사의_메뉴_권한그룹_권한그룹메뉴가_빈_회사로_복사된다() {
        Long dest = menuMapper.selectNextId(); // 회사 행 없이 ID만 — 복사 SQL은 sys01을 보지 않는다
        int srcMenus = count("select count(*) from sys03_company_menu where sys03_company_id = 0");
        int srcRoles = count("select count(*) from sys04_role where sys04_company_id = 0");
        // AS-IS 3단계는 이름이 같은 권한그룹의 첫 번째에 넣는다 → 이름별 (메뉴 중복 제거) 수
        int srcRoleMenus = count("select count(*) from (select distinct r.sys04_role_nm, m.sys07_menu_id from sys07_role_menu m "
                + "join sys04_role r on r.sys04_role_id = m.sys07_role_id where r.sys04_company_id = 0) x");

        menuService.copyMenus(sysAdmin, new CompanyMenuCopyReq(0L, dest));

        assertThat(count("select count(*) from sys03_company_menu where sys03_company_id = ?", dest)).isEqualTo(srcMenus);
        assertThat(count("select count(*) from sys04_role where sys04_company_id = ?", dest)).isEqualTo(srcRoles);
        assertThat(count("select count(*) from sys07_role_menu m join sys04_role r on r.sys04_role_id = m.sys07_role_id "
                + "where r.sys04_company_id = ?", dest)).isEqualTo(srcRoleMenus);

        // 한 번 더: 메뉴·권한그룹메뉴는 건너뛰고 권한그룹만 한 벌 더 생긴다(AS-IS 그대로)
        menuService.copyMenus(sysAdmin, new CompanyMenuCopyReq(0L, dest));
        assertThat(count("select count(*) from sys03_company_menu where sys03_company_id = ?", dest)).isEqualTo(srcMenus);
        assertThat(count("select count(*) from sys04_role where sys04_company_id = ?", dest)).isEqualTo(srcRoles * 2);
    }

    @Test
    void 출발지_도착지가_없으면_복사하지_않는다() {
        assertThatThrownBy(() -> menuService.copyMenus(sysAdmin, new CompanyMenuCopyReq(null, 1L)))
                .isInstanceOf(BusinessException.class).hasMessage("출발지 값은 필수입력 항목입니다");
        assertThatThrownBy(() -> menuService.copyMenus(sysAdmin, new CompanyMenuCopyReq(0L, null)))
                .isInstanceOf(BusinessException.class).hasMessage("도착지 값은 필수입력 항목입니다");
    }

    @Test
    void 문서개요복사는_admin_개요를_같은_구분코드에_쓴다() {
        Long kfstest = 28000L;
        int updated = dcrService.copyCommentsFromAdmin(sysAdmin, kfstest);
        assertThat(updated).isPositive();
        // admin(0)에 개요가 있는 구분코드 중 kfstest에도 있는 코드는 개요가 같아진다 (같은 코드가 둘인 1건 제외)
        int differ = count("select count(*) from dcr01_class_tree t join (select dcr01_class_tree_cd cd, min(dcr01_note) note "
                + "from dcr01_class_tree where dcr01_company_id = 0 and dcr01_note is not null group by 1 having count(*) = 1) a "
                + "on a.cd = t.dcr01_class_tree_cd where t.dcr01_company_id = ? and t.dcr01_note is distinct from a.note", kfstest);
        assertThat(differ).isZero();
    }
}
