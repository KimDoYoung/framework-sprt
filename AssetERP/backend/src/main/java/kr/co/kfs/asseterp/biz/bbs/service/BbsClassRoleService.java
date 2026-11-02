package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassRoleRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassRoleSaveReq;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsClassRoleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/bbs/Bbs33_Role.java (Z13 게시판 분류 권한) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsClassRoleService {

    private final BbsClassRoleMapper mapper;

    /** AS-IS selectByClassTreeId L24 */
    public List<ClassRoleRes> searchByClassTreeId(Long classTreeId) {
        return mapper.selectByClassTreeId(classTreeId);
    }

    /** AS-IS checkRole L30 — 비공개 세부항목에 내게(사원 또는 내 조직) 권한이 있는가 */
    public boolean hasRole(UserPrincipal user, Long classTreeId) {
        return mapper.countRole(classTreeId, user.getUserId(), BbsClassTreeService.orgId(user)) > 0;
    }

    /** AS-IS update L42 — UpdateDataModel: 새 줄(ID 없음·0 이하)은 INSERT. 저장한 줄을 selectById로 다시 읽어 돌려준다 */
    @Transactional
    public List<ClassRoleRes> save(Long classTreeId, List<ClassRoleSaveReq> rows) {
        List<ClassRoleRes> saved = new ArrayList<>();
        for (ClassRoleSaveReq r : rows) {
            Long id = r.roleId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertRole(id, classTreeId, r);
            } else {
                mapper.updateRole(classTreeId, r);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete L47 (체크한 줄들) */
    @Transactional
    public int delete(Long classTreeId, List<Long> roleIds) {
        return roleIds == null || roleIds.isEmpty() ? 0 : mapper.deleteRoles(classTreeId, roleIds);
    }
}
