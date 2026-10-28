package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayDeductTableMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayPersonDeductMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRetireMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayTaxCalcMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayTaxDeductMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 소득세 탭 [근로소득공제표][인적공제금액][산출세액표][산출기준] 보기 창 (S22) — AS-IS pay.Pay24_DeductTable·Pay25_PersonDeduct·Pay26_TaxCalcTable·
 * Pay27_TaxDeductTable·Pay28_TaxDeductLimit .selectByMonthId: 급여의 지급일자 이전 가장 최근 적용일의 표(E22 급여기초정보의 표와 같은 자료)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayRetireTableService {

    private final PayRetireMapper mapper;
    private final PayDeductTableMapper deductMapper;
    private final PayPersonDeductMapper personDeductMapper;
    private final PayTaxCalcMapper taxCalcMapper;
    private final PayTaxDeductMapper taxDeductMapper;

    public PayRetireDeductRes deduct(UserPrincipal user, Long monthId) {
        LocalDate date = monthDate(user, monthId);
        List<PayDeductTableRes> all = deductMapper.selectByStartDate(date);
        Long limitAmt = all.stream().filter(r -> "1".equals(r.dataCode())).map(PayDeductTableRes::limitAmt).filter(v -> v != null).findFirst().orElse(0L);
        return new PayRetireDeductRes(limitAmt, all.stream().filter(r -> "2".equals(r.dataCode())).toList());
    }

    public List<PayPersonDeductRes> personDeduct(UserPrincipal user, Long monthId) {
        return personDeductMapper.selectByStartDate(monthDate(user, monthId));
    }

    public List<PayTaxCalcRes> taxCalc(UserPrincipal user, Long monthId) {
        return taxCalcMapper.selectByStartDate(monthDate(user, monthId));
    }

    public PayRetireTaxDeductRes taxDeduct(UserPrincipal user, Long monthId) {
        LocalDate date = monthDate(user, monthId);
        return new PayRetireTaxDeductRes(taxDeductMapper.selectByStartDate(date), taxDeductMapper.selectLimitByStartDate(date));
    }

    private LocalDate monthDate(UserPrincipal user, Long monthId) {
        LocalDate date = monthId == null ? null : mapper.selectMonthDate(user.getCompanyId(), monthId);
        if (date == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return date;
    }
}
