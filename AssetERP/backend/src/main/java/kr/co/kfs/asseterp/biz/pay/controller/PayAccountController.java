package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayAccountRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayAccountSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayAccountService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 급여출금계좌 Pay03_Lookup_PayAccount (S18) — AS-IS pay.Pay03_Account */
@RestController
@RequestMapping("/api/v1/pay/accounts")
@RequiredArgsConstructor
public class PayAccountController {

    private final PayAccountService service;

    /** pay.Pay03_Account.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<PayAccountRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** pay.Pay03_Account.selectByStartDate — 지급일에 적용되는 계좌, 없으면 data가 null */
    @GetMapping("/current")
    public ApiResponse<PayAccountRes> current(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.current(principal, startDate));
    }

    /** pay.Pay03_Account.update */
    @PutMapping
    public ApiResponse<List<PayAccountRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestBody List<PayAccountSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** pay.Pay03_Account.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
