package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserListRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserListSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysAdminUserListMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys80_AdminUserList.java (selectByAll L27 / update L75 / delete L80) — 관리자 메뉴 화면이라 sys admin만. 테이블에 회사 컬럼이 없다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysAdminUserListService {

    private final SysAdminUserListMapper mapper;

    public List<AdminUserListRes> search(UserPrincipal user) {
        user.requireSysAdmin();
        return mapper.selectByAll();
    }

    /** AS-IS update(UpdateDataModel): 행마다 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<AdminUserListRes> update(UserPrincipal user, List<AdminUserListSaveReq> rows) {
        user.requireSysAdmin();
        List<AdminUserListRes> saved = new ArrayList<>();
        for (AdminUserListSaveReq req : rows) {
            boolean isNew = req.adminUserListId() == null || req.adminUserListId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.adminUserListId();
            if (isNew) {
                mapper.insertAdminUserList(id, req);
            } else if (mapper.updateAdminUserList(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        user.requireSysAdmin();
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteAdminUserLists(ids);
    }
}
