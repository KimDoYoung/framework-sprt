package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardChckOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardCheckEndRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardMyOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardProgressRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardUndoneRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmDashboardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 책무점검 현황 대시보드 (AS-IS Tdm50_Tab_TotalDashboard → server/tdm/Tdm50_ChckJob·Tdm51_ChckOrg·Tdm52_ChckManl·Tdm54_ChckInsuff·Tdm08_ManagerInfo·Tdm30_RoleAllc). 모두 조회 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmDashboardService {

    private final TdmDashboardMapper mapper;

    /** AS-IS Tdm50_ChckJob.selectRcntChckJob — 없으면 null (화면은 현재월을 그대로 둔다) */
    public String getRecentCheckYm(UserPrincipal user) {
        return mapper.selectRcntCheckYm(user.getCompanyId());
    }

    /** AS-IS Tdm50_ChckJob.selectByCheckYm — 결과가 정확히 1행일 때만 마감 문구를 만든다(화면 쪽 규칙), 아니면 null */
    public DashboardCheckEndRes getCheckEnd(UserPrincipal user, String checkYm) {
        List<DashboardCheckEndRes> list = mapper.selectByCheckYm(user.getCompanyId(), checkYm);
        return list.size() == 1 ? list.get(0) : null;
    }

    /** AS-IS Tdm51_ChckOrg.selectDashboardProgress — 집계라 항상 1행 */
    public DashboardProgressRes getProgress(UserPrincipal user, String checkYm, String stdDate, String statusType, Long exctId, Long orgId) {
        List<DashboardProgressRes> list = mapper.selectDashboardProgress(user.getCompanyId(), checkYm, stdDate, statusType, exctId, orgId);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<DashboardChckOrgRes> searchExctProgress(UserPrincipal user, String checkYm, String statusType, Long exctId) {
        return mapper.selectDashboardExct(user.getCompanyId(), checkYm, statusType, exctId);
    }

    public List<DashboardChckOrgRes> searchOrgProgress(UserPrincipal user, String checkYm, String statusType, Long exctId) {
        return mapper.selectDashboardOrg(user.getCompanyId(), checkYm, statusType, exctId);
    }

    public List<DashboardUndoneRes> searchUndone(UserPrincipal user, String checkYm, String statusType, Long exctId, Long orgId, String retrieveType) {
        return mapper.selectDashboardUndone(user.getCompanyId(), checkYm, statusType, exctId, orgId, retrieveType);
    }

    public List<DashboardInsuffRes> searchInsuff(UserPrincipal user, String checkYm, Long exctId) {
        return mapper.selectDashboardInsuff(user.getCompanyId(), checkYm, exctId);
    }

    /** AS-IS Tdm08_ManagerInfo.checkIsManager — 건수가 0이면 -1(아님), 아니면 1 */
    public boolean isManager(UserPrincipal user, String stdDate) {
        return mapper.checkIsManager(user.getCompanyId(), user.getUserId(), stdDate) > 0;
    }

    /** AS-IS Tdm30_RoleAllc.selectByExctId(exctId = 로그인 사용자) — 행이 있으면 임원 */
    public boolean hasRoleAllc(UserPrincipal user, String stdDate) {
        return mapper.countRoleAllcByExctId(user.getCompanyId(), stdDate, user.getUserId()) > 0;
    }

    /** 로그인 사용자의 조직. 회사관리자(userId < 0)나 발령이 없으면 null */
    public DashboardMyOrgRes getMyOrg(UserPrincipal user) {
        return user.getUserId() == null || user.getUserId() < 0 ? null : mapper.selectMyOrg(user.getCompanyId(), user.getUserId());
    }
}
