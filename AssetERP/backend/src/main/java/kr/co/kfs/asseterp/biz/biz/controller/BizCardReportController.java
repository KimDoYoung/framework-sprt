package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportPrintRes;
import kr.co.kfs.asseterp.biz.biz.service.BizCardReportService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 법인카드 현황 (AS-IS Biz01_Tab_CardReport → server/sys/Sys99_Print.insertCardReport·2·3) */
@RestController
@RequestMapping("/api/v1/biz/card-reports")
@RequiredArgsConstructor
public class BizCardReportController {

    private final BizCardReportService service;

    /** 세 보고서의 RD 출력 자료를 만들고 그룹 ID를 돌려준다 (내 이전 자료는 지운다) */
    @PostMapping("/rd-print")
    public ApiResponse<BizCardReportPrintRes> print(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizCardReportPrintReq req) {
        return ApiResponse.ok(service.print(principal, req));
    }
}
