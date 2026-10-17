package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamTestBatchReq;
import kr.co.kfs.asseterp.biz.icam.service.IcamTestService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 작업용 (AS-IS Icam99_Tab_Test) — 메뉴 #1097 */
@RestController
@RequestMapping("/api/v1/icam/test")
@RequiredArgsConstructor
public class IcamTestController {

    private final IcamTestService service;

    /** AS-IS BatchMain(actionCode=…): 작업 버튼 — 서버에 BatchMain 연동이 없어 거절 */
    @PostMapping("/batch")
    public ApiResponse<Void> runBatch(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamTestBatchReq req) {
        service.runBatch(principal, req);
        return ApiResponse.ok(null);
    }
}
