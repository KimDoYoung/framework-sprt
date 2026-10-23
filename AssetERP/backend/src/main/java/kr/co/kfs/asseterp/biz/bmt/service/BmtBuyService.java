package kr.co.kfs.asseterp.biz.bmt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuyRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuySaveReq;
import kr.co.kfs.asseterp.biz.bmt.mapper.BmtBuyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** AS-IS Bmt01_Tab_Buy → server/bmt/Bmt01_Buy.java (selectByCompanyId L23 / update L35 / delete L40) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BmtBuyService {

    private final BmtBuyMapper mapper;

    /** AS-IS selectByCompanyId(companyId, personId = LoginUser, startDate, closeDate, leftYn) */
    public List<BmtBuyRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, boolean leftYn) {
        return mapper.selectByCompanyId(user.getCompanyId(), user.getUserId(), startDate, closeDate, leftYn);
    }

    /** AS-IS update → UpdateDataModel(bmt01_buy) 뒤 selectById. 새 행(ID ≤ 0)은 INSERT(등록자·회사는 서버 값). 요청 순서로 돌려준다 */
    @Transactional
    public List<BmtBuyRes> save(UserPrincipal user, List<BmtBuySaveReq> rows) {
        List<BmtBuyRes> result = new ArrayList<>();
        for (BmtBuySaveReq req : rows) {
            long buyId;
            if (req.buyId() == null || req.buyId() <= 0) {
                buyId = mapper.selectNextId();
                mapper.insert(buyId, user.getCompanyId(), user.getUserId(), req);
            } else {
                buyId = req.buyId();
                if (mapper.update(user.getCompanyId(), buyId, req) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
            result.add(mapper.selectById(user.getCompanyId(), buyId));
        }
        return result;
    }

    /** AS-IS delete → UpdateDataModel.deleteModel. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> buyIds) {
        if (buyIds == null || buyIds.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), buyIds);
    }
}
