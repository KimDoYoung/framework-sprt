package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireStatementCreateReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRetireStatementMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 퇴직정산서 생성 (AS-IS server/pay/Pay07_Retire.java createRetire L61-93) */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PayRetireStatementService {

    private final PayRetireStatementMapper mapper;

    /** 상신 확인("결재진행중 또는 이미 완료된 문서입니다.") 뒤 프로시저 pay07_retire_create. 빈 금액은 0 (AS-IS L169-187) */
    @Transactional
    public void create(UserPrincipal user, PayRetireStatementCreateReq req) {
        if (req.personId() == null || mapper.countPerson(user.getCompanyId(), req.personId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if ("false".equals(mapper.checkAppr(req.personId()))) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재진행중 또는 이미 완료된 문서입니다.");
        }
        mapper.createRetire(req.personId(), user.getUserId(), nz(req.calcMonth()), nz(req.fixHi()), nz(req.fixLt()), nz(req.fixEi()),
                req.nonHiYn(), req.nonLtYn(), req.nonEiYn());
    }

    private static long nz(Long v) {
        return v == null ? 0L : v;
    }
}
