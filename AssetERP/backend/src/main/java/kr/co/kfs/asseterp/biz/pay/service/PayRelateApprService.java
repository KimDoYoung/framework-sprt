package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateApprRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRelateApprMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRetireMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/Pay05_RelateAppr.java (selectByCompanyId L26) — 급여대장 상신 상태 (S18). 상신(insert L60)·updateApprId(L119)는 결재문서 작성과 함께 다음 단계 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayRelateApprService {

    private final PayRelateApprMapper mapper;
    private final PayRetireMapper retireMapper;

    /** AS-IS retrieve(): 한 건일 때만 상신 상태로 본다 — 없거나 둘 이상이면 null(미상신) */
    public PayRelateApprRes current(UserPrincipal user, String payCode, LocalDate payDate) {
        List<PayRelateApprRes> list = mapper.selectByCompanyId(user.getCompanyId(), payCode, payDate);
        return list.size() == 1 ? list.get(0) : null;
    }

    /** AS-IS Pay10_TabPage_Retire.retrieveApprStep → pay05_relate_appr.selectByRetire — 한 건일 때만 상신 상태, 아니면 null(미상신) */
    public PayRelateApprRes retire(UserPrincipal user, Long monthId) {
        List<PayRelateApprRes> list = mapper.selectByRetire(user.getCompanyId(), monthId);
        return list.size() == 1 ? list.get(0) : null;
    }

    /**
     * AS-IS Pay05_RelateAppr.insertRetire (V18): 이 퇴직정산 급여의 상신 행이 있으면 그 ID, 없으면 새로 만들어 ID를 돌려준다.
     * AS-IS는 월 ID가 로그인 회사 것인지 보지 않지만 TOBE는 로그인 회사의 퇴직정산(03) 급여만 받는다.
     */
    @Transactional
    public Long createRetire(UserPrincipal user, Long monthId) {
        if (monthId == null || retireMapper.selectMonthDate(user.getCompanyId(), monthId) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "퇴직정산 급여를 찾을 수 없습니다.");
        }
        List<PayRelateApprRes> list = mapper.selectByRetire(user.getCompanyId(), monthId);
        if (list.size() > 1) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "퇴직정산 상신 내역이 둘 이상입니다.");
        }
        if (list.size() == 1) {
            return list.get(0).relateApprId();
        }
        Long id = retireMapper.selectNextId();
        mapper.insertRetire(id, user.getCompanyId(), monthId);
        return id;
    }

    /** AS-IS Pay05_RelateAppr.updateApprId (V18): 결재창에서 상신·저장한 문서 ID와 회사 출금계좌를 상신 행에 기록 */
    @Transactional
    public void updateApprId(UserPrincipal user, Long relateApprId, Long apprId) {
        if (mapper.updateApprId(relateApprId, user.getCompanyId(), apprId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신 내역을 찾을 수 없습니다.");
        }
    }
}
