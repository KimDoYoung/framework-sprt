package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyChangeOrgReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyGroupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyOrgAssignReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyRegRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyTaskOrgRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlDutyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 매뉴얼 부서지정(AS-IS Tdm41_Tab_ManlDutyOrg, N16) → server/tdm/Tdm41_ManlDuty·Tdm42_ManlOrg·Tdm44_ManlDutyOrg */
@RestController
@RequestMapping("/api/v1/tdm/manl-duties")
@RequiredArgsConstructor
public class TdmManlDutyController {

    private final TdmManlDutyService service;

    /** AS-IS tdm.Tdm41_ManlDuty.groupByManlJobId */
    @GetMapping("/groups")
    public ApiResponse<List<ManlDutyGroupRes>> groups(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlJobId,
                                                      @RequestParam(required = false) Long roleId, @RequestParam(required = false) Long taskId) {
        return ApiResponse.ok(service.groups(principal, manlJobId, roleId, taskId));
    }

    /** AS-IS tdm.Tdm41_ManlDuty.selectByTextPaging (+Total) */
    @GetMapping
    public ApiResponse<PageRes<ManlDutyRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlJobId,
                                                    @RequestParam(required = false) Long roleId, @RequestParam(required = false) Long taskId,
                                                    @RequestParam(defaultValue = "false") boolean unRegYn,
                                                    @RequestParam(required = false) String searchText,
                                                    @RequestParam(defaultValue = "0") long offset, @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.search(principal, manlJobId, roleId, taskId, unRegYn, searchText, offset, limit));
    }

    /** AS-IS tdm.Tdm41_ManlDuty.selectByOrgIdPaging (+Total) — 매뉴얼(점검항목) 작성(N17) 위 그리드 */
    @GetMapping("/by-org")
    public ApiResponse<PageRes<ManlDutyRegRes>> searchByOrg(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlJobId,
                                                            @RequestParam(required = false) Long roleId, @RequestParam(required = false) Long taskId,
                                                            @RequestParam(required = false) Long orgId, @RequestParam(required = false) String searchText,
                                                            @RequestParam(defaultValue = "0") long offset, @RequestParam(defaultValue = "50") long limit) {
        return ApiResponse.ok(service.searchByOrg(principal, manlJobId, roleId, taskId, orgId, searchText, offset, limit));
    }

    /** AS-IS tdm.Tdm41_ManlDuty.updateEndYn — endYn true = 작성완료, false = 작성취소 */
    @PutMapping("/{manlDutyId}/end")
    public ApiResponse<Void> updateEnd(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlDutyId,
                                       @RequestParam Long manlOrgId, @RequestParam Long orgId, @RequestParam boolean endYn) {
        service.updateEnd(principal, manlDutyId, manlOrgId, orgId, endYn);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm41_ManlDuty.selectTaskAndOrg */
    @GetMapping("/task-orgs")
    public ApiResponse<List<ManlDutyTaskOrgRes>> taskOrgs(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlJobId, @RequestParam Long roleId) {
        return ApiResponse.ok(service.taskOrgs(principal, manlJobId, roleId));
    }

    /** AS-IS tdm.Tdm44_ManlDutyOrg.insert (부서 일괄지정) */
    @PostMapping("/orgs")
    public ApiResponse<Void> assignOrgs(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlDutyOrgAssignReq req) {
        service.assignOrgs(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm41_ManlDuty.changeOrgId2 (부서변경) */
    @PostMapping("/change-org")
    public ApiResponse<Void> changeOrg(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlDutyChangeOrgReq req) {
        service.changeOrg(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm42_ManlOrg.confirmChk(I) + insertManlOrg (확정) */
    @PostMapping("/confirm")
    public ApiResponse<Void> confirm(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlJobId) {
        service.confirm(principal, manlJobId);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm42_ManlOrg.confirmChk(D) + deleteByManlJobId (확정취소) */
    @DeleteMapping("/confirm")
    public ApiResponse<Void> cancel(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlJobId) {
        service.cancel(principal, manlJobId);
        return ApiResponse.ok(null);
    }
}
