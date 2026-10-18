package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductLimitReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.service.PayDeductTableService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 근로소득 공제표 (AS-IS Pay24_TabPage_DeductTable·Pay24_TabPage_Deduct·Pay24_Popup_DeductTableCreate → server/pay/Pay24_DeductTable) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/deduct-tables")
@RequiredArgsConstructor
public class PayDeductTableController {

    private final PayDeductTableService service;

    /** AS-IS pay.Pay24_DeductTable.selectByAll */
    @GetMapping("/dates")
    public ApiResponse<List<PayStartDateRes>> searchDates() {
        return ApiResponse.ok(service.searchDates());
    }

    /** AS-IS pay.Pay24_DeductTable.insert (적용일 생성) */
    @PostMapping("/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayStartDateReq req) {
        service.createDate(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS pay.Pay24_DeductTable.deleteByDate → 지운 건수 */
    @DeleteMapping("/dates")
    public ApiResponse<Integer> deleteDate(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteDate(principal, startDate));
    }

    /** AS-IS pay.Pay24_DeductTable.selectByDataCode("2") — 공제표 구간 */
    @GetMapping
    public ApiResponse<List<PayDeductTableRes>> search(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.search(startDate));
    }

    /** AS-IS pay.Pay24_DeductTable.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayDeductTableRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayDeductTableSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS pay.Pay24_DeductTable.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS pay.Pay24_DeductTable.selectByDataCode("1") — 공제한도 */
    @GetMapping("/limit")
    public ApiResponse<Long> searchLimit(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.searchLimit(startDate));
    }

    /** AS-IS pay.Pay24_DeductTable.updateLimitAmt → 고친 건수 */
    @PutMapping("/limit")
    public ApiResponse<Integer> saveLimit(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayDeductLimitReq req) {
        return ApiResponse.ok(service.saveLimit(principal, req.startDate(), req.limitAmt()));
    }
}
