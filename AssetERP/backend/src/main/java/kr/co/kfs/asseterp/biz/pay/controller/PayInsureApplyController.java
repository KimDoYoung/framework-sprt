package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsureApplyCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsureApplyRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsureApplySaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePreYearCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePreYearDeleteReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePreYearSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayInsureApplyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 4대보험신고(EDI) — AS-IS Pay31_Tab_InsureApply (S26). 서비스 pay.Pay31_InsureApply */
@RestController
@RequestMapping("/api/v1/pay/insure-applies")
@RequiredArgsConstructor
public class PayInsureApplyController {

    private final PayInsureApplyService service;

    /** pay.Pay31_InsureApply.selectByCompanyId — gubun "1"·"multi"·"4"·"5" */
    @GetMapping
    public ApiResponse<List<PayInsureApplyRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam String gubun,
                                                       @RequestParam(required = false) Long personId,
                                                       @RequestParam(defaultValue = "%") String insureCode,
                                                       @RequestParam(required = false) String year,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.search(principal, personId, insureCode, gubun, year, startDate, closeDate));
    }

    /** pay.Pay31_InsureApply.update */
    @PutMapping
    public ApiResponse<List<PayInsureApplyRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestBody List<PayInsureApplySaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** pay.Pay31_InsureApply.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** pay.Pay31_InsureApply.insert1 → 만든 행 수 */
    @PostMapping
    public ApiResponse<Integer> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayInsureApplyCreateReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** pay.Pay31_InsureApply.insert3 */
    @PostMapping("/pre-year")
    public ApiResponse<Void> createPreYear(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayInsurePreYearCreateReq req) {
        service.createPreYear(principal, req);
        return ApiResponse.ok(null);
    }

    /** pay.Pay31_InsureApply.updateList */
    @PutMapping("/pre-year")
    public ApiResponse<Void> savePreYear(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayInsurePreYearSaveReq req) {
        service.savePreYear(principal, req);
        return ApiResponse.ok(null);
    }

    /** pay.Pay31_InsureApply.deleteList → 지운 건수 */
    @DeleteMapping("/pre-year")
    public ApiResponse<Integer> deletePreYear(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayInsurePreYearDeleteReq req) {
        return ApiResponse.ok(service.deletePreYear(principal, req));
    }

    /** 탭 4 [템플릿] (AS-IS ./excelTemplete/Template_4대보험 납부방법 변경.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_4대보험 납부방법 변경.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 탭 2 [엑셀업로드] (AS-IS ExcelUpload?uploadType=ediUpload) → 넣은 건수 */
    @PostMapping("/excel/edi")
    public ApiResponse<Integer> uploadEdi(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.uploadEdi(principal, file));
    }

    /** 탭 4 [엑셀업로드] (AS-IS ExcelUpload?uploadType=payInsureApply4Upload) → 넣은 건수 */
    @PostMapping("/excel/pay-method")
    public ApiResponse<Integer> uploadPayMethod(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.uploadPayMethod(principal, file));
    }
}
