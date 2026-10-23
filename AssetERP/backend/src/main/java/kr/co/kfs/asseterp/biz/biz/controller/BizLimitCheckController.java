package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitCompanyYearRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitPersonDayRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitPersonYearRes;
import kr.co.kfs.asseterp.biz.biz.service.BizLimitCheckService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** 이익제공 한도초과현황 (AS-IS Biz01_Tab_LimitCheckList → server/biz/Biz01_Promo, L07). provideRcvType 비면 전체 */
@RestController
@RequestMapping("/api/v1/biz/limit-checks")
@RequiredArgsConstructor
public class BizLimitCheckController {

    private final BizLimitCheckService service;

    /** AS-IS biz.Biz01_Promo.selectByPersonDay — "인별 1회 초과건" 탭 */
    @GetMapping("/person-day")
    public ApiResponse<List<BizLimitPersonDayRes>> searchPersonDay(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yearText,
                                                                   @RequestParam(required = false) String provideRcvType) {
        return ApiResponse.ok(service.searchPersonDay(principal, yearText, provideRcvType));
    }

    /** AS-IS biz.Biz01_Promo.selectByPersonYear — "인별 연간 초과건" 탭 */
    @GetMapping("/person-year")
    public ApiResponse<List<BizLimitPersonYearRes>> searchPersonYear(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yearText,
                                                                     @RequestParam(required = false) String provideRcvType) {
        return ApiResponse.ok(service.searchPersonYear(principal, yearText, provideRcvType));
    }

    /** AS-IS biz.Biz01_Promo.selectByCompanyYear — "회사별 연간 초과건" 탭 */
    @GetMapping("/company-year")
    public ApiResponse<List<BizLimitCompanyYearRes>> searchCompanyYear(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yearText,
                                                                       @RequestParam(required = false) String provideRcvType) {
        return ApiResponse.ok(service.searchCompanyYear(principal, yearText, provideRcvType));
    }

    /** AS-IS ExcelDownload?actionCode=biz01List — 세 탭을 시트 3개로 한 파일("이익제공 한도초과현황(연도).xls") */
    @GetMapping("/excel")
    public ResponseEntity<byte[]> downloadExcel(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yearText,
                                                @RequestParam(required = false) String provideRcvType) {
        byte[] body = service.downloadExcel(principal, yearText, provideRcvType);
        String fileName = "이익제공 한도초과현황(" + yearText + ").xls";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(body);
    }
}
