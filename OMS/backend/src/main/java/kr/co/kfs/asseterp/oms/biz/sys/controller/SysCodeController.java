package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeCopyReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysCodeService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;

/** 공통코드 (AS-IS sys.Sys09_Code) */
@RestController
@RequestMapping("/api/v1/sys/codes")
@RequiredArgsConstructor
public class SysCodeController {

    private final SysCodeService sysCodeService;

    /** companyId는 KFS 관리자만 쓸 수 있다 (그 외는 로그인 회사) */
    @GetMapping
    public ApiResponse<List<CodeRes>> searchCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam Long codeKindId,
                                                  @RequestParam(required = false) Long companyId,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(sysCodeService.searchCodes(principal, codeKindId, companyId, searchText));
    }

    /** 콤보용: 코드종류 코드값(kindCd, 예: OrgLevelCode)의 기준일 유효 코드 */
    @GetMapping("/by-kind")
    public ApiResponse<List<CodeRes>> searchCodesByKind(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam String kindCd,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate applyDate) {
        return ApiResponse.ok(sysCodeService.searchCodesByKind(principal, kindCd, applyDate));
    }

    @PutMapping
    public ApiResponse<List<CodeRes>> updateCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestBody List<CodeSaveReq> rows) {
        return ApiResponse.ok(sysCodeService.updateCodes(principal, rows));
    }

    @DeleteMapping
    public ApiResponse<Integer> deleteCodes(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestBody List<Long> codeIds) {
        return ApiResponse.ok(sysCodeService.deleteCodes(principal, codeIds));
    }

    /** 코드복사: 원본 회사의 코드종류 코드를 고른 회사들로 (AS-IS codeInsert) */
    @PostMapping("/copy")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> copyCodes(@RequestBody CodeCopyReq req) {
        return ApiResponse.ok(sysCodeService.copyCodes(req));
    }
}
