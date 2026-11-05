package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginRealTimeRes;
import kr.co.kfs.asseterp.biz.sys.service.SysLoginRealTimeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 실시간 접속현황 창 (AS-IS Sys28_Lookup_LoginRealTime, EE58) */
@RestController
@RequestMapping("/api/v1/sys/login-real-times")
@RequiredArgsConstructor
public class SysLoginRealTimeController {

    private final SysLoginRealTimeService service;

    /** AS-IS sys.Sys28_LoginRealTime.selectByDate */
    @GetMapping
    public ApiResponse<List<LoginRealTimeRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS sys.Sys28_LoginRealTime.updateIpAddress — IP는 요청에서 (AS-IS LoginUser.getIpAddress = 서버가 본 접속 IP) */
    @PostMapping
    public ApiResponse<Void> updateIpAddress(@AuthenticationPrincipal UserPrincipal principal, HttpServletRequest request) {
        service.updateIpAddress(principal, request.getRemoteAddr());
        return ApiResponse.ok(null);
    }
}
