package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.CorpAccountRes;
import kr.co.kfs.asseterp.biz.ast.service.AstCorpAccountService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 계좌선택 조회창 Ast01_Lookup_CorpAccount (U02) — AS-IS ast.Ast01_ClassTree.selectCorpAccount */
@RestController
@RequestMapping("/api/v1/ast/corp-accounts")
@RequiredArgsConstructor
public class AstCorpAccountController {

    private final AstCorpAccountService service;

    /** ast.Ast01_ClassTree.selectCorpAccount */
    @GetMapping
    public ApiResponse<List<CorpAccountRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                    @RequestParam(defaultValue = "") String searchText,
                                                    @RequestParam(required = false) Boolean prePayOnlyYn,
                                                    @RequestParam(required = false) Long corpId) {
        return ApiResponse.ok(service.search(principal, searchText, stdDate, prePayOnlyYn, corpId));
    }
}
