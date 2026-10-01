package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysCodeGroupService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

/** 공통코드 그룹 (AS-IS sys.Sys13_CodeGroup). 조회는 누구나, 저장·삭제는 KFS 관리자 (AS-IS: 회사 0만 버튼 사용) */
@RestController
@RequestMapping("/api/v1/sys/code-groups")
@RequiredArgsConstructor
public class SysCodeGroupController {

    private final SysCodeGroupService sysCodeGroupService;

    @GetMapping
    public ApiResponse<List<CodeGroupRes>> searchGroups(@RequestParam Long codeKindId) {
        return ApiResponse.ok(sysCodeGroupService.searchGroups(codeKindId));
    }

    @PutMapping
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<CodeGroupRes>> updateGroups(@RequestBody List<CodeGroupSaveReq> rows) {
        return ApiResponse.ok(sysCodeGroupService.updateGroups(rows));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> deleteGroups(@RequestBody List<Long> codeGroupIds) {
        return ApiResponse.ok(sysCodeGroupService.deleteGroups(codeGroupIds));
    }

    @GetMapping("/codes")
    public ApiResponse<List<CodeGroupRes>> searchGroupCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam Long codeKindId,
                                                            @RequestParam String kindGroupCd,
                                                            @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(sysCodeGroupService.searchGroupCodes(principal, codeKindId, kindGroupCd, companyId));
    }

    @PostMapping("/codes")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<CodeGroupRes>> createGroupCodes(@RequestBody List<CodeGroupSaveReq> rows) {
        return ApiResponse.ok(sysCodeGroupService.createGroupCodes(rows));
    }

    @DeleteMapping("/codes")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> deleteGroupCodes(@RequestBody List<Long> codeGroupIds) {
        return ApiResponse.ok(sysCodeGroupService.deleteGroupCodes(codeGroupIds));
    }
}
