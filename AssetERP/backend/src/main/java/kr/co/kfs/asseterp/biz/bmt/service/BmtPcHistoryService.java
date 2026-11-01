package kr.co.kfs.asseterp.biz.bmt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtPcHistoryRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtPcHistorySaveReq;
import kr.co.kfs.asseterp.biz.bmt.mapper.BmtPcHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Bmt10_Lookup_History·Bmt12_Edit_PcHistory → server/bmt/Bmt12_PcHistory.java (selectByInfoId L35 / modelUpdate L48 / delete L81) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BmtPcHistoryService {

    private final BmtPcHistoryMapper mapper;

    public List<BmtPcHistoryRes> search(UserPrincipal user, Long infoId) {
        return mapper.selectByInfoId(user.getCompanyId(), infoId);
    }

    /** AS-IS modelUpdate (pcHistoryId 없음) → 새 ID·로그인 회사로 INSERT 뒤 다시 읽기 */
    @Transactional
    public BmtPcHistoryRes create(UserPrincipal user, BmtPcHistorySaveReq req) {
        check(req);
        long id = mapper.selectNextId();
        mapper.insert(id, user.getCompanyId(), req);
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** AS-IS modelUpdate (pcHistoryId 있음) → UPDATE 뒤 다시 읽기 */
    @Transactional
    public BmtPcHistoryRes update(UserPrincipal user, Long pcHistoryId, BmtPcHistorySaveReq req) {
        check(req);
        if (mapper.update(user.getCompanyId(), pcHistoryId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(user.getCompanyId(), pcHistoryId);
    }

    @Transactional
    public int delete(UserPrincipal user, List<Long> pcHistoryIds) {
        if (pcHistoryIds == null || pcHistoryIds.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), pcHistoryIds);
    }

    /** bmt12_info_id·bmt12_start_date는 NOT NULL */
    private void check(BmtPcHistorySaveReq req) {
        if (req.infoId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "장비명을 선택해주세요.");
        }
        if (req.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "시작일자를 입력해주세요.");
        }
    }
}
