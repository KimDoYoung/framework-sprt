package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.*;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeChargeExcelService;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeChargePdfService;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeChargeService;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/** 최저보수 청구 (AS-IS server/biz/Biz20_FeeCharge · Biz22_FeeChargeCalc — 화면 Biz20_Tab_FeeCharge, EE21) */
@RestController
@RequestMapping("/api/v1/biz/fee-charges")
@RequiredArgsConstructor
public class BizFeeChargeController {

    private final BizFeeChargeService service;
    private final BizFeeChargeExcelService excelService;
    private final BizFeeChargePdfService pdfService;

    /** AS-IS biz.Biz20_FeeCharge.selectByChargeDate */
    @GetMapping
    public ApiResponse<List<BizFeeChargeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate chargeDate,
                                                     @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, chargeDate, searchText));
    }

    /** AS-IS getSeq */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS biz.Biz20_FeeCharge.updateCheck — 같은 운용사·청구일자의 다른 행 수(0이면 저장 가능) */
    @GetMapping("/same-corp-count")
    public ApiResponse<Integer> sameCorpCount(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam(required = false) Long feeChargeId,
                                              @RequestParam Long corpId,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate chargeDate) {
        return ApiResponse.ok(service.sameCorpCount(principal, feeChargeId, corpId, chargeDate));
    }

    /** AS-IS biz.Biz22_FeeChargeCalc.selectByContCorpId — 계산상세 */
    @GetMapping("/calcs")
    public ApiResponse<List<BizFeeChargeCalc>> calcs(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam Long contCorpId,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate chargeDate) {
        return ApiResponse.ok(service.calcs(principal, contCorpId, chargeDate));
    }

    /** AS-IS biz20_fee_charge.selectById */
    @GetMapping("/{feeChargeId}")
    public ApiResponse<BizFeeChargeDetailRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long feeChargeId) {
        return ApiResponse.ok(service.get(principal, feeChargeId));
    }

    /** AS-IS biz.Biz20_FeeCharge.modelUpdate (등록·수정 같은 경로) */
    @PostMapping
    public ApiResponse<BizFeeChargeDetailRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizFeeChargeSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS biz.Biz20_FeeCharge.createFeeCharge → 처리한 계약사 수 */
    @PostMapping("/batch")
    public ApiResponse<Integer> batch(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizFeeChargeBatchReq req) {
        return ApiResponse.ok(service.batch(principal, req.chargeDate(), req.contCorpId()));
    }

    /** AS-IS biz.Biz20_FeeCharge.deleteList → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> feeChargeIds) {
        return ApiResponse.ok(service.delete(principal, feeChargeIds));
    }

    /** AS-IS biz.Biz20_FeeCharge.confirmUpdate */
    @PutMapping("/confirm")
    public ApiResponse<Integer> confirm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizFeeChargeConfirmReq req) {
        return ApiResponse.ok(service.confirm(principal, req));
    }

    /** AS-IS biz.Biz20_FeeCharge.apprCheck — 빈 목록이면 보수입금계좌 없음 */
    @GetMapping("/{feeChargeId}/appr-check")
    public ApiResponse<List<BizFeeChargeApprRes>> apprCheck(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long feeChargeId) {
        return ApiResponse.ok(service.apprCheck(principal, feeChargeId));
    }

    /** AS-IS biz.Biz20_FeeCharge.updateApprId */
    @PutMapping("/{feeChargeId}/appr-id")
    public ApiResponse<Integer> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long feeChargeId,
                                             @RequestParam Long apprId) {
        return ApiResponse.ok(service.updateApprId(principal, feeChargeId, apprId));
    }

    /** AS-IS sys.Sys99_Print.insertRdFeeCharge → 그룹 ID */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate chargeDate,
                                       @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.rdPrint(principal, chargeDate, searchText));
    }
    // ── EE33 후처리: 엑셀·PDF 생성, 통합 엑셀, 계산상세 엑셀, 파일 zip ──

    /** AS-IS utils.excel.ExcelCreate.createFeeExcel (자료생성 뒤 makeExcel) → 만든 파일 수 */
    @PostMapping("/files/excel")
    public ApiResponse<Integer> createExcel(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizFeeChargeFileReq req) {
        return ApiResponse.ok(excelService.createFeeExcel(principal, req.chargeDate(), req.quarter(), req.contCorpId()));
    }

    /** AS-IS utils.pdf.PDFCreate.createFeePDF (makePDF) → 만든 파일 수 */
    @PostMapping("/files/pdf")
    public ApiResponse<Integer> createPdf(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizFeeChargeFileReq req) {
        return ApiResponse.ok(pdfService.createFeePdf(principal, req.chargeDate(), req.quarter(), req.contCorpId()));
    }

    /** AS-IS utils.excel.ExcelCreate.createTotalFeeExcel (통합상신 A20 문서 저장 뒤) → 올린 파일 ID */
    @PostMapping("/files/total-excel")
    public ApiResponse<Long> createTotalExcel(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizFeeChargeTotalExcelReq req)
            throws IOException {
        return ApiResponse.ok(excelService.createTotalFeeExcel(principal, req.apprId(), req.chargeDate(), req.quarter()));
    }

    /** AS-IS ExcelDownload?actionCode=biz22List — 계산상세 [엑셀다운로드] */
    @GetMapping("/calcs/excel")
    public ResponseEntity<byte[]> calcExcel(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long contCorpId,
                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate chargeDate) throws IOException {
        String fileName = URLEncoder.encode("최저보수청구 구간계산정보.xls", StandardCharsets.UTF_8).replace("+", "%20");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + fileName)
                .body(excelService.calcExcel(principal, contCorpId, chargeDate));
    }

    /** AS-IS FileDownload?fileType=feeCharge — [파일 일괄 다운로드] zip ("Asset-ERP.zip") */
    @GetMapping("/files/zip")
    public ResponseEntity<StreamingResponseBody> filesZip(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate chargeDate) {
        List<SysFileService.StoredFile> entries = service.zipEntries(principal, chargeDate);
        StreamingResponseBody body = out -> {
            try (ZipOutputStream zip = new ZipOutputStream(out)) {
                zip.setLevel(8);
                for (SysFileService.StoredFile entry : entries) {
                    ZipEntry zipEntry = new ZipEntry(entry.fileNm());
                    zipEntry.setTime(entry.file().lastModified());
                    zip.putNextEntry(zipEntry);
                    Files.copy(entry.file().toPath(), zip);
                    zip.closeEntry();
                }
            }
        };
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/zip")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Asset-ERP.zip\"")
                .body(body);
    }
}
