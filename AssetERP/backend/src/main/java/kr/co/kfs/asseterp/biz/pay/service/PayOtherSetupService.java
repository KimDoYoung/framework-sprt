package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayOtherSetupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayOtherSetupSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayOtherSetupMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/pay/Pay29_OtherSetup.java. 급여공제 기타설정은 회사와 무관한 공통 표라 조회는 로그인한 누구나, 생성·저장·삭제는 관리자 회사만 한다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayOtherSetupService {

    private final PayOtherSetupMapper mapper;

    /** AS-IS selectByAll: 적용일 목록(최신순) */
    public List<PayStartDateRes> searchDates() {
        return mapper.selectDates();
    }

    /** AS-IS selectByDate */
    public List<PayOtherSetupRes> search(LocalDate startDate) {
        return mapper.selectByDate(startDate);
    }

    /** AS-IS insert: 적용일 이전 가장 최근 적용일의 행을 새 적용일로 복사한다(없으면 값이 빈 한 줄) */
    @Transactional
    public void createDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용일은 필수입력 항목입니다");
        }
        List<PayOtherSetupRes> latest = mapper.selectByStartDate(startDate);
        if (latest.isEmpty()) {
            mapper.insert(mapper.selectNextId(), new PayOtherSetupSaveReq(null, startDate, null, null, null, null, null, null, null, null));
            return;
        }
        for (PayOtherSetupRes row : latest) {
            mapper.insert(mapper.selectNextId(), new PayOtherSetupSaveReq(null, startDate, row.hiMaxDiv(), row.eiMaxDiv(), row.hiMinAmt(),
                    row.hiMaxAmt(), row.npMinAmt(), row.npMaxAmt(), row.stdTaxDeduct(), row.note()));
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

    /** AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서) */
    @Transactional
    public List<PayOtherSetupRes> save(UserPrincipal user, List<PayOtherSetupSaveReq> rows) {
        requireSysAdmin(user);
        for (PayOtherSetupSaveReq req : rows) {
            if (req.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.otherSetupId() != null && req.otherSetupId() > 0 && mapper.selectById(req.otherSetupId()) != null;
            if (exists) {
                mapper.update(req);
                return mapper.selectById(req.otherSetupId());
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
