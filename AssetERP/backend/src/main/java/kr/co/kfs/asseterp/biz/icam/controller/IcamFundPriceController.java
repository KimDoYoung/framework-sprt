package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.FundPricePrintReq;
import kr.co.kfs.asseterp.biz.icam.dto.FundPriceRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamFundPriceService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/icam/fund-prices")
@RequiredArgsConstructor
public class IcamFundPriceController {

    private final IcamFundPriceService service;

    /** AS-IS icam.Icam06_FundBook.selectIcamFundPrice (R05 펀드별 기준가 현황) */
    @GetMapping
    public ApiResponse<List<FundPriceRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.search(principal, stdDate));
    }

    /** AS-IS sys.Sys99_Print.insertRdFundPrice (R05 엑셀다운로드 RD) → 출력 그룹 ID */
    @PostMapping("/rd-download")
    public ApiResponse<String> rdDownload(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestBody FundPricePrintReq req) {
        return ApiResponse.ok(service.insertRdFundPrice(principal, req));
    }
}
