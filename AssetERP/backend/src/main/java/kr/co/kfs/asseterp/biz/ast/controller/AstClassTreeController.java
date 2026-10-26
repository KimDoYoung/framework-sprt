package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.AstAssetItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeRes;
import kr.co.kfs.asseterp.biz.ast.service.AstClassTreeService;
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

/** 자산 분류 트리 (AS-IS Apr01_Tab_ItemDocument 트리 → server/ast/Ast01_ClassTree) — 메뉴 #1137 */
@RestController
@RequestMapping("/api/v1/ast/class-trees")
@RequiredArgsConstructor
public class AstClassTreeController {

    private final AstClassTreeService service;

    /** AS-IS ast.Ast01_ClassTree.selectByCompanyId(typeCode %, assetType 1:고유자산/2:운용자산) */
    @GetMapping("/item-doc")
    public ApiResponse<List<AstItemTreeRes>> searchItemTree(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(required = false) String assetType) {
        return ApiResponse.ok(service.searchItemTree(principal, assetType));
    }

    /** AS-IS ast.Ast01_ClassTree.selectByAssetType (P10 자산별 펀드 조회 — 기준일에 운용자산이 있는 종목, assetType 2:운용자산) */
    @GetMapping("/by-asset-type")
    public ApiResponse<List<AstAssetItemRes>> searchByAssetType(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                                @RequestParam String assetType,
                                                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByAssetType(principal, stdDate, assetType, searchText));
    }
}
