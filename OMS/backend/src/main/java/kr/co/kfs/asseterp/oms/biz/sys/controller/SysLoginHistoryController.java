package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginHistoryRes;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysLoginHistoryService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 로그인내역 조회 (AS-IS Sys26_Tab_LoginHistory → sys.Sys26_Login). 전 고객사 기록이라 KFS 관리자(SYSADMIN)만 */
@RestController
@RequestMapping("/api/v1/sys/login-histories")
@RequiredArgsConstructor
public class SysLoginHistoryController {

    private final SysLoginHistoryService sysLoginHistoryService;

    @GetMapping
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<LoginHistoryRes>> searchLoginHistories(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String loginMode) {
        return ApiResponse.ok(sysLoginHistoryService.searchLoginHistories(startDate, closeDate, companyId, loginMode));
    }
}
