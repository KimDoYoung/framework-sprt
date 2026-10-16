package kr.co.kfs.asseterp.biz.org.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoHistRes;
import kr.co.kfs.asseterp.biz.org.service.OrgInfoHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 조직정보 History (AS-IS Org02_Lookup_OrgInfo → server/org/Org02_Info) */
@RestController
@RequestMapping("/api/v1/org/org-codes/{codeId}")
@RequiredArgsConstructor
public class OrgInfoHistoryController {

    private final OrgInfoHistoryService orgInfoHistoryService;

    /** AS-IS org.Org02_Info.selectByOnlyOrgCodeId */
    @GetMapping("/infos")
    public ApiResponse<List<OrgInfoHistRes>> searchInfos(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long codeId) {
        return ApiResponse.ok(orgInfoHistoryService.searchInfos(principal, codeId));
    }

    /** AS-IS org.Org02_Info.delete (선택 이력) → 지운 건수 */
    @DeleteMapping("/infos")
    public ApiResponse<Integer> deleteInfos(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long codeId,
                                            @RequestBody List<Long> infoIds) {
        return ApiResponse.ok(orgInfoHistoryService.deleteInfos(principal, codeId, infoIds));
    }

    /** AS-IS org.Org02_Info.deleteCheck → 1 / -1(하위 조직) / -2(사원) */
    @GetMapping("/delete-check")
    public ApiResponse<Integer> deleteCheck(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long codeId) {
        return ApiResponse.ok(orgInfoHistoryService.deleteCheck(principal, codeId));
    }

    /** AS-IS org.Org02_Info.deleteOrg (조직 전체) */
    @DeleteMapping("/all")
    public ApiResponse<Integer> deleteOrg(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long codeId) {
        return ApiResponse.ok(orgInfoHistoryService.deleteOrg(principal, codeId));
    }
}
