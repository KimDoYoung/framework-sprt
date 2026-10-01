package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleCopyParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleCopyReq;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysRoleMenuMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 권한그룹별 메뉴권한 복사 (AS-IS server/sys/Sys07_RoleMenu) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysRoleMenuService {

    private final SysRoleMenuMapper sysRoleMenuMapper;

    /** AS-IS updateRole: 대상 회사에 같은 이름의 권한그룹이 없을 때만 복사 → 복사한 회사 수 */
    @Transactional
    public int copyRole(RoleCopyReq req) {
        validate(req, false);
        int copied = 0;
        for (Long companyId : req.companyIds()) {
            RoleCopyParam param = new RoleCopyParam(req.sourceCompanyId(), companyId, req.roleNm(), null);
            if (sysRoleMenuMapper.countRolesByName(param) == 0) {
                copied += Math.min(sysRoleMenuMapper.insertRoleCopy(param), 1);
            }
        }
        return copied;
    }

    /**
     * AS-IS updateMenu: 대상 회사에 같은 이름의 권한그룹이 정확히 1개일 때만, 메뉴와 상위 메뉴 전부의
     * 회사 메뉴 사용여부(sys03)와 권한그룹 메뉴권한(sys07)을 원본 회사 값으로 맞춘다(있으면 UPDATE, 없으면 INSERT) → 처리한 회사 수
     */
    @Transactional
    public int copyRoleMenu(RoleCopyReq req) {
        validate(req, true);
        int copied = 0;
        for (Long companyId : req.companyIds()) {
            if (sysRoleMenuMapper.countRolesByName(new RoleCopyParam(req.sourceCompanyId(), companyId, req.roleNm(), null)) != 1) {
                continue;
            }
            for (Long menuId : sysRoleMenuMapper.selectMenuPath(req.menuId())) {
                RoleCopyParam param = new RoleCopyParam(req.sourceCompanyId(), companyId, req.roleNm(), menuId);
                if (sysRoleMenuMapper.countCompanyMenu(param) > 0) {
                    sysRoleMenuMapper.updateCompanyMenuCopy(param);
                } else {
                    sysRoleMenuMapper.insertCompanyMenuCopy(param);
                }
                if (sysRoleMenuMapper.countRoleMenu(param) > 0) {
                    sysRoleMenuMapper.updateRoleMenuCopy(param);
                } else {
                    sysRoleMenuMapper.insertRoleMenuCopy(param);
                }
            }
            copied++;
        }
        return copied;
    }

    private void validate(RoleCopyReq req, boolean needMenu) {
        if (req.sourceCompanyId() == null || req.roleNm() == null || req.roleNm().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "복사할 권한그룹을 선택하세요.");
        }
        if (needMenu && req.menuId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "복사할 메뉴를 선택하세요.");
        }
        if (req.companyIds() == null || req.companyIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "복사할 목적지 회사를 선택해주세요");
        }
    }
}
