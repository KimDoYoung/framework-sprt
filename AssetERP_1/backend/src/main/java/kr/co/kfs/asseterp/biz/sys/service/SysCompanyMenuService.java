package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuCopyReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuParam;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuRow;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCompanyMenuMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/sys/Sys03_CompanyMenu.java */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCompanyMenuService {

    private final SysCompanyMenuMapper mapper;

    /**
     * AS-IS insert L21-84 (매뉴권한복사(초기)): 출발지 회사의 ① 회사 메뉴 ② 권한그룹 ③ 권한그룹별 메뉴를 도착지 회사로 복사한다.
     * ①·③은 도착지에 이미 있으면 건너뛰고, ②는 중복 검사 없이 전부 복사한다(AS-IS 그대로 — 두 번 하면 권한그룹이 두 벌이 된다).
     */
    @Transactional
    public void copyMenus(UserPrincipal user, CompanyMenuCopyReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        // AS-IS insertCheck() L78-89 (클라이언트)
        if (req.outPut() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "출발지 값은 필수입력 항목입니다");
        }
        if (req.inPut() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "도착지 값은 필수입력 항목입니다");
        }
        Long out = req.outPut(), in = req.inPut();

        // 1. 출발지 메뉴 → 도착지에 없으면 INSERT
        int menus = 0;
        for (Long menuId : mapper.selectMenuIdsByCompany(out)) {
            if (mapper.countCompanyMenu(CompanyMenuParam.menu(in, menuId)) == 0) {
                mapper.insertCompanyMenu(new CompanyMenuParam(mapper.selectNextId(), in, menuId, null, null, null));
                menus++;
            }
        }
        // 2. 출발지 권한그룹 전부 복사
        int roles = mapper.copyRoles(in, out);

        // 3. 출발지 권한그룹별 메뉴 → 도착지 같은 이름 권한그룹에 없으면 INSERT
        int roleMenus = 0;
        for (String roleName : mapper.selectRoleNamesByCompany(out)) {
            for (RoleMenuRow rm : mapper.selectRoleMenusByRoleName(CompanyMenuParam.role(out, roleName, null))) {
                if (mapper.countRoleMenu(CompanyMenuParam.role(in, roleName, rm.menuId())) == 0) {
                    Long roleId = mapper.selectFirstRoleIdByName(CompanyMenuParam.role(in, roleName, null));
                    if (roleId != null) {
                        mapper.insertRoleMenu(new CompanyMenuParam(mapper.selectNextId(), in, rm.menuId(), roleName, roleId, rm.useYn()));
                        roleMenus++;
                    }
                }
            }
        }
        log.info("매뉴권한복사 {} → {}: 회사메뉴 {}, 권한그룹 {}, 권한그룹메뉴 {}", out, in, menus, roles, roleMenus);
    }
}
