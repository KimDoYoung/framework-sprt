package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FilePolicyRes;
import kr.co.kfs.asseterp.biz.sys.dto.FilePolicySaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysFilePolicyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys60_FilePolicy.java (selectByText L23 / update L36 / delete L41). 관리자 메뉴(#1500)라 저장·삭제는 sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysFilePolicyService {

    private final SysFilePolicyMapper mapper;

    /** AS-IS retrieve() L127: '%'+검색어+'%' */
    public List<FilePolicyRes> search(String searchText) {
        return mapper.selectByText("%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS update(UpdateDataModel): 행마다 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<FilePolicyRes> update(UserPrincipal user, List<FilePolicySaveReq> rows) {
        requireSysAdmin(user);
        List<FilePolicyRes> saved = new ArrayList<>();
        for (FilePolicySaveReq req : rows) {
            boolean isNew = req.filePolicyId() == null || req.filePolicyId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.filePolicyId();
            if (isNew) {
                mapper.insertFilePolicy(id, req);
            } else if (mapper.updateFilePolicy(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteFilePolicies(ids);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
