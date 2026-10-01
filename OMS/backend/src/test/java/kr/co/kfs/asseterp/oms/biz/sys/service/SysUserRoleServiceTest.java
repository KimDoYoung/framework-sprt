package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysUserRoleMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DuplicateKeyException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SysUserRoleServiceTest {

    private final SysUserRoleMapper mapper = mock(SysUserRoleMapper.class);
    private final SysUserRoleService service = new SysUserRoleService(mapper);
    private final UserPrincipal user = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of()).build();

    @Test
    void 신규는_새_ID로_INSERT하고_기존은_권한조직_UPDATE() {
        when(mapper.selectNextId()).thenReturn(900L);
        when(mapper.insert(any())).thenReturn(1);
        when(mapper.update(any())).thenReturn(1);

        service.updateUserRoles(user, List.of(new UserRoleSaveReq(-1L, 11L, 5L, 7L), new UserRoleSaveReq(50L, 12L, 5L, 8L)));

        verify(mapper).insert(new UserRoleRow(900L, 28000L, 11L, 5L, null, null, 7L));
        verify(mapper).update(new UserRoleRow(50L, 28000L, 12L, 5L, null, null, 8L));
    }

    @Test
    void 같은_사원을_다시_넣으면_중복_예외() {
        when(mapper.selectNextId()).thenReturn(900L);
        when(mapper.insert(any())).thenThrow(new DuplicateKeyException("dup"));
        assertThatThrownBy(() -> service.updateUserRoles(user, List.of(new UserRoleSaveReq(-1L, 11L, 5L, null))))
                .isInstanceOf(BusinessException.class).extracting("errorCode").isEqualTo(ErrorCode.DUPLICATE_DATA);
    }

    @Test
    void 다른_회사_권한그룹이면_INSERT_0건이라_예외() {
        when(mapper.selectNextId()).thenReturn(900L);
        when(mapper.insert(any())).thenReturn(0);
        assertThatThrownBy(() -> service.updateUserRoles(user, List.of(new UserRoleSaveReq(-1L, 11L, 5L, null))))
                .isInstanceOf(BusinessException.class).extracting("errorCode").isEqualTo(ErrorCode.DATA_NOT_FOUND);
    }
}
