package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupMemberSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeGroupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 코드 그룹 (AS-IS Sys13_Lookup_CodeGroup·Sys13_TabPage_Code → server/sys/Sys13_CodeGroup) */
@RestController
@RequestMapping("/api/v1/sys/code-groups")
@RequiredArgsConstructor
public class SysCodeGroupController {

    private final SysCodeGroupService sysCodeGroupService;

    /** AS-IS sys.Sys13_CodeGroup.update → 저장된 헤더 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<CodeGroupRes>> updateGroups(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestBody List<CodeGroupSaveReq> rows) {
        return ApiResponse.ok(sysCodeGroupService.updateGroups(principal, rows));
    }

    /** AS-IS sys.Sys13_CodeGroup.deleteAll → 지운 그룹 수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteGroups(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestBody List<Long> codeGroupIds) {
        return ApiResponse.ok(sysCodeGroupService.deleteGroups(principal, codeGroupIds));
    }

    /** AS-IS sys.Sys13_CodeGroup.selectByKindGroupCode */
    @GetMapping("/members")
    public ApiResponse<List<CodeGroupRes>> searchMembers(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam String kindGroupCd,
                                                         @RequestParam Long codeKindId,
                                                         @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(sysCodeGroupService.searchMembers(principal, kindGroupCd, codeKindId, companyId));
    }

    /** AS-IS sys.Sys13_CodeGroup.insert → 넣은 건수 */
    @PostMapping("/members")
    public ApiResponse<Integer> insertMembers(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestBody List<CodeGroupMemberSaveReq> rows) {
        return ApiResponse.ok(sysCodeGroupService.insertMembers(principal, rows));
    }

    /** AS-IS sys.Sys13_CodeGroup.delete → 지운 건수 */
    @DeleteMapping("/members")
    public ApiResponse<Integer> deleteMembers(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestBody List<Long> codeGroupIds) {
        return ApiResponse.ok(sysCodeGroupService.deleteMembers(principal, codeGroupIds));
    }
}
