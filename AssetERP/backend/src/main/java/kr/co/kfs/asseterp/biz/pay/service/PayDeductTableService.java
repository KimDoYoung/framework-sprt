package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayDeductTableMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/pay/Pay24_DeductTable.java. 근로소득 공제표는 회사와 무관한 공통 표라 조회는 로그인한 누구나, 생성·저장·삭제는 관리자 회사만 한다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayDeductTableService {

    /** DeductDataCode: 1 공제한도 / 2 공제표 */
    private static final String LIMIT = "1";
    private static final String TABLE = "2";

    private final PayDeductTableMapper mapper;

    /** AS-IS selectByAll: 적용일 목록(최신순) */
    public List<PayStartDateRes> searchDates() {
        return mapper.selectDates();
    }

    /** AS-IS selectByDataCode("2"): 공제표 구간 */
    public List<PayDeductTableRes> search(LocalDate startDate) {
        return mapper.selectByDataCode(startDate, TABLE);
    }

    /** AS-IS selectByDataCode("1"): 공제한도 — 행이 없거나 비었으면 0 */
    public long searchLimit(LocalDate startDate) {
        List<PayDeductTableRes> rows = mapper.selectByDataCode(startDate, LIMIT);
        return rows.isEmpty() || rows.get(0).limitAmt() == null ? 0L : rows.get(0).limitAmt();
    }

    /**
     * AS-IS insert: 적용일 이전 가장 최근 적용일의 공제한도(1)·공제표(2) 행을 새 적용일로 복사한다(없으면 공제한도 0 한 줄).
     * 복사는 구분 1은 한도만, 구분 2는 구간 값만 옮긴다
     */
    @Transactional
    public void createDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용일은 필수입력 항목입니다");
        }
        List<PayDeductTableRes> latest = mapper.selectByStartDate(startDate);
        if (latest.isEmpty()) {
            mapper.insert(mapper.selectNextId(), new PayDeductTableRes(null, startDate, LIMIT, 0L, null, null, null, null, null));
            return;
        }
        for (PayDeductTableRes row : latest) {
            PayDeductTableRes copy = LIMIT.equals(row.dataCode())
                    ? new PayDeductTableRes(null, startDate, row.dataCode(), row.limitAmt(), null, null, null, null, null)
                    : new PayDeductTableRes(null, startDate, row.dataCode(), null, row.fromAmt(), row.toAmt(), row.deductAmt(), row.deductRate(), row.note());
            mapper.insert(mapper.selectNextId(), copy);
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

    /** AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 구분 2(공제표)로 새 id에 넣는다 → 저장된 행(요청 순서) */
    @Transactional
    public List<PayDeductTableRes> save(UserPrincipal user, List<PayDeductTableSaveReq> rows) {
        requireSysAdmin(user);
        for (PayDeductTableSaveReq req : rows) {
            if (req.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.deductTableId() != null && req.deductTableId() > 0 && mapper.selectById(req.deductTableId()) != null;
            if (exists) {
                mapper.update(req);
                return mapper.selectById(req.deductTableId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, new PayDeductTableRes(null, req.startDate(), TABLE, null, req.fromAmt(), req.toAmt(), req.deductAmt(), req.deductRate(), req.note()));
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(ids);
    }

    /** AS-IS updateLimitAmt(dataCode "1"): 적용일의 공제한도를 고친다 → 고친 건수 */
    @Transactional
    public int saveLimit(UserPrincipal user, LocalDate startDate, Long limitAmt) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
        }
        return mapper.updateLimitAmt(startDate, LIMIT, limitAmt);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
