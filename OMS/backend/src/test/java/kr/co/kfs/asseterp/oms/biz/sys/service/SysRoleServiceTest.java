package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleUserSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysRoleMapper;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysUserRoleMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SysRoleServiceTest {

    private final SysRoleMapper sysRoleMapper = mock(SysRoleMapper.class);
    private final SysUserRoleMapper sysUserRoleMapper = mock(SysUserRoleMapper.class);
    private final SysRoleService sysRoleService = new SysRoleService(sysRoleMapper, sysUserRoleMapper);
    private final UserPrincipal user = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of()).build();

    private static RoleRes res(long id, String nm) {
        return new RoleRes(id, nm, "010", null, 28000L, "회사", false, false);
    }

    @Test
    void 조회는_로그인_회사와_LIKE_패턴으로() {
        sysRoleService.searchRoles(user, " 관리 ");
        verify(sysRoleMapper).searchByName(new RoleSearchParam(28000L, "%관리%"));
    }

    @Test
    void 임시ID_행은_새_ID로_INSERT하고_기존_행은_UPDATE한다() {
        when(sysRoleMapper.selectNextId()).thenReturn(900L);
        when(sysRoleMapper.update(any())).thenReturn(1);
        when(sysRoleMapper.selectById(900L)).thenReturn(res(900, "신규"));
        when(sysRoleMapper.selectById(64191L)).thenReturn(res(64191, "일반"));

        List<RoleRes> saved = sysRoleService.updateRoles(user, List.of(
                new RoleSaveReq(-1L, "신규", "090", null),
                new RoleSaveReq(64191L, "일반", "010", "메모")));

        assertThat(saved).extracting(RoleRes::roleId).containsExactly(900L, 64191L);
        verify(sysRoleMapper).insert(new RoleRow(900L, 28000L, "신규", "090", null));
        verify(sysRoleMapper).update(new RoleRow(64191L, 28000L, "일반", "010", "메모"));
    }

    @Test
    void 다른_회사_행이면_수정되지_않아_예외() {
        when(sysRoleMapper.update(any())).thenReturn(0);
        assertThatThrownBy(() -> sysRoleService.updateRoles(user, List.of(new RoleSaveReq(1L, "x", null, null))))
                .isInstanceOf(BusinessException.class)
                .extracting("errorCode").isEqualTo(ErrorCode.DATA_NOT_FOUND);
    }

    @Test
    void 권한명이_비면_예외() {
        assertThatThrownBy(() -> sysRoleService.updateRoles(user, List.of(new RoleSaveReq(-1L, " ", null, null))))
                .isInstanceOf(BusinessException.class);
        verify(sysRoleMapper, never()).insert(any());
    }

    @Test
    void 삭제는_로그인_회사_조건으로() {
        sysRoleService.deleteRoles(user, List.of(1L, 2L));
        verify(sysRoleMapper).delete(new RoleDeleteParam(28000L, List.of(1L, 2L)));
    }

    @Test
    void 사원_권한_부여는_권한명을_비고로_INSERT_해제는_DELETE() {
        when(sysRoleMapper.selectById(5L)).thenReturn(new RoleRes(5L, "중간 관리자", "020", null, 28000L, "회사", false, false));
        when(sysUserRoleMapper.selectNextId()).thenReturn(900L);

        sysRoleService.updateUserRoles(user, 101L, List.of(
                new RoleUserSaveReq(5L, "중간 관리자", true, null),
                new RoleUserSaveReq(6L, "인사", false, 77L)));

        verify(sysUserRoleMapper).insert(new UserRoleRow(900L, 28000L, 101L, 5L, null, "중간 관리자", null));
        verify(sysUserRoleMapper).delete(new UserRoleDeleteParam(28000L, List.of(77L)));
    }

    @Test
    void 다른_회사_권한그룹은_부여할_수_없다() {
        when(sysRoleMapper.selectById(5L)).thenReturn(new RoleRes(5L, "x", null, null, 30000L, null, false, false));
        assertThatThrownBy(() -> sysRoleService.updateUserRoles(user, 101L, List.of(new RoleUserSaveReq(5L, "x", true, null))))
                .isInstanceOf(BusinessException.class);
        verify(sysUserRoleMapper, never()).insert(any());
    }
}
