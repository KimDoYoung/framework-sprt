package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CorpAccountRes;
import kr.co.kfs.asseterp.biz.sys.dto.CorpAccountSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CorpRes;
import kr.co.kfs.asseterp.biz.sys.dto.CorpSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCorpAccountService;
import kr.co.kfs.asseterp.biz.sys.service.SysCorpService;
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

/** 거래처 등록·관리 (AS-IS Sys15_Tab_Corp → server/sys/Sys15_Corp, Sys17_CorpAccount) */
@RestController
@RequestMapping("/api/v1/sys/corps")
@RequiredArgsConstructor
public class SysCorpController {

    private final SysCorpService service;
    private final SysCorpAccountService accountService;

    /** AS-IS sys.Sys15_Corp.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<CorpRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam(required = false) String corpType,
                                             @RequestParam(required = false) String searchText,
                                             @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.search(principal, corpType, searchText, useYn));
    }

    /** AS-IS sys.Sys15_Corp.selectByUseYn (거래처 조회창 Sys15_Lookup_Corp) */
    @GetMapping("/lookup")
    public ApiResponse<List<CorpRes>> lookup(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam(required = false) String corpType,
                                             @RequestParam(required = false) String searchText,
                                             @RequestParam(defaultValue = "false") boolean empYn) {
        return ApiResponse.ok(service.lookup(principal, corpType, searchText, empYn));
    }

    /** AS-IS sys.Sys15_Corp.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<CorpRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CorpSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys15_Corp.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS sys.Sys15_Corp.insertInitData — 관리자 회사만 */
    @PostMapping("/init-data")
    public ApiResponse<Integer> insertInitData(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(service.insertInitData(principal, companyId));
    }

    /** AS-IS sys.Sys17_CorpAccount.selectByCorpId */
    @GetMapping("/{corpId}/accounts")
    public ApiResponse<List<CorpAccountRes>> searchAccounts(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long corpId) {
        return ApiResponse.ok(accountService.search(principal, corpId));
    }

    /** AS-IS sys.Sys17_CorpAccount.update → 저장된 행(요청 순서) */
    @PutMapping("/{corpId}/accounts")
    public ApiResponse<List<CorpAccountRes>> updateAccounts(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long corpId,
                                                            @RequestBody List<CorpAccountSaveReq> rows) {
        return ApiResponse.ok(accountService.update(principal, corpId, rows));
    }

    /** AS-IS sys.Sys17_CorpAccount.delete → 지운 건수 */
    @DeleteMapping("/{corpId}/accounts")
    public ApiResponse<Integer> deleteAccounts(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long corpId,
                                               @RequestBody List<Long> ids) {
        return ApiResponse.ok(accountService.delete(principal, corpId, ids));
    }
}
