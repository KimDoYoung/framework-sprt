package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PasswordPersonRes;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysPasswordService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 비밀번호 초기화·잠금해제 (AS-IS Sys25_Tab_ResetPassword → sys.Sys25_Password, emp.Emp01_Person.updateLockYn). 로그인 회사 사원만 */
@RestController
@RequestMapping("/api/v1/sys/passwords")
@RequiredArgsConstructor
public class SysPasswordController {

    private final SysPasswordService sysPasswordService;

    @GetMapping("/persons")
    public ApiResponse<List<PasswordPersonRes>> searchPersons(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long personId) {
        return ApiResponse.ok(sysPasswordService.searchPersons(principal.getCompanyId(), personId));
    }

    @PutMapping("/persons/{personId}/unlock")
    public ApiResponse<Void> unlock(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        sysPasswordService.unlock(principal.getCompanyId(), personId);
        return ApiResponse.ok(null);
    }

    @PutMapping("/persons/{personId}/reset")
    public ApiResponse<Void> resetPassword(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        sysPasswordService.resetPassword(principal.getCompanyId(), personId);
        return ApiResponse.ok(null);
    }
}
