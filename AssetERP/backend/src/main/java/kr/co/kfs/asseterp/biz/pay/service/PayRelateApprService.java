package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateApprRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRelateApprMapper;
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
}
