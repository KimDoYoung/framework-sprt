package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.PasswordPersonRes;
import kr.co.kfs.asseterp.biz.sys.service.SysPasswordService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 비밀번호 초기화 (AS-IS Sys25_Tab_ResetPassword → Emp03_Trans·Emp01_Person·Sys25_Password) */
@RestController
@RequestMapping("/api/v1/sys/passwords")
@RequiredArgsConstructor
public class SysPasswordController {

    private final SysPasswordService service;

    /** AS-IS emp.Emp03_Trans.selectByGrade / selectByPasswordPersonId (personId 없음 = 전체) */
    @GetMapping("/persons")
    public ApiResponse<List<PasswordPersonRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(required = false) Long personId) {
        return ApiResponse.ok(service.search(principal, personId));
    }

    /** AS-IS emp.Emp01_Person.updateLockYn(lockYn = false): 잠금해제 */
    @PutMapping("/persons/{personId}/unlock")
    public ApiResponse<Void> unlock(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        service.unlock(principal, personId);
        return ApiResponse.ok(null);
    }

    /** AS-IS sys.Sys25_Password.insert(password = null): 비밀번호 초기화 */
    @PostMapping("/persons/{personId}/reset")
    public ApiResponse<Void> reset(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        service.resetPassword(principal, personId);
        return ApiResponse.ok(null);
    }
}
