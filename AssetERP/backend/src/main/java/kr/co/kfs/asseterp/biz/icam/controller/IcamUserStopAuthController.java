package kr.co.kfs.asseterp.biz.icam.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthBatchReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthSaveReq;
import kr.co.kfs.asseterp.biz.icam.service.IcamUserStopAuthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 미사용ID 기록관리 (AS-IS Icam55_Tab_UserStopAuth, 메뉴 #1317) */
@RestController
@RequestMapping("/api/v1/icam/users/stop-auths")
@RequiredArgsConstructor
public class IcamUserStopAuthController {

    private final IcamUserStopAuthService service;

    /** AS-IS icam.Icam55_IcamUser.selectByProcStateCode */
    @GetMapping
    public ApiResponse<List<IcamStopAuthRes>> search(@RequestParam(required = false) String searchText,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                     @RequestParam(defaultValue = "false") boolean delTarget) {
        return ApiResponse.ok(service.search(searchText, startDate, closeDate, delTarget));
    }

    /** AS-IS icam.Icam55_IcamUser.updateMultiAuth (선택내역 일괄반영) */
    @PutMapping("/batch")
    public ApiResponse<Void> updateBatch(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamStopAuthBatchReq req) {
        service.updateBatch(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS icam.Icam55_IcamUser.updateEachAuth ([변경] 창) */
    @PutMapping("/{icamUserId}")
    public ApiResponse<Void> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long icamUserId,
                                    @RequestBody IcamStopAuthSaveReq req) {
        service.update(principal, icamUserId, req);
        return ApiResponse.ok(null);
    }
}
