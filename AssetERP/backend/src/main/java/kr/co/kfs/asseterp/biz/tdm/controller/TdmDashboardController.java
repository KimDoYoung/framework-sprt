package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardChckOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardCheckEndRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardMyOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardProgressRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardUndoneRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmDashboardService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무점검 현황 (AS-IS Tdm50_Tab_TotalDashboard: 총괄 Tdm50_Tab_Dashboard · 임원별 Tdm50_Tab_DashboardExct · 부서별 Tdm50_Tab_DashboardOrg) */
@RestController
@RequestMapping("/api/v1/tdm/dashboard")
@RequiredArgsConstructor
public class TdmDashboardController {

    private final TdmDashboardService service;

    /** AS-IS tdm.Tdm50_ChckJob.selectRcntChckJob — 진행 중인 가장 최근 점검년월(yyyy.MM), 없으면 null */
    @GetMapping("/recent-check-ym")
    public ApiResponse<String> getRecentCheckYm(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getRecentCheckYm(principal));
    }

    /** AS-IS tdm.Tdm50_ChckJob.selectByCheckYm — 마감 정보, 점검 작업이 없으면 null */
    @GetMapping("/check-end")
    public ApiResponse<DashboardCheckEndRes> getCheckEnd(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam String checkYm) {
        return ApiResponse.ok(service.getCheckEnd(principal, checkYm));
    }

    /** AS-IS tdm.Tdm51_ChckOrg.selectDashboardProgress */
    @GetMapping("/progress")
    public ApiResponse<DashboardProgressRes> getProgress(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam String checkYm, @RequestParam String stdDate,
                                                         @RequestParam String statusType,
                                                         @RequestParam(required = false) Long exctId,
                                                         @RequestParam(required = false) Long orgId) {
        return ApiResponse.ok(service.getProgress(principal, checkYm, stdDate, statusType, exctId, orgId));
    }

    /** AS-IS tdm.Tdm51_ChckOrg.selectDashboardExct */
    @GetMapping("/exct-progress")
    public ApiResponse<List<DashboardChckOrgRes>> searchExctProgress(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @RequestParam String checkYm, @RequestParam String statusType,
                                                                     @RequestParam(required = false) Long exctId) {
        return ApiResponse.ok(service.searchExctProgress(principal, checkYm, statusType, exctId));
    }

    /** AS-IS tdm.Tdm51_ChckOrg.selectDashboardOrg */
    @GetMapping("/org-progress")
    public ApiResponse<List<DashboardChckOrgRes>> searchOrgProgress(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam String checkYm, @RequestParam String statusType,
                                                                    @RequestParam(required = false) Long exctId) {
        return ApiResponse.ok(service.searchOrgProgress(principal, checkYm, statusType, exctId));
    }

    /** AS-IS tdm.Tdm52_ChckManl.selectDashboardUndone (retrieveType 1:미점검 / 2:반려 / 3:당월발생 미흡 — orgId가 있을 때) */
    @GetMapping("/undone")
    public ApiResponse<List<DashboardUndoneRes>> searchUndone(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam String checkYm,
                                                              @RequestParam(required = false) String statusType,
                                                              @RequestParam(required = false) Long exctId,
                                                              @RequestParam(required = false) Long orgId,
                                                              @RequestParam(required = false) String retrieveType) {
        return ApiResponse.ok(service.searchUndone(principal, checkYm, statusType, exctId, orgId, retrieveType));
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.selectDashboardInsuff — AS-IS 서버처럼 orgId는 받지 않는다 */
    @GetMapping("/insuff")
    public ApiResponse<List<DashboardInsuffRes>> searchInsuff(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam String checkYm,
                                                              @RequestParam(required = false) Long exctId) {
        return ApiResponse.ok(service.searchInsuff(principal, checkYm, exctId));
    }

    /** AS-IS tdm.Tdm08_ManagerInfo.checkIsManager — 책무담당자·책무관리자 여부 */
    @GetMapping("/is-manager")
    public ApiResponse<Boolean> isManager(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.isManager(principal, stdDate));
    }

    /** AS-IS tdm.Tdm30_RoleAllc.selectByExctId(exctId = 로그인 사용자) — 내가 임원(직책 배정 있음)인가 */
    @GetMapping("/role-allc-exists")
    public ApiResponse<Boolean> hasRoleAllc(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.hasRoleAllc(principal, stdDate));
    }

    /** AS-IS LoginUser의 조직 — 회사관리자 등 발령이 없으면 null */
    @GetMapping("/my-org")
    public ApiResponse<DashboardMyOrgRes> getMyOrg(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getMyOrg(principal));
    }
}
