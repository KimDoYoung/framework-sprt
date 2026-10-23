package kr.co.kfs.asseterp.biz.rd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlReq;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlRes;
import kr.co.kfs.asseterp.biz.rd.service.RdService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** RD 호출 주소 발급 (AS-IS RDUtil → 서버). 브라우저는 받은 주소로 RD 서버에 직접 접속한다 */
@RestController
@RequestMapping("/api/v1/rd")
@RequiredArgsConstructor
public class RdController {

    private final RdService service;

    @PostMapping("/urls")
    public ApiResponse<RdUrlRes> buildUrl(@AuthenticationPrincipal UserPrincipal principal, @RequestBody RdUrlReq req) {
        return ApiResponse.ok(service.buildUrl(principal, req));
    }
}
