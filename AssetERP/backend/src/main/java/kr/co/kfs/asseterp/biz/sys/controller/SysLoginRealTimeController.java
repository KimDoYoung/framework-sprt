package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginRealTimeRes;
import kr.co.kfs.asseterp.biz.sys.service.SysLoginRealTimeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
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
}
