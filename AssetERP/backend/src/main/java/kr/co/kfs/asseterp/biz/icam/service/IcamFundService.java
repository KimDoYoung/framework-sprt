package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFundParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFundRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamFundMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/icam/Icam03_Fund.java (selectRecentFund L29 / selectByPaging L39 = 목록 + 전체 건수).
 * 회사는 화면에서 조회창으로 고른다. 관리자 회사가 아니면 자기 회사만 — 원본은 조회창이 막는 것을 서버도 막는다(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamFundService {

    private final IcamFundMapper mapper;
    private final IcamBatchRunner batchRunner;

    public List<IcamFundRes> searchRecent(UserPrincipal user, Long companyId) {
        return mapper.selectRecentFund(allowedCompany(user, companyId));
    }

    public PageRes<IcamFundRes> searchHistory(UserPrincipal user, Long companyId, String fundCode, int offset, int limit) {
        IcamFundParam param = new IcamFundParam(allowedCompany(user, companyId), fundCode, Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(mapper.selectByNameTotal(param), mapper.selectByNamePaging(param));
    }

    /** AS-IS BatchMain?actionCode=icamFund|extrFund&companyId=…&worker=… (연동이 없으면 거절) */
    public void runBatch(UserPrincipal user, String actionCode, String companyId) {
        if (!"icamFund".equals(actionCode) && !"extrFund".equals(actionCode)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String target = "ALL".equals(companyId) ? companyId : String.valueOf(allowedCompany(user, parseId(companyId)));
        if ("ALL".equals(target) && !user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        batchRunner.run(actionCode, target, user.getName());
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
