package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireMonthRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRetireMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 퇴직정산 Pay10_Tab_Retire (S22) — AS-IS pay.Pay10_Month(selectByPersonId·selectByRetirePayCode) + Pay12_RetireInsure.getInsureRetire.
 * 생성·삭제의 계산은 DB 함수(f_calc_leave_pay_retire · f_calc_4insure_retire · f_calc_income_tax_retire)가 하며 결과가 'Y'가 아니면 그 문구를 오류로 낸다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayRetireService {

    private static final String PAY_CODE = "03";

    private final PayRetireMapper mapper;

    /** 사원의 퇴직정산 급여 한 건 — 없으면 null(화면이 "생성 후 다시 시도" 안내) */
    public PayRetireMonthRes month(UserPrincipal user, Long personId) {
        List<PayRetireMonthRes> list = mapper.selectMonthByPerson(user.getCompanyId(), personId);
        return list.isEmpty() ? null : list.get(0);
    }

    /** RD 폼 행 수: AS-IS retrieve()의 지급(1)·공제(2) 항목 수 중 큰 값(항목이 없으면 빈 행 1개씩이라 최소 1) */
    public long rdRowCount(UserPrincipal user, Long personId) {
        if (mapper.countPerson(user.getCompanyId(), personId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return Math.max(1, Math.max(mapper.countRetireItems(personId, "1"), mapper.countRetireItems(personId, "2")));
    }

    /** AS-IS getInsureRetire(actionCode insert): 연차수당(P) → 4대보험(P) → 소득세(P) */
    @Transactional
    public void create(UserPrincipal user, PayRetireCreateReq req) {
        requirePerson(user, req.personId());
        require(mapper.callLeavePayRetire(req.personId(), "P"));
        require(mapper.callInsureRetire(req.personId(), String.valueOf(req.insureCheckYn()), "P"));
        require(mapper.callIncomeTaxRetire(req.personId(), String.valueOf(req.taxCheckYn()), 0));
    }

    /**
     * AS-IS delete() → getInsureRetire(actionCode C): 연차수당(C) → 4대보험(C) → 소득세(C) → 상신 연결(pay05) 삭제.
     * 퇴직정산서가 없으면 false(화면이 안내 문구를 낸다)
     */
    @Transactional
    public boolean delete(UserPrincipal user, Long personId) {
        PayRetireMonthRes month = month(user, personId);
        if (month == null) {
            return false;
        }
        require(mapper.callLeavePayRetire(personId, "C"));
        require(mapper.callInsureRetire(personId, "false", "C"));
        require(mapper.callIncomeTaxRetireC(personId, 0));
        mapper.deleteRelateApprRetire(user.getCompanyId(), month.date(), PAY_CODE, month.monthId());
        return true;
    }

    private void requirePerson(UserPrincipal user, Long personId) {
        if (personId == null || mapper.countPerson(user.getCompanyId(), personId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private void require(String resultMsg) {
        if (!"Y".equals(resultMsg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, resultMsg);
        }
    }
}
