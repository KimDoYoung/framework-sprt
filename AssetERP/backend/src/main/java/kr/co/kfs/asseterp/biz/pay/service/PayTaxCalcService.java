package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayTaxCalcMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/pay/Pay26_TaxCalcTable.java. 과세표준 구간별 기본세율은 회사와 무관한 공통 표라 조회는 로그인한 누구나, 생성·저장·삭제는 관리자 회사만 한다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayTaxCalcService {

    private final PayTaxCalcMapper mapper;

    /** AS-IS selectByAll: 적용일 목록(최신순) */
    public List<PayStartDateRes> searchDates() {
        return mapper.selectDates();
    }

    /** AS-IS selectByDate */
    public List<PayTaxCalcRes> search(LocalDate startDate) {
        return mapper.selectByDate(startDate);
    }

    /** AS-IS insert: 적용일 이전 가장 최근 적용일의 행을 새 적용일로 복사한다(없으면 초과·이하 0 한 줄) */
    @Transactional
    public void createDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용일은 필수입력 항목입니다");
        }
        List<PayTaxCalcRes> latest = mapper.selectByStartDate(startDate);
        if (latest.isEmpty()) {
            mapper.insert(mapper.selectNextId(), new PayTaxCalcSaveReq(null, startDate, 0L, 0L, null, null, null));
            return;
        }
        for (PayTaxCalcRes row : latest) {
            mapper.insert(mapper.selectNextId(),
                    new PayTaxCalcSaveReq(null, startDate, row.fromAmt(), row.toAmt(), row.basicTax(), row.rate(), row.note()));
        }
    }

    /** AS-IS deleteByDate: 해당 적용일을 통째로 지운다 → 지운 건수 */
    @Transactional
    public int deleteDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
        }
        return mapper.deleteByDate(startDate);
    }

    /**
     * AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서).
     * 원본은 필수값 검사가 없어 NOT NULL 열이 비면 DB 오류가 나므로 서버가 먼저 막는다
     */
    @Transactional
    public List<PayTaxCalcRes> save(UserPrincipal user, List<PayTaxCalcSaveReq> rows) {
        requireSysAdmin(user);
        for (PayTaxCalcSaveReq req : rows) {
            if (req.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
            }
            if (req.fromAmt() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "초과 금액은 필수입력 항목입니다.");
            }
            if (req.toAmt() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이하 금액은 필수입력 항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.taxCalcTableId() != null && req.taxCalcTableId() > 0 && mapper.selectById(req.taxCalcTableId()) != null;
            if (exists) {
                mapper.update(req);
                return mapper.selectById(req.taxCalcTableId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(ids);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
