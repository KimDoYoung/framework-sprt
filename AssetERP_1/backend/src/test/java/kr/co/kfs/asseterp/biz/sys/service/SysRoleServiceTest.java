package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.RoleDeleteParam;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRow;
import kr.co.kfs.asseterp.biz.sys.dto.RoleSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.RoleSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysRoleMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/** A01 권한그룹 관리 (AS-IS Sys04_Role) */
class SysRoleServiceTest {

    private final SysRoleMapper mapper = mock(SysRoleMapper.class);
    private final SysRoleService service = new SysRoleService(mapper);
    private final UserPrincipal user = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of()).build();

    private static RoleRes res(long id, String nm) {
        return new RoleRes(id, 28000L, nm, "1", null, null, null, "회사");
    }

    @Test
    void 조회는_권한명_양쪽에_퍼센트를_붙이고_로그인_회사로_찾는다() {
        service.searchRoles(user, "관리");
        service.searchRoles(user, null);
        verify(mapper).searchRoles(new RoleSearchParam(28000L, "%관리%"));
        verify(mapper).searchRoles(new RoleSearchParam(28000L, "%%"));
    }

    @Test
    void 임시_ID_행은_새_ID로_INSERT하고_기존_행은_UPDATE한_뒤_다시_읽어_요청_순서로_돌려준다() {
        when(mapper.selectNextId()).thenReturn(202610070000001L);
        when(mapper.updateRole(any())).thenReturn(1);
        when(mapper.selectRole(202610070000001L)).thenReturn(res(202610070000001L, "신규"));
        when(mapper.selectRole(10L)).thenReturn(res(10L, "기존"));

        List<RoleRes> saved = service.updateRoles(user, List.of(
                new RoleSaveReq(-1L, "신규", "1", null),
                new RoleSaveReq(10L, "기존", "2", "설명")));

        assertThat(saved).extracting(RoleRes::roleNm).containsExactly("신규", "기존");
        verify(mapper).insertRole(new RoleRow(202610070000001L, 28000L, "신규", "1", null));
        verify(mapper).updateRole(new RoleRow(10L, 28000L, "기존", "2", "설명"));
    }

    @Test
    void 권한명이_비면_저장하지_않는다() {
        assertThatThrownBy(() -> service.updateRoles(user, List.of(new RoleSaveReq(-1L, " ", null, null))))
                .isInstanceOf(BusinessException.class);
        verify(mapper, never()).insertRole(any());
    }

    @Test
    void 다른_회사_행은_UPDATE되지_않아_실패한다() {
        when(mapper.updateRole(any())).thenReturn(0);
        assertThatThrownBy(() -> service.updateRoles(user, List.of(new RoleSaveReq(99L, "남의것", null, null))))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void 삭제는_로그인_회사_행만_지운다() {
        when(mapper.deleteRoles(any())).thenReturn(2);
        assertThat(service.deleteRoles(user, List.of(1L, 2L))).isEqualTo(2);
        verify(mapper).deleteRoles(new RoleDeleteParam(28000L, List.of(1L, 2L)));
        assertThat(service.deleteRoles(user, List.of())).isZero();
    }
}
