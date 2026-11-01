package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ShareAddReq;
import kr.co.kfs.asseterp.biz.emp.dto.ShareRes;
import kr.co.kfs.asseterp.biz.emp.dto.ShareSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpBizTripMapper;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpShareMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 출장 공유지정 (AS-IS Emp56_Lookup_Share → server/emp/Emp56_Share). 지금은 출장(emp53)만 부모로 받는다 —
 * 외출(Y04 emp54)이 같은 창을 쓰게 되면 부모 확인만 넓힌다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpShareService {

    private final EmpShareMapper mapper;
    private final EmpBizTripMapper bizTripMapper;

    /** AS-IS emp.Emp56_Share.selectByParentId */
    public List<ShareRes> search(UserPrincipal user, Long parentId) {
        requireOwnTrip(user, parentId);
        return mapper.selectByParentId(user.getCompanyId(), parentId);
    }

    /**
     * AS-IS Emp56_Lookup_Share.update — 지운 행(emp.Emp56_Share.delete) 먼저, 새 행(emp.Emp56_Share.update INSERT) 다음,
     * 끝나면 emp.Emp56_Share.selectShareInfo 로 공유명을 돌려준다(없으면 빈 글자).
     */
    @Transactional
    public String save(UserPrincipal user, Long parentId, ShareSaveReq req) {
        requireOwnTrip(user, parentId);
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            mapper.deleteShares(user.getCompanyId(), parentId, req.deleteIds());
        }
        if (req.adds() != null) {
            for (ShareAddReq add : req.adds()) {
                if (!"1".equals(add.shareCode()) && !"2".equals(add.shareCode())) throw new BusinessException(ErrorCode.INVALID_INPUT);
                if ("1".equals(add.shareCode()) && add.personId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
                if (add.orgId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
                mapper.insertShare(user.getCompanyId(), parentId, mapper.selectNextId(), add.shareCode(),
                        "1".equals(add.shareCode()) ? add.personId() : null, add.orgId());
            }
        }
        String info = mapper.selectShareInfo(user.getCompanyId(), parentId);
        return info == null ? "" : info;
    }

    private void requireOwnTrip(UserPrincipal user, Long parentId) {
        if (parentId == null || bizTripMapper.selectMineById(user.getCompanyId(), user.getUserId(), parentId) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
