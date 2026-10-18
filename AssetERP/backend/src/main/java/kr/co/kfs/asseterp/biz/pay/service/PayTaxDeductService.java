package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductLimitRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductLimitSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayTaxDeductMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/pay/Pay27_TaxDeductTable.java + Pay28_TaxDeductLimit.java. 근로소득 세액공제와 그 한도는 회사와 무관한 공통 표라
 * 조회는 로그인한 누구나, 생성·저장·삭제는 관리자 회사만 한다. 적용일 생성·삭제는 두 표를 같이 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayTaxDeductService {

    private final PayTaxDeductMapper mapper;

    /** AS-IS Pay27.selectByAll: 적용일 목록(최신순) */
    public List<PayStartDateRes> searchDates() {
        return mapper.selectDates();
    }

    /** AS-IS Pay27.selectByDate */
    public List<PayTaxDeductRes> search(LocalDate startDate) {
        return mapper.selectByDate(startDate);
    }

    /** AS-IS Pay28.selectByDate */
    public List<PayTaxDeductLimitRes> searchLimits(LocalDate startDate) {
        return mapper.selectLimitByDate(startDate);
    }

    /**
     * AS-IS Pay27.insert: 적용일 이전 가장 최근 적용일의 세액공제(pay27)·한도(pay28) 행을 새 적용일로 복사한다.
     * 둘 다 없으면 세액공제 한 줄(초과·이하 0)만 넣는다
     */
    @Transactional
    public void createDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용일은 필수입력 항목입니다");
        }
        List<PayTaxDeductRes> latest = mapper.selectByStartDate(startDate);
        List<PayTaxDeductLimitRes> latestLimits = mapper.selectLimitByStartDate(startDate);
        if (latest.isEmpty() && latestLimits.isEmpty()) {
            mapper.insert(mapper.selectNextId(), new PayTaxDeductSaveReq(null, startDate, 0L, 0L, null, null, null));
            return;
        }
        for (PayTaxDeductRes row : latest) {
            mapper.insert(mapper.selectNextId(),
                    new PayTaxDeductSaveReq(null, startDate, row.fromAmt(), row.toAmt(), row.deductAmt(), row.rate(), row.note()));
        }
        for (PayTaxDeductLimitRes row : latestLimits) {
            mapper.insertLimit(mapper.selectNextId(), new PayTaxDeductLimitSaveReq(null, startDate, row.fromAmt(), row.toAmt(),
                    row.minLimit(), row.maxLimit(), row.rate(), row.note()));
        }
    }

    /** AS-IS Pay27.deleteByDate: 해당 적용일의 세액공제·한도를 통째로 지운다 → 지운 건수(세액공제 + 한도) */
    @Transactional
    public int deleteDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
        }
        return mapper.deleteByDate(startDate) + mapper.deleteLimitByDate(startDate);
    }

    /** AS-IS Pay27.update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서) */
    @Transactional
    public List<PayTaxDeductRes> save(UserPrincipal user, List<PayTaxDeductSaveReq> rows) {
        requireSysAdmin(user);
        for (PayTaxDeductSaveReq req : rows) {
            requireAmounts(req.startDate(), req.fromAmt(), req.toAmt());
        }
        return rows.stream().map(req -> {
            boolean exists = req.taxDeductTableId() != null && req.taxDeductTableId() > 0 && mapper.selectById(req.taxDeductTableId()) != null;
            if (exists) {
                mapper.update(req);
                return mapper.selectById(req.taxDeductTableId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS Pay27.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(ids);
    }

    /** AS-IS Pay28.update(UpdateDataModel) → 저장된 행(요청 순서) */
    @Transactional
    public List<PayTaxDeductLimitRes> saveLimits(UserPrincipal user, List<PayTaxDeductLimitSaveReq> rows) {
        requireSysAdmin(user);
        for (PayTaxDeductLimitSaveReq req : rows) {
            requireAmounts(req.startDate(), req.fromAmt(), req.toAmt());
        }
        return rows.stream().map(req -> {
            boolean exists = req.taxDeductLimitId() != null && req.taxDeductLimitId() > 0 && mapper.selectLimitById(req.taxDeductLimitId()) != null;
            if (exists) {
                mapper.updateLimit(req);
                return mapper.selectLimitById(req.taxDeductLimitId());
            }
            long newId = mapper.selectNextId();
            mapper.insertLimit(newId, req);
            return mapper.selectLimitById(newId);
        }).toList();
    }

    /** AS-IS Pay28.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int deleteLimits(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteLimitByIds(ids);
    }

    /** 원본은 필수값 검사가 없어 NOT NULL 열이 비면 DB 오류가 나므로 서버가 먼저 막는다 */
    private static void requireAmounts(LocalDate startDate, Long fromAmt, Long toAmt) {
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
        }
        if (fromAmt == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "초과 금액은 필수입력 항목입니다.");
        }
        if (toAmt == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이하 금액은 필수입력 항목입니다.");
        }
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
