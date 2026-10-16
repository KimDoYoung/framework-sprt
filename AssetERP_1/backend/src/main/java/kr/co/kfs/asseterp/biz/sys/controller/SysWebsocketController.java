package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketAlarmReq;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketPersonRes;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketResultRes;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketTargetsReq;
import kr.co.kfs.asseterp.biz.sys.service.SysWebsocketService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 로그아웃 알림 관리 (AS-IS Sys86_Tab_Websocket) — sys admin만 */
@RestController
@RequestMapping("/api/v1/sys/websocket")
@RequiredArgsConstructor
public class SysWebsocketController {

    private final SysWebsocketService service;

    /** AS-IS emp.Emp01_Person.selectByLoginUserPaging: 접속 중인 사원 (companyId 없음 = 전체) */
    @GetMapping("/persons")
    public ApiResponse<PageRes<WebsocketPersonRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam(required = false) Long companyId,
                                                           @RequestParam(required = false) String searchText,
                                                           @RequestParam(defaultValue = "0") int offset,
                                                           @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(service.search(principal, companyId, searchText, offset, limit));
    }

    /** 고른 사원(personIds)에게 알림 — 접속 중이 아닌 사원은 offlineNames로 돌려준다 */
    @PostMapping("/alarms")
    public ApiResponse<WebsocketResultRes> sendAlarm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WebsocketAlarmReq req) {
        return ApiResponse.ok(service.sendAlarm(principal, req.personIds(), req.message()));
    }

    /** 접속한 모두에게 알림 */
    @PostMapping("/alarms/all")
    public ApiResponse<WebsocketResultRes> sendAlarmAll(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WebsocketAlarmReq req) {
        return ApiResponse.ok(service.sendAlarmAll(principal, req.message()));
    }

    /** 고른 사원 강제 로그아웃 */
    @PostMapping("/force-logouts")
    public ApiResponse<WebsocketResultRes> forceLogout(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WebsocketTargetsReq req) {
        return ApiResponse.ok(service.forceLogout(principal, req.personIds()));
    }

    /** 접속한 모든 사용자 강제 로그아웃 (요청한 관리자 자신 포함) */
    @PostMapping("/force-logouts/all")
    public ApiResponse<WebsocketResultRes> forceLogoutAll(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.forceLogoutAll(principal));
    }
}
