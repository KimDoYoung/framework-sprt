package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FilePolicyRes;
import kr.co.kfs.asseterp.biz.sys.dto.FilePolicySaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysFilePolicyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 파일보안정책 (AS-IS Sys60_Tab_FilePolicy → server/sys/Sys60_FilePolicy) — 메뉴 #1500 */
@RestController
@RequestMapping("/api/v1/sys/file-policies")
@RequiredArgsConstructor
public class SysFilePolicyController {

    private final SysFilePolicyService service;

    /** AS-IS sys.Sys60_FilePolicy.selectByText */
    @GetMapping
    public ApiResponse<List<FilePolicyRes>> search(@RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(searchText));
    }

    /** AS-IS sys.Sys60_FilePolicy.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<FilePolicyRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<FilePolicySaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys60_FilePolicy.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
