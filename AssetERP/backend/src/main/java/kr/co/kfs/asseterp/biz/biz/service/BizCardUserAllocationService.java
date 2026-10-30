package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardUserAllocationRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardUserAllocationUpdateReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizCardUserAllocationMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Biz01_Tab_CardUserAllocation → server/biz/Biz01_Promo.java (selectCardCommonUser L101 / updateRealPersonId L803) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizCardUserAllocationService {

    /** retrieve() L142-158 의 providePurCode "%" */
    private static final String ALL = "%";

    private final BizCardUserAllocationMapper mapper;

    /** AS-IS biz.Biz01_Promo.selectCardCommonUser — 공통카드 사용내역. unassignedOnly = "미분배건 조회" 체크 */
    public List<BizCardUserAllocationRes> search(UserPrincipal user, String dataYm, boolean unassignedOnly) {
        return mapper.selectCardCommonUser(user.getCompanyId(), dataYm, ALL, unassignedOnly);
    }

    /** AS-IS biz.Biz01_Promo.updateRealPersonId — 고른 내역마다 실사용자를 바꾼다(null = 공통). 저장한 건수 */
    @Transactional
    public int update(UserPrincipal user, BizCardUserAllocationUpdateReq req) {
        if (req.promoIds() == null || req.promoIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        int count = 0;
        for (Long promoId : req.promoIds()) {
            count += mapper.updateRealPersonId(promoId, req.realPersonId());
        }
        return count;
    }
}
