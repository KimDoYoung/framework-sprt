package kr.co.kfs.asseterp.biz.bmt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtHistoryRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtHistorySaveReq;
import kr.co.kfs.asseterp.biz.bmt.mapper.BmtHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS Bmt11_TabPage_History → server/bmt/Bmt11_History.java (selectByInfoId / update L31 / delete L36) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BmtHistoryService {

    private final BmtHistoryMapper mapper;

    public List<BmtHistoryRes> search(UserPrincipal user, Long infoId) {
        return mapper.selectByInfoId(user.getCompanyId(), infoId);
    }

    /** AS-IS update → UpdateDataModel(bmt11_history). 새 행(ID ≤ 0)은 INSERT. 요청 순서로 다시 읽어 돌려준다 */
    @Transactional
    public List<BmtHistoryRes> save(UserPrincipal user, Long infoId, List<BmtHistorySaveReq> rows) {
        List<BmtHistoryRes> result = new ArrayList<>();
        for (BmtHistorySaveReq req : rows) {
            long historyId;
            if (req.historyId() == null || req.historyId() <= 0) {
                historyId = mapper.selectNextId();
                mapper.insert(historyId, user.getCompanyId(), infoId, req);
            } else {
                historyId = req.historyId();
                if (mapper.update(user.getCompanyId(), infoId, historyId, req) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
            result.add(mapper.selectById(user.getCompanyId(), historyId));
        }
        return result;
    }

    @Transactional
    public int delete(UserPrincipal user, List<Long> historyIds) {
        if (historyIds == null || historyIds.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), historyIds);
    }
}
