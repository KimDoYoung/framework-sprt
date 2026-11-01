package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.EvalProcessReq;
import kr.co.kfs.asseterp.biz.ast.dto.EvalRdReq;
import kr.co.kfs.asseterp.biz.ast.dto.EvalRes;
import kr.co.kfs.asseterp.biz.ast.service.AstEvalService;
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

/** 금융상품 평가처리 Ast06_Tab_EvalFinance (W09) — AS-IS ast.Ast06_Tr.selectEvalList · updateEval, sys.Sys99_Print.insertRdEvalFinance */
@RestController
@RequestMapping("/api/v1/ast/evals")
@RequiredArgsConstructor
public class AstEvalController {

    private final AstEvalService service;

    /** 회사의 자산평가 주기(sys01_ast_eval_cycle_cd) — 값이 없으면 null */
    @GetMapping("/cycle")
    public ApiResponse<String> cycle(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.evalCycle(principal));
    }

    /** sys.Sys12_Calendar.selectBizDate2 — [시세입력]의 기준일(평가 기준일 또는 그 앞 영업일) */
    @GetMapping("/price-date")
    public ApiResponse<String> priceDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.priceDate(stdDate));
    }

    /** ast.Ast06_Tr.selectEvalList — evalType 1(시가평가)·2(이자평가) */
    @GetMapping
    public ApiResponse<List<EvalRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                             @RequestParam(required = false) Long corpId,
                                             @RequestParam(required = false) Long accountId,
                                             @RequestParam(required = false) Long classTreeId,
                                             @RequestParam(required = false) String searchText,
                                             @RequestParam(required = false) String evalType) {
        return ApiResponse.ok(service.search(principal, closeDate, corpId, accountId, classTreeId, searchText, evalType));
    }

    /** ast.Ast06_Tr.updateEval(procType P) — 처리한 줄을 돌려준다 */
    @PostMapping("/process")
    public ApiResponse<List<EvalRes>> process(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody EvalProcessReq req) {
        return ApiResponse.ok(service.process(principal, req.items()));
    }

    /** ast.Ast06_Tr.updateEval(procType C) */
    @PostMapping("/cancel")
    public ApiResponse<Void> cancel(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody EvalProcessReq req) {
        service.cancel(principal, req.items());
        return ApiResponse.ok(null);
    }

    /** sys.Sys99_Print.insertRdEvalFinance → rdGroupId */
    @PostMapping("/rd")
    public ApiResponse<Long> rd(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody EvalRdReq req) {
        return ApiResponse.ok(service.insertRd(principal, req));
    }
}
