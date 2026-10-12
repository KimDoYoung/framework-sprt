package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.RoleAdminRow;
import kr.co.kfs.asseterp.biz.sys.dto.RoleAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.RoleDeleteParam;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRow;
import kr.co.kfs.asseterp.biz.sys.dto.RoleSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.RoleSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysRoleMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys04_Role.java (selectByName / update / delete) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysRoleService {

    private final SysRoleMapper sysRoleMapper;

    /** AS-IS selectByName: 권한명 '%입력값%' + 로그인 회사, sys04_seq 순 */
    public List<RoleRes> searchRoles(UserPrincipal user, String roleNm) {
        String like = "%" + (roleNm == null ? "" : roleNm) + "%";
        return sysRoleMapper.searchRoles(new RoleSearchParam(user.getCompanyId(), like));
    }

    /**
     * AS-IS update(UpdateDataModel): 행마다 신규면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 돌려준다.
     * 신규 판정은 화면 임시 ID(0 이하)로 한다(AS-IS는 클라이언트가 getSeq로 받은 ID가 테이블에 있는지로 판정).
     */
    @Transactional
    public List<RoleRes> updateRoles(UserPrincipal user, List<RoleSaveReq> rows) {
        List<RoleRes> saved = new ArrayList<>();
        for (RoleSaveReq req : rows) {
            if (req.roleNm() == null || req.roleNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "권한명을 입력하세요.");
            }
            boolean isNew = req.roleId() == null || req.roleId() <= 0;
            Long roleId = isNew ? sysRoleMapper.selectNextId() : req.roleId();
            RoleRow row = new RoleRow(roleId, user.getCompanyId(), req.roleNm(), req.seq(), req.note());
            if (isNew) {
                sysRoleMapper.insertRole(row);
            } else if (sysRoleMapper.updateRole(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysRoleMapper.selectRole(roleId));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel): 선택한 행 삭제 → 지운 건수 */
    @Transactional
    public int deleteRoles(UserPrincipal user, List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return 0;
        }
        return sysRoleMapper.deleteRoles(new RoleDeleteParam(user.getCompanyId(), roleIds));
    }

    // ── A02 Sys04_Tab_RoleAdmin: 화면에서 고른 고객사의 권한그룹 (admin 회사 메뉴) ──

    /** AS-IS retrieveRole() L177-188 → selectByName(roleName = '%', companyId = 고른 고객사) */
    public List<RoleRes> searchCompanyRoles(UserPrincipal user, Long companyId) {
        requireSysAdmin(user);
        return sysRoleMapper.searchRoles(new RoleSearchParam(companyId, "%"));
    }

    /** AS-IS update() L191-194 → Sys04_Role.update(UpdateDataModel). 저장 전 검사 없음(원본 그대로) */
    @Transactional
    public List<RoleRes> updateCompanyRoles(UserPrincipal user, Long companyId, List<RoleAdminSaveReq> rows) {
        requireSysAdmin(user);
        List<RoleRes> saved = new ArrayList<>();
        for (RoleAdminSaveReq req : rows) {
            if (req.roleNm() == null || req.roleNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "권한명을 입력하세요.");
            }
            boolean isNew = req.roleId() == null || req.roleId() <= 0;
            Long roleId = isNew ? sysRoleMapper.selectNextId() : req.roleId();
            RoleAdminRow row = new RoleAdminRow(roleId, companyId, req.roleNm(), req.seq(), req.note(),
                    req.defaultRole(), req.adminYn());
            if (isNew) {
                sysRoleMapper.insertRoleAdmin(row);
            } else if (sysRoleMapper.updateRoleAdmin(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysRoleMapper.selectRole(roleId));
        }
        return saved;
    }

    /** AS-IS deleteRow() L238-242 → Sys04_Role.delete(UpdateDataModel): 체크한 행 삭제 → 지운 건수 */
    @Transactional
    public int deleteCompanyRoles(UserPrincipal user, Long companyId, List<Long> roleIds) {
        requireSysAdmin(user);
        if (roleIds == null || roleIds.isEmpty()) {
            return 0;
        }
        return sysRoleMapper.deleteRoles(new RoleDeleteParam(companyId, roleIds));
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
