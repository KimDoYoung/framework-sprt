package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserMenuReq;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserMenuRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysAdminUserMenuMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys06_Menu.selectByAdminUserId + server/sys/Sys82_AdminUserMenu.updateMenu — 관리자별 메뉴 권한(권한설정) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysAdminUserMenuService {

    private static final long ROOT = 0L;
    private final SysAdminUserMenuMapper mapper;

    /**
     * AS-IS selectByAdminUserId L163-212: parentId 0부터 자식을 재귀로 읽어 트리를 만든다.
     * 회사는 AS-IS처럼 로그인 회사(LoginUser.getCompanyId — KFS 관리자면 0)의 메뉴다. 전위 순서 평평한 목록으로 돌려준다.
     */
    public List<AdminUserMenuRes> searchMenus(UserPrincipal user, Long userId) {
        requireSysAdmin(user);
        List<AdminUserMenuRes> out = new ArrayList<>();
        addChildren(out, user.getCompanyId(), userId, ROOT, 0);
        return out;
    }

    private void addChildren(List<AdminUserMenuRes> out, Long companyId, Long userId, Long parentId, int depth) {
        for (AdminUserMenuRes m : mapper.selectChildren(companyId, userId, parentId)) {
            out.add(m.withDepth(depth));
            addChildren(out, companyId, userId, m.menuId(), depth + 1);
        }
    }

    /** AS-IS updateMenu L19-50: 바뀐 행마다 sys82 행이 없으면 채번해 INSERT, 있으면 UPDATE → 저장된 행 */
    @Transactional
    public List<AdminUserMenuRes> updateMenus(UserPrincipal user, Long userId, List<AdminUserMenuReq> rows) {
        requireSysAdmin(user);
        if (mapper.countUser(userId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        List<AdminUserMenuRes> saved = new ArrayList<>();
        for (AdminUserMenuReq r : rows) {
            String useYn = r.useYn() == null ? "false" : r.useYn(); // sys82_use_yn NOT NULL — 화면은 바꾼 행만 보내므로 null이 오지 않는다
            if (r.adminUserMenuId() == null) {
                mapper.insertAdminUserMenu(mapper.selectNextId(), userId, r.menuId(), useYn);
            } else {
                mapper.updateAdminUserMenu(r.adminUserMenuId(), userId, useYn);
            }
            saved.add(mapper.selectSaved(userId, r.menuId()));
        }
        return saved;
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
