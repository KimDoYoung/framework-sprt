package kr.co.kfs.asseterp.biz.help.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.help.dto.HelpConfigRes;
import kr.co.kfs.asseterp.biz.help.service.HelpService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 온라인 도움말 (AS-IS user_manual.jsp, aman_opener.jsp) */
@RestController
@RequestMapping("/api/v1/help")
@RequiredArgsConstructor
public class HelpController {

    private final HelpService helpService;

    @GetMapping("/config")
    public ApiResponse<HelpConfigRes> getConfig() {
        return ApiResponse.ok(helpService.getConfig());
    }

    /** AS-IS aman_opener.jsp?aka= — 서명한 A-Man 주소 (화면은 window.open) */
    @GetMapping("/aman-url")
    public ApiResponse<String> getAmanUrl(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestParam(required = false) String aka, HttpServletRequest request) {
        return ApiResponse.ok(helpService.getAmanUrl(principal, aka, request.getRemoteAddr()));
    }
}
