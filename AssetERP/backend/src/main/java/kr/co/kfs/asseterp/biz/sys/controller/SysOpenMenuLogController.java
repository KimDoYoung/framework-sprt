package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.OpenMenuLogRes;
import kr.co.kfs.asseterp.biz.sys.service.SysOpenMenuLogService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 고객별 매뉴 열람 로그 (AS-IS Sys96_Tab_OpenMenuLogAdmin → server/sys/Sys96_OpenMenuLog) */
@RestController
@RequestMapping("/api/v1/sys/open-menu-logs")
@RequiredArgsConstructor
public class SysOpenMenuLogController {

    private final SysOpenMenuLogService sysOpenMenuLogService;

    /** AS-IS sys.Sys96_OpenMenuLog.selectByTextAdminPaging — 페이지 행 + 전체 건수 (sys admin만) */
    @GetMapping
    public ApiResponse<PageRes<OpenMenuLogRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(required = false) Long companyId,
                                                       @RequestParam(required = false) String searchText,
                                                       @RequestParam(required = false) String className,
                                                       @RequestParam(defaultValue = "false") boolean useYn,
                                                       @RequestParam(defaultValue = "0") int offset,
                                                       @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(sysOpenMenuLogService.search(principal, companyId, searchText, className, useYn, offset, limit));
    }
}
