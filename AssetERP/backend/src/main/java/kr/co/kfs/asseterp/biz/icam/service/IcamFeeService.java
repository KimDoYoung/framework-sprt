package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamFeeMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * AS-IS server/icam/Icam10_Fee.java (selectByFeeTypePaging L29 = 목록 + 전체 건수).
 * 관리자 회사가 아니면 자기 회사만 — 원본은 조회창이 막는 것을 서버도 막는다(보안 보강, D07과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamFeeService {

    private final IcamFeeMapper mapper;
    private final IcamBatchRunner batchRunner;

    public PageRes<IcamFeeRes> search(UserPrincipal user, Long companyId, String feeType, LocalDate startDate, LocalDate closeDate,
                                      String searchText, int offset, int limit) {
        IcamFeeParam param = new IcamFeeParam(allowedCompany(user, companyId), feeType, startDate, closeDate,
                searchText == null ? "" : searchText, Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(mapper.selectByFeeTypePagingTotal(param), mapper.selectByFeeTypePaging(param));
    }

    /** AS-IS BatchMain?actionCode=icamOfficeMngFee|icamFundMngFee&companyId=…&worker=…&startDate=…&closeDate=… (연동이 없으면 거절) */
    public void runBatch(UserPrincipal user, String actionCode, String companyId, LocalDate startDate, LocalDate closeDate) {
        if (!"icamOfficeMngFee".equals(actionCode) && !"icamFundMngFee".equals(actionCode)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        if (startDate == null || closeDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String target = "ALL".equals(companyId) ? companyId : String.valueOf(allowedCompany(user, parseId(companyId)));
        if ("ALL".equals(target) && !user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        batchRunner.runFee(actionCode, target, user.getName(), startDate, closeDate);
    }

    private static Long parseId(String companyId) {
        try {
            return Long.valueOf(companyId);
        } catch (NumberFormatException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
    }

    private static Long allowedCompany(UserPrincipal user, Long companyId) {
        if (user.isSysAdmin()) {
            return companyId;
        }
        if (companyId != null && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return user.getCompanyId();
    }
}
