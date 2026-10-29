package kr.co.kfs.asseterp.biz.att.controller;

import kr.co.kfs.asseterp.biz.att.dto.AttOvertimeReqRes;
import kr.co.kfs.asseterp.biz.att.dto.AttOvertimeReqUpdateReq;
import kr.co.kfs.asseterp.biz.att.service.AttOvertimeReqService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 연장근무관리 (AS-IS Att03_Tab_OvertimeReq #1486 → server/att/Att03_OvertimeReq·Att13_OvertimeReqHist) */
@RestController
@RequestMapping("/api/v1/att/overtime-reqs")
@RequiredArgsConstructor
public class AttOvertimeReqController {

    private final AttOvertimeReqService service;

    /** AS-IS att.Att03_OvertimeReq.getConfirmList */
    @GetMapping
    public ApiResponse<List<AttOvertimeReqRes>> getConfirmList(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getConfirmList(principal));
    }

    /** AS-IS att.Att13_OvertimeReqHist.updateInfo — 저장(confirmYn 없음) · 확정/확정취소(confirmYn true/false) */
    @PutMapping
    public ApiResponse<Integer> updateInfo(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AttOvertimeReqUpdateReq req) {
        return ApiResponse.ok(service.updateInfo(principal, req));
    }
}
