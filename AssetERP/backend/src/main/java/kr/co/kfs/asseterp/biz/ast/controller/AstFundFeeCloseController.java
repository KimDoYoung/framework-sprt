package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseProcessReq;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseRdReq;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseReprocReq;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeFundSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstFundFeeCloseService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 펀드보수 결산처리 Ast30_Tab_OfficeMngFeeClose (X13) — AS-IS Ast30_BookFundFee.selectEvalFundFee · updateEvalFundFee · reprocFundFee · selectByCorpId · update */
@RestController
@RequestMapping("/api/v1/ast/fund-fee-closes")
@RequiredArgsConstructor
public class AstFundFeeCloseController {

    private final AstFundFeeCloseService service;

    @GetMapping
    public ApiResponse<List<FundFeeCloseRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                     @RequestParam(required = false) Long corpId,
                                                     @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, holdDate, corpId, searchText));
    }

    @PostMapping("/process")
    public ApiResponse<Void> process(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundFeeCloseProcessReq req) {
        service.process(principal, req.items());
        return ApiResponse.ok(null);
    }

    @PostMapping("/cancel")
    public ApiResponse<Void> cancel(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundFeeCloseProcessReq req) {
        service.cancel(principal, req.items());
        return ApiResponse.ok(null);
    }

    /** 보수원장정리 */
    @PostMapping("/reproc")
    public ApiResponse<Void> reproc(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundFeeCloseReprocReq req) {
        service.reprocFundFee(principal, req.closeDate());
        return ApiResponse.ok(null);
    }

    /** 출력그룹ID */
    @PostMapping("/rd")
    public ApiResponse<Long> rd(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundFeeCloseRdReq req) {
        return ApiResponse.ok(service.insertRd(principal, req));
    }

    /** 펀드운용보수 결산처리(X35)의 출력그룹ID — 열이 4개뿐인 별도 출력 */
    @PostMapping("/fund-rd")
    public ApiResponse<Long> fundRd(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundFeeCloseRdReq req) {
        return ApiResponse.ok(service.insertFundMngRd(principal, req));
    }

    /** 환율 및 펀드보수 변경 조회창의 펀드 목록 */
    @GetMapping("/funds")
    public ApiResponse<List<FundFeeFundRes>> searchFunds(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                         @RequestParam Long corpId,
                                                         @RequestParam(required = false) String curCode,
                                                         @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchFunds(principal, holdDate, corpId, curCode, searchText));
    }

    @PutMapping("/funds")
    public ApiResponse<Integer> saveFunds(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundFeeFundSaveReq req) {
        return ApiResponse.ok(service.saveFunds(principal, req));
    }
}
