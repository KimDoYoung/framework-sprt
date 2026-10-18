package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayPersonDeductMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/pay/Pay25_PersonDeduct.java. 인적공제금액은 회사와 무관한 공통 표라 조회는 로그인한 누구나, 생성·저장·삭제는 관리자 회사만 한다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayPersonDeductService {

    /** AS-IS insert: 이전 데이터가 없을 때 넣는 구분(PersonDeductCode 1) */
    private static final String FIRST_CODE = "1";

    private final PayPersonDeductMapper mapper;

    /** AS-IS selectByAll: 적용일 목록(최신순) */
    public List<PayStartDateRes> searchDates() {
        return mapper.selectDates();
    }

    /** AS-IS selectByDate */
    public List<PayPersonDeductRes> search(LocalDate startDate) {
        return mapper.selectByDate(startDate);
    }

    /** AS-IS insert: 적용일 이전 가장 최근 적용일의 행을 새 적용일로 복사한다(없으면 구분 1·금액 0 한 줄) */
    @Transactional
    public void createDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용일은 필수입력 항목입니다");
        }
        List<PayPersonDeductRes> latest = mapper.selectByStartDate(startDate);
        if (latest.isEmpty()) {
            mapper.insert(mapper.selectNextId(), new PayPersonDeductSaveReq(null, startDate, FIRST_CODE, 0L, null));
            return;
        }
        for (PayPersonDeductRes row : latest) {
            mapper.insert(mapper.selectNextId(), new PayPersonDeductSaveReq(null, startDate, row.personDeductCode(), row.deductAmt(), row.note()));
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
    public List<PayPersonDeductRes> save(UserPrincipal user, List<PayPersonDeductSaveReq> rows) {
        requireSysAdmin(user);
        for (PayPersonDeductSaveReq req : rows) {
            if (req.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
            }
            if (req.personDeductCode() == null || req.personDeductCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "구분은 필수입력 항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.personDeductId() != null && req.personDeductId() > 0 && mapper.selectById(req.personDeductId()) != null;
            if (exists) {
                mapper.update(req);
                return mapper.selectById(req.personDeductId());
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
