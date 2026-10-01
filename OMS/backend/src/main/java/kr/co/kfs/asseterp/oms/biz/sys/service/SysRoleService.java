package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyRoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyRoleSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleByMenuParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleUserRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleUserSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleUserSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysRoleMapper;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysUserRoleMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 권한그룹 관리 (AS-IS server/sys/Sys04_Role) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysRoleService {

    private final SysRoleMapper sysRoleMapper;
    private final SysUserRoleMapper sysUserRoleMapper;

    /** 로그인 회사의 권한그룹인지 확인 (다른 회사 권한그룹의 매핑을 바꾸지 못하게) */
    public RoleRes requireRole(UserPrincipal user, Long roleId) {
        RoleRes role = roleId == null ? null : sysRoleMapper.selectById(roleId);
        if (role == null || !user.getCompanyId().equals(role.companyId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "권한그룹을 찾을 수 없습니다. 다시 조회해 주세요.");
        }
        return role;
    }

    /** AS-IS selectByName: 로그인 회사의 권한그룹 중 권한명 LIKE */
    public List<RoleRes> searchRoles(UserPrincipal user, String roleNm) {
        return sysRoleMapper.searchByName(RoleSearchParam.of(user.getCompanyId(), roleNm));
    }

    /** AS-IS selectByMenuId: 메뉴를 쓸 수 있는 로그인 회사의 권한그룹 (Sys06_Tab_MenuView) */
    public List<RoleRes> searchRolesByMenu(UserPrincipal user, Long menuId) {
        return sysRoleMapper.searchByMenuId(new RoleByMenuParam(user.getCompanyId(), menuId));
    }

    /**
     * AS-IS update(UpdateDataModel): 행마다 신규면 INSERT, 아니면 UPDATE 후 다시 읽어 저장된 행을 요청 순서대로 돌려준다.
     */
    @Transactional
    public List<RoleRes> updateRoles(UserPrincipal user, List<RoleSaveReq> rows) {
        List<RoleRes> saved = new ArrayList<>(rows.size());
        for (RoleSaveReq req : rows) {
            if (req.roleNm() == null || req.roleNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "권한명을 입력하세요.");
            }
            Long roleId;
            if (req.isNew()) {
                roleId = sysRoleMapper.selectNextId();
                sysRoleMapper.insert(RoleRow.of(roleId, user.getCompanyId(), req));
            } else {
                roleId = req.roleId();
                if (sysRoleMapper.update(RoleRow.of(roleId, user.getCompanyId(), req)) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
            saved.add(sysRoleMapper.selectById(roleId));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) */
    @Transactional
    public int deleteRoles(UserPrincipal user, List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return 0;
        }
        return sysRoleMapper.delete(new RoleDeleteParam(user.getCompanyId(), roleIds));
    }

    // ── 고객사별 권한그룹 관리 (AS-IS Sys04_Tab_RoleAdmin, SYSADMIN) ──

    /** AS-IS selectByName: 고객사의 권한그룹 중 권한명 LIKE (RoleAdmin은 전체, CompanyUserRole은 권한명 검색) */
    public List<RoleRes> searchCompanyRoles(Long companyId, String roleNm) {
        return sysRoleMapper.searchByName(RoleSearchParam.of(companyId, roleNm));
    }

    /** AS-IS update(UpdateDataModel): 고객사 권한그룹 저장 → 저장된 행 (요청 순서) */
    @Transactional
    public List<RoleRes> updateCompanyRoles(Long companyId, List<CompanyRoleSaveReq> rows) {
        List<RoleRes> saved = new ArrayList<>(rows.size());
        for (CompanyRoleSaveReq req : rows) {
            if (req.roleNm() == null || req.roleNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "권한명을 입력하세요.");
            }
            Long roleId;
            if (req.isNew()) {
                roleId = sysRoleMapper.selectNextId();
                sysRoleMapper.insertCompanyRole(CompanyRoleRow.of(roleId, companyId, req));
            } else {
                roleId = req.roleId();
                if (sysRoleMapper.updateCompanyRole(CompanyRoleRow.of(roleId, companyId, req)) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
            saved.add(sysRoleMapper.selectById(roleId));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel): 고객사의 권한그룹만 지운다 */
    @Transactional
    public int deleteCompanyRoles(Long companyId, List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return 0;
        }
        return sysRoleMapper.delete(new RoleDeleteParam(companyId, roleIds));
    }

    /** AS-IS selectByUserId: 회사 권한그룹 전체 + 사원 보유 여부 */
    public List<RoleUserRes> searchUserRoles(UserPrincipal user, Long userId) {
        return sysRoleMapper.searchByUserId(new RoleUserSearchParam(user.getCompanyId(), userId));
    }

    /**
     * AS-IS updateUserRole: 바꾼 행만 받아 부여(true)는 sys05 INSERT(비고=권한명), 해제(false)는 sys05 DELETE.
     * 처리 후 사원의 권한그룹 목록을 다시 돌려준다.
     */
    @Transactional
    public List<RoleUserRes> updateUserRoles(UserPrincipal user, Long userId, List<RoleUserSaveReq> rows) {
        List<Long> deleteIds = new ArrayList<>();
        for (RoleUserSaveReq req : rows) {
            if (req.userRoleYn()) {
                RoleRes role = requireRole(user, req.roleId());
                try {
                    sysUserRoleMapper.insert(new UserRoleRow(sysUserRoleMapper.selectNextId(), user.getCompanyId(),
                            userId, req.roleId(), null, role.roleNm(), null));
                } catch (DuplicateKeyException e) {
                    throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 부여된 권한그룹입니다. 다시 조회해 주세요.");
                }
            } else if (req.userRoleId() != null) {
                deleteIds.add(req.userRoleId());
            }
        }
        if (!deleteIds.isEmpty()) {
            sysUserRoleMapper.delete(new UserRoleDeleteParam(user.getCompanyId(), deleteIds));
        }
        return searchUserRoles(user, userId);
    }
}
