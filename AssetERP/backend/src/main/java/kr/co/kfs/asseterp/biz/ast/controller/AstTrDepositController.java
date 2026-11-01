package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSellBookReq;
import kr.co.kfs.asseterp.biz.ast.service.AstTrDepositService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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
import java.util.List;

/** 계좌이체 Ast06_Tab_TrDeposit (X06)·외화 Ast06_Tab_TrForDeposit (X10) — AS-IS ast.Ast06_Tr.selectDepositTr · selectById · update · updateDepositSellBookAmt. 삭제는 `POST /trs/delete`(U04) */
@RestController
@RequestMapping("/api/v1/ast/trs/deposits")
@RequiredArgsConstructor
public class AstTrDepositController {

    private final AstTrDepositService service;

    @GetMapping
    public ApiResponse<List<TrDepositRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                  @RequestParam(required = false) Long accountId,
                                                  @RequestParam(required = false, defaultValue = "1") String abroType) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, accountId, abroType));
    }

    @GetMapping("/{trId}")
    public ApiResponse<TrDepositRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long trId) {
        return ApiResponse.ok(service.get(principal, trId));
    }

    /** 외화 계좌이체(X10) 분개 전 출금장부금액 UPDATE(ast.Ast06_Tr.updateDepositSellBookAmt) */
    @PostMapping("/{trId}/sell-book-amt")
    public ApiResponse<Void> updateSellBookAmt(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long trId,
                                               @RequestBody TrDepositSellBookReq req) {
        service.updateSellBookAmt(principal, trId, req.actionName());
        return ApiResponse.ok(null);
    }

    /** 저장한 거래ID */
    @PutMapping
    public ApiResponse<Long> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TrDepositSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }
}
