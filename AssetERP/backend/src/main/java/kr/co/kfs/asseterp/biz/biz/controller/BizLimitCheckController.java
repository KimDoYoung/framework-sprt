package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitCheckReq;
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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** 이익제공 한도초과현황 (AS-IS Biz01_Tab_LimitCheckList → server/biz/Biz01_Promo, L07). 조건은 BizLimitCheckReq(yearText·provideRcvType·overCheck·limitCheck·limit1~3) */
@RestController
@RequestMapping("/api/v1/biz/limit-checks")
@RequiredArgsConstructor
public class BizLimitCheckController {

    private final BizLimitCheckService service;

    /** AS-IS biz.Biz01_Promo.selectByPersonDay — "인별 1회 초과건" 탭 */
    @GetMapping("/person-day")
    public ApiResponse<List<BizLimitPersonDayRes>> searchPersonDay(@AuthenticationPrincipal UserPrincipal principal, @ModelAttribute BizLimitCheckReq req) {
        return ApiResponse.ok(service.searchPersonDay(principal, req));
    }

    /** AS-IS biz.Biz01_Promo.selectByPersonYear — "인별 연간 초과건" 탭 */
    @GetMapping("/person-year")
    public ApiResponse<List<BizLimitPersonYearRes>> searchPersonYear(@AuthenticationPrincipal UserPrincipal principal, @ModelAttribute BizLimitCheckReq req) {
        return ApiResponse.ok(service.searchPersonYear(principal, req));
    }

    /** AS-IS biz.Biz01_Promo.selectByCompanyYear — "회사별 연간 초과건" 탭 */
    @GetMapping("/company-year")
    public ApiResponse<List<BizLimitCompanyYearRes>> searchCompanyYear(@AuthenticationPrincipal UserPrincipal principal, @ModelAttribute BizLimitCheckReq req) {
        return ApiResponse.ok(service.searchCompanyYear(principal, req));
    }

    /** AS-IS ExcelDownload?actionCode=biz01List — 세 탭을 시트 3개로 한 파일("이익제공 한도초과현황(연도).xls") */
    @GetMapping("/excel")
    public ResponseEntity<byte[]> downloadExcel(@AuthenticationPrincipal UserPrincipal principal, @ModelAttribute BizLimitCheckReq req) {
        byte[] body = service.downloadExcel(principal, req);
        String fileName = "이익제공 한도초과현황(" + req.yearText() + ").xls";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(body);
    }
}
