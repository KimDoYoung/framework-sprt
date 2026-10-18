package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaDateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayFormulaService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 임금계산방법 (AS-IS Pay04_TabPage_Formula·Pay04_Lookup_Insert → server/pay/Pay04_Formula) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/formulas")
@RequiredArgsConstructor
public class PayFormulaController {

    private final PayFormulaService service;

    /** AS-IS pay.Pay04_Formula.selectByCompanyId — companyId 없으면 로그인 회사 */
    @GetMapping("/dates")
    public ApiResponse<List<PayFormulaDateRes>> searchDates(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(service.searchDates(principal, companyId));
    }

    /** AS-IS pay.Pay04_Formula.selectByDate */
    @GetMapping
    public ApiResponse<List<PayFormulaRes>> searchByDate(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) Long companyId,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.searchByDate(principal, companyId, startDate));
    }

    /** AS-IS pay.Pay04_Formula.insert (적용일 생성) */
    @PostMapping("/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayFormulaCreateReq req) {
        service.createDate(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS pay.Pay04_Formula.deleteByDate → 지운 건수 */
    @DeleteMapping("/dates")
    public ApiResponse<Integer> deleteDate(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteDate(principal, startDate));
    }

    /** AS-IS pay.Pay04_Formula.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayFormulaRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayFormulaSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS pay.Pay04_Formula.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS pay.Pay04_Formula.basicDataCreate → 복사한 건수 */
    @PostMapping("/basic-data")
    public ApiResponse<Integer> basicDataCreate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayFormulaCreateReq req) {
        return ApiResponse.ok(service.basicDataCreate(principal, req.companyId(), req.startDate()));
    }
}
