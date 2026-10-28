package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveCalcRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveSummary;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireMonthRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRetireMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 퇴직정산 연차수당 탭 Pay15_TabPage_RetireLeave · 잔여휴가 팝업 Pay10_Lookup_RemLeaveDays (S22) — AS-IS pay.Pay15_RetireLeave */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayRetireLeaveService {

    private final PayRetireMapper mapper;
    private final PayRetireService retireService;

    /** retrieve(): 퇴직정산서가 없으면(또는 퇴직일이 없으면) null — 화면이 "생성 후 다시 시도" 안내 */
    public PayRetireLeaveRes retrieve(UserPrincipal user, Long personId) {
        PayRetireMonthRes month = retireService.month(user, personId);
        if (month == null || month.retireDate() == null) {
            return null;
        }
        String year = String.valueOf(month.retireDate().getYear());
        PayRetireLeaveSummary s = mapper.selectRetireLeave(month.monthId(), personId, month.retireDate(), year);
        return new PayRetireLeaveRes(s == null ? null : s.remainLeaveDays(), s == null ? null : s.addLeaveDays(),
                s == null ? null : s.totalRemainLeaveDays(), s == null ? null : s.dailyAmt(), s == null ? null : s.retireLeaveAmt(),
                mapper.selectLeaveRows(month.monthId(), "1"), mapper.selectLeaveRows(month.monthId(), "2"));
    }

    /**
     * [계산]: pay.Pay15_RetireLeave.calcRetireLeaveDays(f_calc_rem_leave_days) → selectRemLeaveDays → selectByMonthId(monthId = 사원ID)
     * 계산은 pay16·pay15에 임시로 쓴다(AS-IS 그대로)
     */
    @Transactional
    public PayRetireLeaveCalcRes calc(UserPrincipal user, Long personId, LocalDate retireDate) {
        if (personId == null || retireDate == null || mapper.countPerson(user.getCompanyId(), personId) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String msg = mapper.calcRemLeaveDays(personId, retireDate);
        if (!"Y".equals(msg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        }
        PayRetireLeaveSummary s = mapper.selectRemLeaveDays(personId);
        List<kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveRowRes> entry = mapper.selectLeaveRows(personId, "1");
        List<kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveRowRes> fiscal = mapper.selectLeaveRows(personId, "2");
        return new PayRetireLeaveCalcRes(s == null ? null : s.remainLeaveDays(), s == null ? null : s.addLeaveDays(),
                s == null ? null : s.totalRemainLeaveDays(), entry, fiscal);
    }
}
