package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysMenuMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/** B06: 프레임 메뉴 트리 테스트만 (OMS SysMenuServiceTest에서 가져옴) */
class SysMenuServiceTest {

    private final SysMenuMapper sysMenuMapper = mock(SysMenuMapper.class);
    private final SysMenuService sysMenuService = new SysMenuService(sysMenuMapper);

    private static UserPrincipal user(long userId) {
        return UserPrincipal.builder().userId(userId).companyId(28000L).roles(List.of()).build();
    }

    private static MenuRow row(long id, String nm, String seq, long parentId, String parentNm, String parentSeq) {
        return new MenuRow(id, nm, "M" + id, seq, parentId, "Cls" + id, parentNm, parentSeq);
    }

    @Test
    void 사원은_권한그룹_메뉴로_3단계_트리를_만든다() {
        when(sysMenuMapper.searchHeaderMenusByUser(any())).thenReturn(List.of(row(1, "경영관리", "1000", 0, null, null)));
        // 3차 메뉴는 item seq 순으로 오지만 그룹은 상위(2차) seq 순으로 정렬한다
        when(sysMenuMapper.searchTailMenusByUser(any())).thenReturn(List.of(
                row(21, "사원조회", "1", 20, "사원관리", "2000"),
                row(11, "조직등록", "2", 10, "조직관리", "1000"),
                row(22, "사원등록", "3", 20, "사원관리", "2000")));

        List<MenuRes.Level1> menus = sysMenuService.getMenus(user(101));

        assertThat(menus).hasSize(1);
        assertThat(menus.get(0).groups()).extracting(MenuRes.Level2::groupTitle).containsExactly("조직관리", "사원관리");
        assertThat(menus.get(0).groups().get(1).items()).extracting(MenuRes.Level3::title).containsExactly("사원조회", "사원등록");
        verify(sysMenuMapper).searchTailMenusByUser(new MenuSearchParam(28000L, 101L, 1L));
        verify(sysMenuMapper, never()).searchHeaderMenusByCompany(any());
    }

    @Test
    void 회사관리자는_회사_메뉴를_보고_2차_메뉴_행은_그룹으로만_쓴다() {
        when(sysMenuMapper.searchHeaderMenusByCompany(any())).thenReturn(List.of(
                row(1, "관리자", "9000", 0, null, null),
                row(2, "빈메뉴", "9500", 0, null, null)));
        when(sysMenuMapper.searchTailMenusByCompany(new MenuSearchParam(28000L, null, 1L))).thenReturn(List.of(
                row(10, "고객관리", "1", 1, "관리자", "9000"),
                row(11, "메뉴 관리", "1", 10, "고객관리", "1")));
        when(sysMenuMapper.searchTailMenusByCompany(new MenuSearchParam(28000L, null, 2L))).thenReturn(List.of());

        // 회사관리자 세션 ID는 음수 (-sys02_user_id)
        List<MenuRes.Level1> menus = sysMenuService.getMenus(user(-5));

        assertThat(menus).extracting(MenuRes.Level1::title).containsExactly("관리자"); // 하위 메뉴 없는 1차는 뺀다
        assertThat(menus.get(0).groups()).singleElement().satisfies(g -> {
            assertThat(g.groupTitle()).isEqualTo("고객관리");
            assertThat(g.items()).extracting(MenuRes.Level3::code).containsExactly("11");
        });
        verify(sysMenuMapper, never()).searchHeaderMenusByUser(any());
    }
}
