package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginHistoryRes;
import kr.co.kfs.asseterp.biz.sys.service.SysLoginHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 로그인내역 조회 (AS-IS Sys26_Tab_LoginHistory → server/sys/Sys26_Login) — 관리자 전용 */
@RestController
@RequestMapping("/api/v1/sys/login-histories")
@RequiredArgsConstructor
public class SysLoginHistoryController {

    private final SysLoginHistoryService sysLoginHistoryService;

    /** AS-IS sys.Sys26_Login.selectByLoginDate (companyId·loginMode '%' = 전체) */
    @GetMapping
    public ApiResponse<List<LoginHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                     @RequestParam(required = false) String companyId,
                                                     @RequestParam(required = false) String loginMode) {
        return ApiResponse.ok(sysLoginHistoryService.search(principal, startDate, closeDate, companyId, loginMode));
    }

    /** AS-IS sys.Sys26_Login.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(sysLoginHistoryService.delete(principal, ids));
    }
}
