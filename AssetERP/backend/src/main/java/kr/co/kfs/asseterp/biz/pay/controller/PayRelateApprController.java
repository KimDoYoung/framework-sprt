package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthRelateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateApprIdReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateApprRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireRelateReq;
import kr.co.kfs.asseterp.biz.pay.service.PayRelateApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/** 급여대장 상신 상태 Pay10_Tab_List (S18) — AS-IS pay.Pay05_RelateAppr */
@RestController
@RequestMapping("/api/v1/pay/relate-apprs")
@RequiredArgsConstructor
public class PayRelateApprController {

    private final PayRelateApprService service;

    /** pay.Pay05_RelateAppr.selectByCompanyId — 상신 이력이 없으면 data가 null */
    @GetMapping
    public ApiResponse<PayRelateApprRes> current(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String payCode,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate) {
        return ApiResponse.ok(service.current(principal, payCode, payDate));
    }

    /** pay.Pay05_RelateAppr.selectByRetire — 퇴직정산서의 상신 상태(S22), 없으면 data null */
    @GetMapping("/retire")
    public ApiResponse<PayRelateApprRes> retire(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long monthId) {
        return ApiResponse.ok(service.retire(principal, monthId));
    }

    /** pay.Pay05_RelateAppr.insertRetire — 퇴직정산서 상신 행(없으면 만든다) → 상신 행 ID (V18) */
    @PostMapping("/retire")
    public ApiResponse<Long> createRetire(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayRetireRelateReq req) {
        return ApiResponse.ok(service.createRetire(principal, req.monthId()));
    }

    /** pay.Pay05_RelateAppr.insert + PDFCreate.createPayMonth10 — 급여대장 상신 행(없으면 만든다)과 PDF 첨부 → 상신 행 ID (V25) */
    @PostMapping("/month")
    public ApiResponse<Long> createMonth(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayMonthRelateReq req) {
        return ApiResponse.ok(service.createMonth(principal, req.payCode(), req.payDate()));
    }

    /** pay.Pay05_RelateAppr.updateApprId — 결재창 상신·저장 뒤 (V18) */
    @PutMapping("/{relateApprId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long relateApprId, @RequestBody PayRelateApprIdReq req) {
        service.updateApprId(principal, relateApprId, req.apprId());
        return ApiResponse.ok(null);
    }
}
