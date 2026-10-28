package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayTaxReceiptService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** 원천징수영수증(사본) Pay08_Tab_TaxWithholding (S24) · 업로드 Pay08_Tab_TaxWithholdingAdmin (S25) — AS-IS pay.Pay08_TaxWithholding */
@RestController
@RequestMapping("/api/v1/pay/tax-receipts")
@RequiredArgsConstructor
public class PayTaxReceiptController {

    private final PayTaxReceiptService service;

    /** pay.Pay08_TaxWithholding.selectByPersonId — 로그인 사용자 본인의 영수증 파일 */
    @GetMapping("/mine")
    public ApiResponse<List<PayTaxReceiptRes>> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchMine(principal));
    }

    /** S25 retrieve() — personId가 있으면 selectByPersonId, 없으면 selectByCompanyId */
    @GetMapping
    public ApiResponse<List<PayTaxReceiptRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam(required = false) Long personId) {
        return ApiResponse.ok(service.search(principal, personId));
    }

    /** S25 FileUpload?mode=pay08 — 파일 하나(영수증 행 + 파일) */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<PayTaxReceiptRes> upload(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam("file") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }

    /** S25 update() — 바뀐 행의 사원·비고 → 저장한 건수 */
    @PutMapping
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal,
                                     @RequestBody List<PayTaxReceiptSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** S25 checkFileDelete 상태 3 뒤 pay.Pay08_TaxWithholding.delete → 지운 건수 */
    @DeleteMapping("/{taxWithholdingId}")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @PathVariable Long taxWithholdingId) {
        return ApiResponse.ok(service.delete(principal, taxWithholdingId));
    }
}
