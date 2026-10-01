package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysUserRoleMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 권한그룹별 사용자 맵핑 (AS-IS server/sys/Sys05_UserRole) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysUserRoleService {

    private final SysUserRoleMapper sysUserRoleMapper;

    /** AS-IS selectByRoleId */
    public List<UserRoleRes> searchUserRoles(UserPrincipal user, Long roleId) {
        return sysUserRoleMapper.searchByRoleId(new UserRoleSearchParam(user.getCompanyId(), roleId, null));
    }

    /** AS-IS update(UpdateDataModel): 신규는 INSERT, 기존은 권한조직 UPDATE → 저장된 행(요청 순서) */
    @Transactional
    public List<UserRoleRes> updateUserRoles(UserPrincipal user, List<UserRoleSaveReq> rows) {
        List<UserRoleRes> saved = new ArrayList<>(rows.size());
        for (UserRoleSaveReq req : rows) {
            Long id = req.isNew() ? sysUserRoleMapper.selectNextId() : req.userRoleId();
            UserRoleRow row = new UserRoleRow(id, user.getCompanyId(), req.userId(), req.roleId(), null, null, req.authOrgId());
            int count;
            try {
                count = req.isNew() ? sysUserRoleMapper.insert(row) : sysUserRoleMapper.update(row);
            } catch (DuplicateKeyException e) {
                throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 이 권한그룹에 등록된 사원입니다.");
            }
            if (count == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysUserRoleMapper.selectById(new UserRoleSearchParam(user.getCompanyId(), null, id)));
        }
        return saved;
    }

    /** AS-IS delete */
    @Transactional
    public int deleteUserRoles(UserPrincipal user, List<Long> userRoleIds) {
        if (userRoleIds == null || userRoleIds.isEmpty()) {
            return 0;
        }
        return sysUserRoleMapper.delete(new UserRoleDeleteParam(user.getCompanyId(), userRoleIds));
    }
}
