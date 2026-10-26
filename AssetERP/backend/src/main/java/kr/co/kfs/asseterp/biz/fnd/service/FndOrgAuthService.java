package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OrgAuthBulkReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOrgAuthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/fnd/Fnd08_OrgAuth.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndOrgAuthService {

    private final FndOrgAuthMapper mapper;

    /**
     * AS-IS fnd.Fnd08_OrgAuth.updateAuthYn L37 (P06 일괄 권한설정). 펀드 × 조직마다 권한 행이 있으면 authYn만 고치고 없으면 새 id로 넣는다.
     * 펀드·조직은 로그인 회사 것만(보안 보강). 처리한 건수(펀드 수 × 조직 수)를 돌려준다. 원본은 목록이 비면 status -1
     */
    @Transactional
    public int updateAuthYn(UserPrincipal user, OrgAuthBulkReq req) {
        List<Long> funds = req.fundCodeIds() == null ? List.of() : req.fundCodeIds();
        List<Long> orgs = req.orgCodeIds() == null ? List.of() : req.orgCodeIds();
        String authYn = "true".equals(req.confirm()) ? "true" : "false";
        if (funds.isEmpty() || orgs.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        for (Long fundCodeId : funds) {
            if (fundCodeId == null || mapper.countFund(fundCodeId, user.getCompanyId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "펀드를 찾을 수 없습니다.");
            }
        }
        for (Long orgCodeId : orgs) {
            if (orgCodeId == null || mapper.countOrg(orgCodeId, user.getCompanyId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "조직을 찾을 수 없습니다.");
            }
        }
        int saved = 0;
        for (Long fundCodeId : funds) {
            for (Long orgCodeId : orgs) {
                Long orgAuthId = mapper.selectOrgAuthId(fundCodeId, orgCodeId);
                saved += orgAuthId != null
                        ? mapper.updateAuthYn(orgAuthId, authYn)
                        : mapper.insertOrgAuth(mapper.selectNextId(), fundCodeId, orgCodeId, authYn);
            }
        }
        return saved;
    }
}
