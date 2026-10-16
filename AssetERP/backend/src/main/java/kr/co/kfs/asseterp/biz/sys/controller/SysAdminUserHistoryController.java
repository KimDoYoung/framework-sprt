package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserHistoryRes;
import kr.co.kfs.asseterp.biz.sys.service.SysAdminUserHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** Admin 로그인내역 조회 (AS-IS Sys81_Tab_AdminUserHistory → server/sys/Sys81_AdminUserHistory) */
@RestController
@RequestMapping("/api/v1/sys/admin-user-histories")
@RequiredArgsConstructor
public class SysAdminUserHistoryController {

    private final SysAdminUserHistoryService service;

    /** AS-IS sys.Sys81_AdminUserHistory.selectByDate */
    @GetMapping
    public ApiResponse<List<AdminUserHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate));
    }
}
