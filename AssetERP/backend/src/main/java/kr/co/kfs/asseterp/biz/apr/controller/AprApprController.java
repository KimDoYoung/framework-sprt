package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateFundRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 상신문서 (AS-IS server/apr/Apr01_Appr) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprApprController {

    private final AprApprService service;

    /** AS-IS apr.Apr01_Appr.selectByPaging (Dcr01_Tab_DcrWrite 문서작성 목록, 페이징) */
    @GetMapping("/dcr-write")
    public ApiResponse<PageRes<AprDcrWriteRes>> searchDcrWrite(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                               @RequestParam(defaultValue = "") String searchText,
                                                               @RequestParam(defaultValue = "") String receiveName,
                                                               @RequestParam(required = false) Long classTreeId,
                                                               @RequestParam(defaultValue = "0") long offset,
                                                               @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchDcrWrite(principal, startDate, closeDate, searchText, receiveName, classTreeId, offset, limit));
    }

    /** AS-IS apr.Apr01_Appr.selectByClassTreeId2 (Apr01_Grid_DocList, F02 업무별 문서작성 목록) */
    @GetMapping("/doc-list")
    public ApiResponse<List<AprDocRes>> searchDocList(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam Long classTreeId,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                      @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchDocList(principal, classTreeId, startDate, endDate, searchText));
    }

    /** AS-IS apr.Apr01_Appr.selectByText2 (Dcr00_Tab_DocList, F05 통합 문서검색). 검색어·수신처는 서버가 %…%로, 상태·문서구분은 비면 전체 */
    @GetMapping("/search")
    public ApiResponse<List<AprDocSearchRes>> searchDocText(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(required = false) Long classTreeId,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                            @RequestParam(defaultValue = "") String searchText,
                                                            @RequestParam(defaultValue = "") String receiveName,
                                                            @RequestParam(required = false) String statusCode,
                                                            @RequestParam(required = false) String inoutCode) {
        return ApiResponse.ok(service.searchDocText(principal, classTreeId, startDate, endDate, searchText, receiveName, statusCode, inoutCode));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdDocList + RD 리포트 Dcr00_Rd_DocList → 조회 결과 xlsx) */
    @GetMapping("/search/excel")
    public ResponseEntity<byte[]> downloadDocText(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) Long classTreeId,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                  @RequestParam(defaultValue = "") String searchText,
                                                  @RequestParam(defaultValue = "") String receiveName,
                                                  @RequestParam(required = false) String statusCode,
                                                  @RequestParam(required = false) String inoutCode) {
        byte[] body = service.downloadDocText(principal, classTreeId, startDate, endDate, searchText, receiveName, statusCode, inoutCode);
        String fileName = "통합 문서검색(" + startDate + " ~ " + endDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS apr.Apr03_RelateFund.selectByIcsClassTreeId (Ics01_Grid_ApprList, F03 법규별 문서작성 목록) */
    @GetMapping("/ics-list")
    public ApiResponse<List<AprIcsDocRes>> searchIcsDocList(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam Long classTreeId,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                            @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchIcsDocList(principal, classTreeId, startDate, endDate, searchText));
    }

    /** AS-IS apr.Apr03_RelateFund.selectByApprId (Apr03_TabPage_Relate 연관펀드) */
    @GetMapping("/{apprId}/relate-funds")
    public ApiResponse<List<AprRelateFundRes>> searchRelateFunds(@PathVariable Long apprId) {
        return ApiResponse.ok(service.searchRelateFunds(apprId));
    }

    /** AS-IS apr.Apr12_RelateAdv.selectByApprId (Apr03_TabPage_Relate 연관일임) */
    @GetMapping("/{apprId}/relate-advs")
    public ApiResponse<List<AprRelateAdvRes>> searchRelateAdvs(@PathVariable Long apprId) {
        return ApiResponse.ok(service.searchRelateAdvs(apprId));
    }
}
