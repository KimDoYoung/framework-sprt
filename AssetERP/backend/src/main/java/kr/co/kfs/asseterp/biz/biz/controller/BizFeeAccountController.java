package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeAccountRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeAccountSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeAccountService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 보수입금계좌 (AS-IS server/biz/Biz29_Account — 조회창 Biz29_Lookup_Account, EE21) */
@RestController
@RequestMapping("/api/v1/biz/fee-accounts")
@RequiredArgsConstructor
public class BizFeeAccountController {

    private final BizFeeAccountService service;

    /** AS-IS biz.Biz29_Account.selectBySearchText */
    @GetMapping
    public ApiResponse<List<BizFeeAccountRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS getSeq */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS biz.Biz29_Account.update */
    @PutMapping
    public ApiResponse<List<BizFeeAccountRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizFeeAccountSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS biz.Biz29_Account.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> accountIds) {
        return ApiResponse.ok(service.delete(principal, accountIds));
    }
}
