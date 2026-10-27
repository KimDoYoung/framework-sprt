package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.AstDetailRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstDetailSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstDetailService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 자산상세 항목관리 (AS-IS Ast01_Tab_InfoManager → server/ast/Ast02_Detail) — 메뉴 #1089 */
@RestController
@RequestMapping("/api/v1/ast/details")
@RequiredArgsConstructor
public class AstDetailController {

    private final AstDetailService service;

    /** AS-IS ast.Ast02_Detail.selectByCompanyId0 */
    @GetMapping
    public ApiResponse<List<AstDetailRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(defaultValue = "") String searchText,
                                                  @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.search(principal, searchText, useYn));
    }

    /** AS-IS ast.Ast02_Detail.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<AstDetailRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AstDetailSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS ast.Ast02_Detail.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    // ==================== R09 종목상세 엔드포인트 ====================

    /** AS-IS ast02_detail.selectByClassTreeId */
    @GetMapping("/by-tree")
    public ApiResponse<List<kr.co.kfs.asseterp.biz.ast.dto.AstItemDetailRes>> getItemDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.getItemDetails(principal, classTreeId));
    }

    /** AS-IS ast02_detail.selectByCompanyId (기본 항목 템플릿 검색) */
    @GetMapping("/templates")
    public ApiResponse<List<kr.co.kfs.asseterp.biz.ast.dto.AstItemDetailRes>> searchTemplates(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchTemplates(principal, searchText));
    }

    /** 기본 항목 템플릿 저장(CUD) */
    @PutMapping("/templates")
    public ApiResponse<List<AstDetailRes>> saveTemplates(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody List<AstDetailSaveReq> rows) {
        return ApiResponse.ok(service.saveTemplates(principal, rows));
    }

    /** 기본 항목 템플릿 삭제 */
    @DeleteMapping("/templates")
    public ApiResponse<Integer> deleteTemplates(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteTemplates(principal, ids));
    }

    /** 종목 상세 저장(CUD) */
    @PutMapping("/items")
    public ApiResponse<List<kr.co.kfs.asseterp.biz.ast.dto.AstItemDetailRes>> saveItemDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody List<kr.co.kfs.asseterp.biz.ast.dto.AstItemDetailSaveReq> rows) {
        return ApiResponse.ok(service.saveItemDetails(principal, rows));
    }

    /** 종목 상세 삭제 */
    @DeleteMapping("/items")
    public ApiResponse<Integer> deleteItemDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteItemDetails(principal, ids));
    }
}
