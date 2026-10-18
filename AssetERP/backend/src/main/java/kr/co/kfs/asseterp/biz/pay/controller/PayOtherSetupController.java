package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayOtherSetupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayOtherSetupSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.service.PayOtherSetupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 급여공제 기타설정 (AS-IS Pay29_TabPage_OtherSetupDate·Pay29_TabPage_OtherSetup·Pay29_Popup_OtherSetupCreate → server/pay/Pay29_OtherSetup) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/other-setups")
@RequiredArgsConstructor
public class PayOtherSetupController {

    private final PayOtherSetupService service;

    /** AS-IS Pay29_OtherSetup.selectByAll */
    @GetMapping("/dates")
    public ApiResponse<List<PayStartDateRes>> searchDates() {
        return ApiResponse.ok(service.searchDates());
    }

    /** AS-IS Pay29_OtherSetup.insert (적용일 생성) */
    @PostMapping("/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayStartDateReq req) {
        service.createDate(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS Pay29_OtherSetup.deleteByDate → 지운 건수 */
    @DeleteMapping("/dates")
    public ApiResponse<Integer> deleteDate(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteDate(principal, startDate));
    }

    /** AS-IS Pay29_OtherSetup.selectByDate */
    @GetMapping
    public ApiResponse<List<PayOtherSetupRes>> search(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.search(startDate));
    }

    /** AS-IS Pay29_OtherSetup.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayOtherSetupRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayOtherSetupSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS Pay29_OtherSetup.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
