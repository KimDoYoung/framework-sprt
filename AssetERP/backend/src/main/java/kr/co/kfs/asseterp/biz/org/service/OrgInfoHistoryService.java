package kr.co.kfs.asseterp.biz.org.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoHistRes;
import kr.co.kfs.asseterp.biz.org.mapper.OrgCodeMapper;
import kr.co.kfs.asseterp.biz.org.mapper.OrgInfoHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/org/Org02_Info.java (selectByOnlyOrgCodeId / deleteCheck / deleteOrg / delete) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgInfoHistoryService {

    private final OrgInfoHistoryMapper orgInfoHistoryMapper;
    private final OrgCodeMapper orgCodeMapper;

    /** AS-IS selectByOnlyOrgCodeId L20-29: 조직의 이력, 변경일 내림차순 */
    public List<OrgInfoHistRes> searchInfos(UserPrincipal user, Long codeId) {
        return orgInfoHistoryMapper.searchInfos(user.getCompanyId(), codeId);
    }

    /** AS-IS deleteCheck L31-43: 하위 조직이 있으면 -1, 발령된 사원이 있으면 -2, 아니면 1 */
    public int deleteCheck(UserPrincipal user, Long codeId) {
        requireOwn(user, codeId);
        if (orgInfoHistoryMapper.countChildInfos(codeId) > 0) return -1;
        if (orgInfoHistoryMapper.countTrans(codeId) > 0) return -2;
        return 1;
    }

    /** AS-IS deleteOrg L45-51: 조직의 이력 전부와 조직 코드를 지운다 */
    @Transactional
    public int deleteOrg(UserPrincipal user, Long codeId) {
        requireOwn(user, codeId);
        orgInfoHistoryMapper.deleteOrgInfos(codeId);
        orgInfoHistoryMapper.deleteOrgCode(user.getCompanyId(), codeId);
        return 1;
    }

    /** AS-IS delete L58-61: 선택한 이력 행 삭제 → 지운 건수 */
    @Transactional
    public int deleteInfos(UserPrincipal user, Long codeId, List<Long> infoIds) {
        requireOwn(user, codeId);
        if (infoIds == null || infoIds.isEmpty()) return 0;
        return orgInfoHistoryMapper.deleteInfos(user.getCompanyId(), codeId, infoIds);
    }

    private void requireOwn(UserPrincipal user, Long codeId) {
        if (orgCodeMapper.countCode(user.getCompanyId(), codeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
