package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuCopyReq;
import kr.co.kfs.asseterp.biz.sys.service.SysRoleMenuService;
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
 * A08 권한그룹별 메뉴권한 복사(AS-IS Sys07_RoleMenu.updateRole / updateMenu)를 asseterpdb에서 돌리고 롤백한다.
 * 출발지 = kfstest(28000)의 '일반 사용자', 메뉴 1120(조상 1100·1000). 목적지 = 시험 안에서 채번한 빈 회사 ID.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SysRoleMenuService.class)
class RoleMenuCopyDbTest {

    private static final long SRC = 28000L;
    private static final String ROLE = "일반 사용자";
    private static final long MENU = 1120L;

    @Autowired SysRoleMenuService service;
    @Autowired SysRoleMenuMapper mapper;
    @Autowired SysCompanyMenuMapper seq;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal companyAdmin = UserPrincipal.builder().userId(-1L).companyId(SRC).roles(List.of("ROLE_ADMIN")).build();

    private int count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Integer.class, args);
    }

    private String roleMenuYn(long companyId, long menuId) {
        List<String> l = jdbc.queryForList("select m.sys07_use_yn from sys07_role_menu m join sys04_role r on r.sys04_role_id = m.sys07_role_id "
                + "where r.sys04_company_id = ? and r.sys04_role_nm = ? and m.sys07_menu_id = ?", String.class, companyId, ROLE, menuId);
        return l.isEmpty() ? "(없음)" : l.get(0);
    }

    private String companyMenuYn(long companyId, long menuId) {
        List<String> l = jdbc.queryForList("select sys03_use_yn from sys03_company_menu where sys03_company_id = ? and sys03_menu_id = ?",
                String.class, companyId, menuId);
        return l.isEmpty() ? "(없음)" : l.get(0);
    }

    @Test
    void 권한그룹복사는_같은_이름이_없을_때만_넣는다() {
        Long dest = seq.selectNextId();
        RoleMenuCopyReq req = new RoleMenuCopyReq(SRC, ROLE, null, List.of(dest, SRC));

        // 목적지 dest에는 넣고, 출발지 자신(SRC)에는 이미 있어 건너뛴다
        assertThat(service.copyRole(sysAdmin, req)).isEqualTo(1);
        assertThat(count("select count(*) from sys04_role d join sys04_role s on s.sys04_company_id = ? and s.sys04_role_nm = d.sys04_role_nm "
                + "where d.sys04_company_id = ? and d.sys04_role_nm = ? "
                + "and (d.sys04_note, d.sys04_seq, d.sys04_default_role, d.sys04_admin_yn) is not distinct from "
                + "(s.sys04_note, s.sys04_seq, s.sys04_default_role, s.sys04_admin_yn)", SRC, dest, ROLE)).isEqualTo(1);
        // 한 번 더 → 이미 있으므로 0
        assertThat(service.copyRole(sysAdmin, req)).isEqualTo(0);
    }

    @Test
    void 매뉴권한복사는_메뉴와_조상의_회사메뉴_권한메뉴를_출발지_값으로_맞춘다() {
        Long dest = seq.selectNextId();
        // 권한그룹이 없으면 아무것도 안 한다
        assertThat(service.copyMenu(sysAdmin, new RoleMenuCopyReq(SRC, ROLE, MENU, List.of(dest)))).isEqualTo(0);
        assertThat(count("select count(*) from sys03_company_menu where sys03_company_id = ?", dest)).isZero();

        service.copyRole(sysAdmin, new RoleMenuCopyReq(SRC, ROLE, null, List.of(dest)));
        List<Long> ids = mapper.selectMenuIdWithAncestors(MENU);
        assertThat(ids).containsExactly(1120L, 1100L, 1000L);

        // 첫 복사 = INSERT
        assertThat(service.copyMenu(sysAdmin, new RoleMenuCopyReq(SRC, ROLE, MENU, List.of(dest)))).isEqualTo(1);
        for (Long id : ids) {
            assertThat(companyMenuYn(dest, id)).as("sys03 " + id).isEqualTo(companyMenuYn(SRC, id));
            assertThat(roleMenuYn(dest, id)).as("sys07 " + id).isEqualTo(roleMenuYn(SRC, id));
        }

        // 목적지 값을 바꾼 뒤 다시 복사 = UPDATE로 출발지 값이 된다 (행 수는 그대로)
        jdbc.update("update sys03_company_menu set sys03_use_yn = 'x' where sys03_company_id = ?", dest);
        jdbc.update("update sys07_role_menu set sys07_use_yn = 'x' where sys07_role_id in (select sys04_role_id from sys04_role where sys04_company_id = ?)", dest);
        service.copyMenu(sysAdmin, new RoleMenuCopyReq(SRC, ROLE, MENU, List.of(dest)));
        for (Long id : ids) {
            assertThat(companyMenuYn(dest, id)).isEqualTo(companyMenuYn(SRC, id));
            assertThat(roleMenuYn(dest, id)).isEqualTo(roleMenuYn(SRC, id));
        }
        assertThat(count("select count(*) from sys03_company_menu where sys03_company_id = ?", dest)).isEqualTo(3);
    }

    @Test
    void 관리자가_아니면_거부하고_목적지가_없으면_화면_문구로_거부한다() {
        assertThatThrownBy(() -> service.copyRole(companyAdmin, new RoleMenuCopyReq(SRC, ROLE, null, List.of(1L))))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.copyMenu(sysAdmin, new RoleMenuCopyReq(SRC, ROLE, MENU, List.of())))
                .isInstanceOf(BusinessException.class).hasMessageContaining("복사할 목적지 회사를 선택해주세요");
    }
}
