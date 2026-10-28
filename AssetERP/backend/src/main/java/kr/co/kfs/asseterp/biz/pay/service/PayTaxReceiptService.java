package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayTaxReceiptMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/pay/Pay08_TaxWithholding.java (selectByPersonId L34) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayTaxReceiptService {

    private final PayTaxReceiptMapper mapper;

    /** 원천징수영수증(사본)(S24) — AS-IS retrieve() L113: personId = 로그인 사용자. 사원은 서버가 정한다(남의 영수증을 못 본다) */
    public List<PayTaxReceiptRes> searchMine(UserPrincipal user) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId());
    }
}
