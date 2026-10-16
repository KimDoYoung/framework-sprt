package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureReq;
import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureRes;
import kr.co.kfs.asseterp.biz.sys.service.SysLoginSecureService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공인IP 등록/수정 (AS-IS Sys29_Lookup_PublicIpList → server/sys/Sys29_LoginSecure) */
@RestController
@RequestMapping("/api/v1/sys/companies/{companyId}/login-secures")
@RequiredArgsConstructor
public class SysLoginSecureController {

    private final SysLoginSecureService service;

    /** AS-IS sys.Sys29_LoginSecure.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<LoginSecureRes>> search(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId) {
        return ApiResponse.ok(service.searchLoginSecures(principal, companyId));
    }

    /** AS-IS sys.Sys29_LoginSecure.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<LoginSecureRes>> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                    @RequestBody List<LoginSecureReq> rows) {
        return ApiResponse.ok(service.updateLoginSecures(principal, companyId, rows));
    }

    /** AS-IS sys.Sys29_LoginSecure.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteLoginSecures(principal, companyId, ids));
    }
}
