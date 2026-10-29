package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.RelateApprApprIdReq;
import kr.co.kfs.asseterp.biz.ast.dto.RelateApprCreateReq;
import kr.co.kfs.asseterp.biz.ast.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.ast.service.AstRelateApprService;
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

/** 연관문서(고유자산) — 일일자금관리 상신 상태 (AS-IS ast.Ast80_RelateAppr) */
@RestController
@RequestMapping("/api/v1/ast/relate-apprs")
@RequiredArgsConstructor
public class AstRelateApprController {

    private final AstRelateApprService service;

    /** ast.Ast80_RelateAppr.selectByCompanyId — 한 건이 아니면 null(미상신) */
    @GetMapping
    public ApiResponse<RelateApprRes> get(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                          @RequestParam String linkCode) {
        return ApiResponse.ok(service.get(principal, date, linkCode));
    }

    /** ast.Ast80_RelateAppr.insert → 새 relateApprId */
    @PostMapping
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody RelateApprCreateReq req) {
        return ApiResponse.ok(service.create(principal, req.date(), req.linkCode()));
    }

    /** ast.Ast80_RelateAppr.updateApprId */
    @PutMapping("/{relateApprId}/appr-id")
    public ApiResponse<Integer> updateApprId(@PathVariable Long relateApprId, @Valid @RequestBody RelateApprApprIdReq req) {
        return ApiResponse.ok(service.updateApprId(relateApprId, req.apprId()));
    }
}
