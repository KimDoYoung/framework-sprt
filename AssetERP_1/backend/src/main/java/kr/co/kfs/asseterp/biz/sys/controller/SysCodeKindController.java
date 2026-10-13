package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeCopyReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeGroupService;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeKindService;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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

/** 시스템 공통코드 관리 (AS-IS Sys08_Tab_CodeKindAdmin → server/sys/Sys08_CodeKind) */
@RestController
@RequestMapping("/api/v1/sys/code-kinds")
@RequiredArgsConstructor
public class SysCodeKindController {

    private final SysCodeKindService sysCodeKindService;
    private final SysCodeService sysCodeService;
    private final SysCodeGroupService sysCodeGroupService;

    /** AS-IS sys.Sys08_CodeKind.selectByKindName */
    @GetMapping
    public ApiResponse<List<CodeKindRes>> searchCodeKinds(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(required = false) String kindName,
                                                          @RequestParam(required = false) String sysYn) {
        return ApiResponse.ok(sysCodeKindService.searchCodeKinds(principal, kindName, sysYn));
    }

    /** AS-IS sys.Sys08_CodeKind.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<CodeKindRes>> updateCodeKinds(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestBody List<CodeKindSaveReq> rows) {
        return ApiResponse.ok(sysCodeKindService.updateCodeKinds(principal, rows));
    }

    /** AS-IS sys.Sys08_CodeKind.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteCodeKinds(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestBody List<Long> codeKindIds) {
        return ApiResponse.ok(sysCodeKindService.deleteCodeKinds(principal, codeKindIds));
    }

    /** AS-IS sys.Sys09_Code.selectByCodeKindId (Sys09_Grid_Code·Sys09_Lookup_CodeKind) */
    @GetMapping("/{codeKindId}/codes")
    public ApiResponse<List<CodeAdminRes>> searchCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable Long codeKindId,
                                                       @RequestParam(required = false) Long companyId,
                                                       @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(sysCodeService.searchCodesByKindId(principal, codeKindId, companyId, searchText));
    }

    /** AS-IS sys.Sys09_Code.codeInsert (A14 Sys08_Tab_CodeKindClient 코드복사) → 복사한 행 수 */
    @PostMapping("/{codeKindId}/codes/copy")
    public ApiResponse<Integer> copyCodes(@AuthenticationPrincipal UserPrincipal principal,
                                          @PathVariable Long codeKindId,
                                          @RequestBody CodeCopyReq req) {
        return ApiResponse.ok(sysCodeService.copyCodes(principal, codeKindId, req));
    }

    /** AS-IS sys.Sys13_CodeGroup.selectByGroupCodeKind (Sys13_Lookup_CodeGroup) */
    @GetMapping("/{codeKindId}/code-groups")
    public ApiResponse<List<CodeGroupRes>> searchGroups(@AuthenticationPrincipal UserPrincipal principal,
                                                        @PathVariable Long codeKindId) {
        return ApiResponse.ok(sysCodeGroupService.searchGroups(principal, codeKindId));
    }
}
