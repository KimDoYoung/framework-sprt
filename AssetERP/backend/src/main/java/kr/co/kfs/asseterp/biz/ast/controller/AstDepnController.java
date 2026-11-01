package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.DepnCostReq;
import kr.co.kfs.asseterp.biz.ast.dto.DepnProcessReq;
import kr.co.kfs.asseterp.biz.ast.dto.DepnRes;
import kr.co.kfs.asseterp.biz.ast.service.AstDepnService;
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

/** 감가상각처리 Ast06_Tab_EvalDepn (W11) — AS-IS ast.Ast06_Tr.selectDepn · updateDepnEval · updateDepnCost. 취소는 POST ast/trs/delete */
@RestController
@RequestMapping("/api/v1/ast/depns")
@RequiredArgsConstructor
public class AstDepnController {

    private final AstDepnService service;

    /** ast.Ast06_Tr.selectDepn — depnDate = 상각년월의 말일 */
    @GetMapping
    public ApiResponse<List<DepnRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate depnDate) {
        return ApiResponse.ok(service.search(principal, depnDate));
    }

    /** act.Act04_GenLedger.checkClose — 마감됐으면 오류 메시지 */
    @GetMapping("/check-close")
    public ApiResponse<Void> checkClose(@AuthenticationPrincipal UserPrincipal principal,
                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        service.checkClose(principal, stdDate);
        return ApiResponse.ok(null);
    }

    /** ast.Ast06_Tr.updateDepnEval */
    @PostMapping("/process")
    public ApiResponse<Void> process(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody DepnProcessReq req) {
        service.process(principal, req.items());
        return ApiResponse.ok(null);
    }

    /** ast.Ast06_Tr.updateDepnCost */
    @PutMapping("/{trId}/cost")
    public ApiResponse<Void> updateCost(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long trId,
                                        @RequestBody DepnCostReq req) {
        service.updateDepnCost(principal, trId, req.depnCost() == null ? 0L : req.depnCost());
        return ApiResponse.ok(null);
    }
}
