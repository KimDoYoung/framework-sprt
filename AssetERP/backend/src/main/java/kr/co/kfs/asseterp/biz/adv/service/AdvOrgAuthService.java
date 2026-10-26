package kr.co.kfs.asseterp.biz.adv.service;

import kr.co.kfs.asseterp.biz.adv.dto.AccountOrgAuthSearchParam;
import kr.co.kfs.asseterp.biz.adv.dto.AccountRes;
import kr.co.kfs.asseterp.biz.adv.dto.OrgAuthBulkReq;
import kr.co.kfs.asseterp.biz.adv.mapper.AdvOrgAuthMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/adv/Adv05_OrgAuth (Q02 일임계좌 권한설정) + Adv02_Account.selectByOrgAuthPaging */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdvOrgAuthService {

    private final AdvOrgAuthMapper mapper;
    private final EmpTransInfoService transInfoService;

    /**
     * AS-IS adv.Adv02_Account.selectByOrgAuthPaging(목록 + …Total). 로그인 사용자의 조직(LoginUser.getOrgCodeId)이 권한을 가진 계좌.
     * 회사관리자(userId &lt; 0)는 조직이 없어 0 → 비어 나온다. LIKE '%검색어%'는 서버가 만든다
     */
    public PageRes<AccountRes> searchByOrgAuth(UserPrincipal user, String searchText, int offset, int limit) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        AccountOrgAuthSearchParam param = new AccountOrgAuthSearchParam(user.getCompanyId(), orgId, like, Math.max(offset, 0), limit > 0 ? limit : 500);
        return new PageRes<>(mapper.selectByOrgAuthPagingTotal(param), mapper.selectByOrgAuthPaging(param));
    }

    /**
     * AS-IS adv.Adv05_OrgAuth.updateAuthYn L29 (일괄 권한설정). 계좌 × 조직마다 권한 행이 있으면 authYn만 고치고 없으면 새 id로 넣는다.
     * 계좌·조직은 로그인 회사 것만(보안 보강). 처리한 건수(계좌 수 × 조직 수)를 돌려준다. 원본은 목록이 비면 status -1
     */
    @Transactional
    public int updateAuthYn(UserPrincipal user, OrgAuthBulkReq req) {
        List<Long> accounts = req.accountIds() == null ? List.of() : req.accountIds();
        List<Long> orgs = req.orgCodeIds() == null ? List.of() : req.orgCodeIds();
        String authYn = "true".equals(req.confirm()) ? "true" : "false";
        if (accounts.isEmpty() || orgs.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        for (Long accountId : accounts) {
            if (accountId == null || mapper.countAccount(accountId, user.getCompanyId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "일임계좌를 찾을 수 없습니다.");
            }
        }
        for (Long orgCodeId : orgs) {
            if (orgCodeId == null || mapper.countOrg(orgCodeId, user.getCompanyId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "조직을 찾을 수 없습니다.");
            }
        }
        int saved = 0;
        for (Long accountId : accounts) {
            for (Long orgCodeId : orgs) {
                Long orgAuthId = mapper.selectOrgAuthId(accountId, orgCodeId);
                saved += orgAuthId != null
                        ? mapper.updateAuthYn(orgAuthId, authYn)
                        : mapper.insertOrgAuth(mapper.selectNextId(), accountId, orgCodeId, authYn);
            }
        }
        return saved;
    }
}
