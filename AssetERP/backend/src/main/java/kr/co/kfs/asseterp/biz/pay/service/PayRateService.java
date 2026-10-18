package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRateSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRateMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/pay/Pay21_Rate.java (selectByCode L24 / update L34 / delete L39).
 * 율관리는 회사와 무관한 공통 표라 저장·삭제는 관리자 회사만 한다(보안 보강, E21과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayRateService {

    private final PayRateMapper mapper;

    /** AS-IS selectByCode: 율 구분 코드(전체면 "%") */
    public List<PayRateRes> search(String rateCode) {
        return mapper.selectByCode(rateCode == null || rateCode.isEmpty() ? "%" : rateCode);
    }

    /**
     * AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서).
     * 원본은 필수값 검사가 없어 NOT NULL 열이 비면 DB 오류가 나므로 서버가 먼저 막는다
     */
    @Transactional
    public List<PayRateRes> save(UserPrincipal user, List<PayRateSaveReq> rows) {
        requireSysAdmin(user);
        for (PayRateSaveReq req : rows) {
            if (req.rateCode() == null || req.rateCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "율 구분은 필수입력 항목입니다.");
            }
            if (req.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "적용시작일은 필수입력 항목입니다.");
            }
            if (req.applyRate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "율(%)은 필수입력 항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.rateId() != null && req.rateId() > 0 && mapper.selectById(req.rateId()) != null;
            if (exists) {
                mapper.update(req);
                return mapper.selectById(req.rateId());
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
