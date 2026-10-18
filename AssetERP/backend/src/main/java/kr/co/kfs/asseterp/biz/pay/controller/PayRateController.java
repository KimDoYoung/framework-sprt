package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRateSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayRateService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 율관리 (AS-IS Pay21_TabPage_Rate → server/pay/Pay21_Rate) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/rates")
@RequiredArgsConstructor
public class PayRateController {

    private final PayRateService service;

    /** AS-IS pay.Pay21_Rate.selectByCode */
    @GetMapping
    public ApiResponse<List<PayRateRes>> search(@RequestParam(defaultValue = "%") String rateCode) {
        return ApiResponse.ok(service.search(rateCode));
    }

    /** AS-IS pay.Pay21_Rate.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayRateRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayRateSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS pay.Pay21_Rate.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
