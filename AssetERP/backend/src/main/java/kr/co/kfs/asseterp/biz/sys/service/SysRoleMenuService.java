package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuCopyParam;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuCopyReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysRoleMenuMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/sys/Sys07_RoleMenu — 권한그룹별 메뉴권한 복사 (A08, admin 회사 메뉴) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysRoleMenuService {

    private final SysRoleMenuMapper mapper;

    /**
     * AS-IS updateRole L23-44: 목적지 회사마다 같은 이름 권한그룹이 없으면 출발지 권한그룹을 복사한다.
     * @return 권한그룹을 넣은 회사 수 (AS-IS는 결과 없음 — 확인용)
     */
    @Transactional
    public int copyRole(UserPrincipal user, RoleMenuCopyReq req) {
        requireSysAdmin(user);
        requireSource(req);
        int inserted = 0;
        for (Long companyId : req.companyIds()) {
            RoleMenuCopyParam param = new RoleMenuCopyParam(companyId, req.inCompanyId(), req.roleName(), null);
            if (mapper.countRolesByName(param) == 0) {
                mapper.insertRole(param);
                inserted++;
            }
        }
        return inserted;
    }

    /**
     * AS-IS updateMenu L46-89: 목적지 회사에 같은 이름 권한그룹이 정확히 1개일 때만, 고른 메뉴와 그 조상마다
     * 회사 메뉴(sys03)·권한그룹 메뉴(sys07)를 출발지 값으로 UPDATE(있으면) / INSERT(없으면) 한다.
     * @return 처리한 회사 수 (AS-IS는 결과 없음 — 확인용)
     */
    @Transactional
    public int copyMenu(UserPrincipal user, RoleMenuCopyReq req) {
        requireSysAdmin(user);
        requireSource(req);
        if (req.menuId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "복사할 매뉴를 선택해주세요");
        }
        int done = 0;
        for (Long companyId : req.companyIds()) {
            RoleMenuCopyParam param = new RoleMenuCopyParam(companyId, req.inCompanyId(), req.roleName(), req.menuId());
            // 해당 roleName과 동일한 권한명이 1개 존재할때만 update & insert 진행 (원본 주석)
            if (mapper.countRolesByName(param) != 1) continue;
            for (Long menuId : mapper.selectMenuIdWithAncestors(req.menuId())) {
                RoleMenuCopyParam p = param.withMenuId(menuId);
                if (mapper.countCompanyMenu(p) > 0) {
                    mapper.updateCompanyMenu(p);
                } else {
                    mapper.insertCompanyMenu(p);
                }
                if (mapper.countRoleMenu(p) > 0) {
                    mapper.updateRoleMenu(p);
                } else {
                    mapper.insertRoleMenu(p);
                }
            }
            done++;
        }
        return done;
    }

    /** 화면 검사(목적지 0개 → "복사할 목적지 회사를 선택해주세요")와 출발지 권한 — 원본은 클라이언트가 막는다 */
    private static void requireSource(RoleMenuCopyReq req) {
        if (req.companyIds() == null || req.companyIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "복사할 목적지 회사를 선택해주세요");
        }
        if (req.inCompanyId() == null || req.roleName() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "복사할 권한그룹을 선택해주세요");
        }
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
