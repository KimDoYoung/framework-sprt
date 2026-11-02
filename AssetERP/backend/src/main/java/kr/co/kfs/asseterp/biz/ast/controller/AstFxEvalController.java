package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.FxEvalProcessReq;
import kr.co.kfs.asseterp.biz.ast.dto.FxEvalRdReq;
import kr.co.kfs.asseterp.biz.ast.dto.FxEvalRes;
import kr.co.kfs.asseterp.biz.ast.service.AstFxEvalService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 외화예금 환평가처리 Ast06_Tab_FxEvalDeposit (X12) — AS-IS Ast06_Tr.selectFxEvalList · updateFxEval · Sys99_Print.insertRdFxEvalDeposit */
@RestController
@RequestMapping("/api/v1/ast/fx-evals")
@RequiredArgsConstructor
public class AstFxEvalController {

    private final AstFxEvalService service;

    @GetMapping
    public ApiResponse<List<FxEvalRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                               @RequestParam(required = false) Long corpId,
                                               @RequestParam(required = false) Long accountId) {
        return ApiResponse.ok(service.search(principal, closeDate, corpId, accountId));
    }

    @PostMapping("/process")
    public ApiResponse<Void> process(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FxEvalProcessReq req) {
        service.process(principal, req.items());
        return ApiResponse.ok(null);
    }

    @PostMapping("/cancel")
    public ApiResponse<Void> cancel(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FxEvalProcessReq req) {
        service.cancel(principal, req.items());
        return ApiResponse.ok(null);
    }

    /** 출력그룹ID */
    @PostMapping("/rd")
    public ApiResponse<Long> rd(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FxEvalRdReq req) {
        return ApiResponse.ok(service.insertRd(principal, req));
    }
}
