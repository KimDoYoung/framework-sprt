package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.service.PayPersonDeductService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 인적공제금액 (AS-IS Pay25_TabPage_PersonDeduct·Pay25_TabPage_Deduct·Pay25_Popup_personDeductCreate → server/pay/Pay25_PersonDeduct) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/person-deducts")
@RequiredArgsConstructor
public class PayPersonDeductController {

    private final PayPersonDeductService service;

    /** AS-IS pay.Pay25_PersonDeduct.selectByAll */
    @GetMapping("/dates")
    public ApiResponse<List<PayStartDateRes>> searchDates() {
        return ApiResponse.ok(service.searchDates());
    }

    /** AS-IS pay.Pay25_PersonDeduct.insert (적용일 생성) */
    @PostMapping("/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayStartDateReq req) {
        service.createDate(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS pay.Pay25_PersonDeduct.deleteByDate → 지운 건수 */
    @DeleteMapping("/dates")
    public ApiResponse<Integer> deleteDate(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteDate(principal, startDate));
    }

    /** AS-IS pay.Pay25_PersonDeduct.selectByDate */
    @GetMapping
    public ApiResponse<List<PayPersonDeductRes>> search(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.search(startDate));
    }

    /** AS-IS pay.Pay25_PersonDeduct.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayPersonDeductRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayPersonDeductSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS pay.Pay25_PersonDeduct.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
