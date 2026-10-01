package kr.co.kfs.asseterp.oms.biz.org.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgHistoryRes;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgCodeMapper;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgHistoryMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 조직정보 이력 (AS-IS server/org/Org02_Info — 이름이 겹치는 Org00_OrgInfo(조직 Lookup)와 구분해 OrgHistory*) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgHistoryService {

    private final OrgHistoryMapper orgHistoryMapper;
    private final OrgCodeMapper orgCodeMapper;
    private final OrgCodeService orgCodeService;

    /** AS-IS selectByOnlyOrgCodeId */
    public List<OrgHistoryRes> searchHistories(UserPrincipal user, Long codeId) {
        orgCodeService.requireOrg(user, codeId);
        return orgHistoryMapper.searchByCodeId(codeId);
    }

    /** AS-IS deleteCheck + deleteOrg: 하위 조직·발령 사원이 없을 때만 조직(코드 + 모든 이력)을 지운다 */
    @Transactional
    public void deleteOrg(UserPrincipal user, Long codeId) {
        orgCodeService.requireOrg(user, codeId);
        if (orgHistoryMapper.countChildren(codeId) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "하위부서를 먼저 삭제 후 삭제가능합니다");
        }
        if (orgHistoryMapper.countEmployees(codeId) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "해당부서에 사원이 존재합니다");
        }
        orgHistoryMapper.deleteInfosByCode(codeId);
        orgCodeMapper.deleteCode(codeId);
    }

    /** AS-IS delete: 이력 한 건 */
    @Transactional
    public void deleteHistory(UserPrincipal user, Long codeId, Long infoId) {
        orgCodeService.requireOrg(user, codeId);
        orgCodeService.requireInfo(codeId, infoId);
        orgHistoryMapper.deleteInfo(infoId);
    }
}
