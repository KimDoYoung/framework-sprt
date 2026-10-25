package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckRecordRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckRecordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 점검(승인) 이력 (AS-IS Tdm55_Lookup_ChckRecord, N20) → server/tdm/Tdm55_ChckRecord */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmChckRecordService {

    private final TdmChckRecordMapper mapper;

    /** AS-IS tdm.Tdm55_ChckRecord.selectByChckOrgId (exceptionTable TDM51) — 로그인 회사의 점검부서만 */
    public List<ChckRecordRes> searchByChckOrg(UserPrincipal user, Long chckOrgId) {
        Long companyId = mapper.selectChckOrgCompanyId(chckOrgId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return mapper.selectByChckOrgId(chckOrgId);
    }
}
