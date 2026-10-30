package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalRes;
import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstOwnerCapitalService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 자기자본/투자한도 등록 (AS-IS Ast40_Tab_OwnerCapital → server/ast/Ast40_OwnerCapital) — 메뉴 #1299 */
@RestController
@RequestMapping("/api/v1/ast/owner-capitals")
@RequiredArgsConstructor
public class AstOwnerCapitalController {

    private final AstOwnerCapitalService service;

    /** AS-IS ast.Ast40_OwnerCapital.selectByDate */
    @GetMapping
    public ApiResponse<List<OwnerCapitalRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam(defaultValue = "") String stdYear) {
        return ApiResponse.ok(service.search(principal, stdYear));
    }

    /** AS-IS ast.Ast40_OwnerCapital.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<OwnerCapitalRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestBody List<OwnerCapitalSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS ast.Ast40_OwnerCapital.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
