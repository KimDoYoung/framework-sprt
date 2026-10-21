package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.CeoAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoReportPersonRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoTrRes;
import kr.co.kfs.asseterp.biz.flt.service.FltCeoReportService;
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

/**
 * 책임자보고 (AS-IS Flt10_Tab_CeoReport → server/flt/Flt03_Account·Flt10_Tr·Apr01_Appr) — 준감인.
 * stdDate = 기준월 말일, startDate = 기준월 1일, transCode = 000 전체 / 100 재직 / 900 퇴직
 */
@RestController
@RequestMapping("/api/v1/flt/ceo-reports")
@RequiredArgsConstructor
public class FltCeoReportController {

    private final FltCeoReportService service;

    /** AS-IS flt.Flt03_Account.selectByStdDate — 임직원계좌신고내역 탭 */
    @GetMapping("/accounts")
    public ApiResponse<List<CeoAccountRes>> searchAccounts(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam String stdDate, @RequestParam String startDate,
                                                           @RequestParam String transCode) {
        return ApiResponse.ok(service.searchAccounts(principal, stdDate, startDate, transCode));
    }

    /** AS-IS flt.Flt10_Tr.selectByStdDate — 매월신고대상임직원 탭 */
    @GetMapping("/report-persons")
    public ApiResponse<List<CeoReportPersonRes>> searchReportPersons(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @RequestParam String stdDate, @RequestParam String startDate,
                                                                     @RequestParam String transCode) {
        return ApiResponse.ok(service.searchReportPersons(principal, stdDate, startDate, transCode));
    }

    /** AS-IS flt.Flt10_Tr.selectByStdDate2 — 임직원매매명세 탭 */
    @GetMapping("/trs")
    public ApiResponse<List<CeoTrRes>> searchTrs(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam String stdDate, @RequestParam String startDate,
                                                 @RequestParam String transCode) {
        return ApiResponse.ok(service.searchTrs(principal, stdDate, startDate, transCode));
    }

    /** AS-IS apr.Apr01_Appr.selectByLinkCode(A72) — 기준월 상신 문서(상신상태 칸) */
    @GetMapping("/apprs")
    public ApiResponse<List<CeoApprRes>> searchApprs(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam String startDate) {
        return ApiResponse.ok(service.searchApprs(principal, startDate));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdCeoReport + RD 리포트 Flt10_Rd_CeoReport → 시트 3개 xlsx) */
    @GetMapping("/excel")
    public ResponseEntity<byte[]> download(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam String stdDate, @RequestParam String startDate,
                                           @RequestParam String transCode, @RequestParam(required = false) String fileName) {
        byte[] body = service.download(principal, stdDate, startDate, transCode);
        String name = (fileName == null || fileName.isBlank() ? "임직원 금융투자상품 매매명세 보고(" + startDate + ")" : fileName) + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(name, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }
}
