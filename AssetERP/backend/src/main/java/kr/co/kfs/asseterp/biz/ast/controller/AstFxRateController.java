package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.FxRateDeleteReq;
import kr.co.kfs.asseterp.biz.ast.dto.FxRateRes;
import kr.co.kfs.asseterp.biz.ast.dto.FxRateSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstFxEvalService;
import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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

/** 환율입력 Ast24_Lookup_FxRate (X12) — AS-IS ast.Ast24_FxRate.selectByStdDate · update · delete (fxRateType 01 평가환율) */
@RestController
@RequestMapping("/api/v1/ast/fx-rates")
@RequiredArgsConstructor
public class AstFxRateController {

    private final AstFxEvalService service;

    @GetMapping
    public ApiResponse<List<FxRateRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                               @RequestParam(required = false, defaultValue = "%") String curCode) {
        return ApiResponse.ok(service.searchFxRates(principal, stdDate, curCode));
    }

    @PutMapping
    public ApiResponse<List<FxRateRes>> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody FxRateSaveReq req) {
        return ApiResponse.ok(service.saveFxRates(principal, req.items()));
    }

    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FxRateDeleteReq req) {
        return ApiResponse.ok(service.deleteFxRates(principal, req.ids()));
    }
}
