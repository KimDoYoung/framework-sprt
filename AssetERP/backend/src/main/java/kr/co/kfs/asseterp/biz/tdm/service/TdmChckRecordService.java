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

    /** AS-IS tdm.Tdm55_ChckRecord.selectByRelateId (exceptionTable NONE) — 로그인 회사의 점검항목·미흡/개선 내역만 */
    public List<ChckRecordRes> searchByRelate(UserPrincipal user, Long relateId) {
        Long companyId = mapper.selectRelateCompanyId(relateId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return mapper.selectByRelateId(relateId);
    }

    /** AS-IS tdm.Tdm55_ChckRecord.selectByInsuffId (exceptionTable TDM54) — 로그인 회사의 미흡/개선 내역만 */
    public List<ChckRecordRes> searchByInsuff(UserPrincipal user, Long chckInsuffId) {
        Long companyId = mapper.selectRelateCompanyId(chckInsuffId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return mapper.selectByInsuffId(chckInsuffId);
    }
}
