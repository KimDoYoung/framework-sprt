package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.CurrentFeeByFundPrintReq;
import kr.co.kfs.asseterp.biz.icam.dto.CurrentFeeByFundRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamCurrentFeeByFundService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/icam/current-fee-by-funds")
@RequiredArgsConstructor
public class IcamCurrentFeeByFundController {

    private final IcamCurrentFeeByFundService service;

    /** AS-IS icam.Icam10_Fee.getCurrentFeeByFund (R06 펀드별 발생보수현황 / 월별 펀드보수현황) */
    @GetMapping
    public ApiResponse<List<CurrentFeeByFundRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam String yearText,
                                                         @RequestParam(required = false) String preYearText) {
        return ApiResponse.ok(service.search(principal, yearText, preYearText));
    }

    /** AS-IS sys.Sys99_Print.insertRdCurrentFeeByFund (R06 엑셀다운로드 RD) → 출력 그룹 ID */
    @PostMapping("/rd-download")
    public ApiResponse<String> rdDownload(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestBody CurrentFeeByFundPrintReq req) {
        return ApiResponse.ok(service.insertRdCurrentFeeByFund(principal, req));
    }
}
