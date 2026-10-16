package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleDeleteParam;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleRow;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysUserRoleMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys05_UserRole.java (selectByRoleId / update / delete) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysUserRoleService {

    private final SysUserRoleMapper sysUserRoleMapper;

    /** AS-IS selectByRoleId: 권한그룹은 로그인 회사 것이어야 한다(05 §6 회사 조건) */
    public List<UserRoleRes> searchUserRoles(UserPrincipal user, Long roleId) {
        checkRole(user.getCompanyId(), roleId);
        return sysUserRoleMapper.searchUserRoles(roleId);
    }

    /**
     * AS-IS update(UpdateDataModel): 행마다 신규면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 돌려준다.
     * 같은 사원·권한그룹은 DB 유일 인덱스 → 미리 세어 알린다(05 §6 DB 오류).
     */
    @Transactional
    public List<UserRoleRes> updateUserRoles(UserPrincipal user, List<UserRoleSaveReq> rows) {
        return saveUserRoles(user.getCompanyId(), rows);
    }

    /** AS-IS delete(UpdateDataModel) → 지운 건수 */
    @Transactional
    public int deleteUserRoles(UserPrincipal user, List<Long> userRoleIds) {
        return removeUserRoles(user.getCompanyId(), userRoleIds);
    }

    // ── A05 Sys05_Tab_CompanyUserRole: 고른 고객사의 권한그룹 사원 (sys admin만) ──

    /** AS-IS Sys05_Page_CompanyUserRole.retrieve(roleModel) → selectByRoleId. 권한그룹은 고른 회사 것이어야 한다 */
    public List<UserRoleRes> searchCompanyUserRoles(UserPrincipal user, Long companyId, Long roleId) {
        requireSysAdmin(user);
        checkRole(companyId, roleId);
        return sysUserRoleMapper.searchUserRoles(roleId);
    }

    /** AS-IS update() L207-210 → Sys05_UserRole.update. 사원·권한그룹은 고른 회사 것 */
    @Transactional
    public List<UserRoleRes> updateCompanyUserRoles(UserPrincipal user, Long companyId, List<UserRoleSaveReq> rows) {
        requireSysAdmin(user);
        return saveUserRoles(companyId, rows);
    }

    /** AS-IS deleteRow() L239-243 → Sys05_UserRole.delete → 지운 건수 */
    @Transactional
    public int deleteCompanyUserRoles(UserPrincipal user, Long companyId, List<Long> userRoleIds) {
        requireSysAdmin(user);
        return removeUserRoles(companyId, userRoleIds);
    }

    private List<UserRoleRes> saveUserRoles(Long companyId, List<UserRoleSaveReq> rows) {
        List<UserRoleRes> saved = new ArrayList<>();
        for (UserRoleSaveReq req : rows) {
            checkRole(companyId, req.roleId());
            if (req.userId() == null || sysUserRoleMapper.countPerson(companyId, req.userId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            boolean isNew = req.userRoleId() == null || req.userRoleId() <= 0;
            Long userRoleId = isNew ? sysUserRoleMapper.selectNextId() : req.userRoleId();
            UserRoleRow row = new UserRoleRow(userRoleId, companyId, req.userId(), req.roleId(), req.authOrgId());
            if (sysUserRoleMapper.countSameUserRole(row) > 0) {
                throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 이 권한그룹에 등록된 사원입니다.");
            }
            if (isNew) {
                sysUserRoleMapper.insertUserRole(row);
            } else if (sysUserRoleMapper.updateUserRole(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysUserRoleMapper.selectUserRole(userRoleId));
        }
        return saved;
    }

    private int removeUserRoles(Long companyId, List<Long> userRoleIds) {
        if (userRoleIds == null || userRoleIds.isEmpty()) {
            return 0;
        }
        return sysUserRoleMapper.deleteUserRoles(new UserRoleDeleteParam(companyId, userRoleIds));
    }

    private void checkRole(Long companyId, Long roleId) {
        if (roleId == null || sysUserRoleMapper.countRole(companyId, roleId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
