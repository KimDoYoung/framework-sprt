package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.FavoriteAccountRes;
import kr.co.kfs.asseterp.biz.pay.dto.FavoriteAccountSeqReq;
import kr.co.kfs.asseterp.biz.pay.service.PayFavoriteAccountService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 자주 쓰는 계정과목 Pay52_Lookup_AccountCode (U03) — AS-IS pay.Pay52_FavoriteAccount */
@RestController
@RequestMapping("/api/v1/pay/favorite-accounts")
@RequiredArgsConstructor
public class PayFavoriteAccountController {

    private final PayFavoriteAccountService service;

    /** pay.Pay52_FavoriteAccount.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<FavoriteAccountRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) String attributeCode,
                                                        @RequestParam(required = false) String searchText,
                                                        @RequestParam(defaultValue = "false") boolean allAccountYn) {
        return ApiResponse.ok(service.search(principal, attributeCode, searchText, allAccountYn));
    }

    /** pay.Pay52_FavoriteAccount.insert — 계정코드 ID 목록, 이미 있는 것은 건너뛴 뒤 더한 건수 */
    @PostMapping
    public ApiResponse<Integer> insert(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> accountCodeIds) {
        return ApiResponse.ok(service.insert(principal, accountCodeIds));
    }

    /** pay.Pay52_FavoriteAccount.update */
    @PutMapping
    public ApiResponse<Integer> updateSeq(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<FavoriteAccountSeqReq> rows) {
        return ApiResponse.ok(service.updateSeq(principal, rows));
    }

    /** pay.Pay52_FavoriteAccount.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
