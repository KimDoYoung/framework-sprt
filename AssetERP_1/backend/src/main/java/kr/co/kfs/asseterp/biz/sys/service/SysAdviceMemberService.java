package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdviceMemberRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdviceMemberSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysAdviceMemberMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys91_AdviceMember.java (selectByAll L22 / update L28 / delete L33). 조회는 모든 회사, 저장·삭제는 관리자 회사(원본 화면이 그 회사에만 버튼을 보임) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysAdviceMemberService {

    private final SysAdviceMemberMapper mapper;

    public List<AdviceMemberRes> search() {
        return mapper.selectByAll();
    }

    /** AS-IS update(UpdateDataModel): 행마다 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<AdviceMemberRes> update(UserPrincipal user, List<AdviceMemberSaveReq> rows) {
        requireSysAdmin(user);
        List<AdviceMemberRes> saved = new ArrayList<>();
        for (AdviceMemberSaveReq req : rows) {
            boolean isNew = req.adviceMemberId() == null || req.adviceMemberId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.adviceMemberId();
            if (isNew) {
                mapper.insertAdviceMember(id, req);
            } else if (mapper.updateAdviceMember(req) == 0) {
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
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteAdviceMembers(ids);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
