package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.AstAssetItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassTreeItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassTreeRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemClassUpdateReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeRes;
import kr.co.kfs.asseterp.biz.ast.service.AstClassTreeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
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

/** 자산 분류 트리 (AS-IS Apr01_Tab_ItemDocument 트리 / Ast01_Tab_ClassTreeManagement → server/ast/Ast01_ClassTree) — 메뉴 #1117, #1137 */
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

    /** R08 자산분류 전체 트리 조회 */
    @GetMapping
    public ApiResponse<List<AstClassTreeRes>> searchClassTree(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String typeCode,
            @RequestParam(required = false) String assetType
    ) {
        return ApiResponse.ok(service.searchClassTree(principal, typeCode, assetType));
    }

    /** R08 우측 종목 상세 목록 */
    @GetMapping("/{parentId}/items")
    public ApiResponse<List<AstClassTreeItemRes>> searchByParentId(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long parentId,
            @RequestParam(required = false) String typeCode
    ) {
        return ApiResponse.ok(service.searchByParentId(principal, parentId, typeCode));
    }

    /** R08 코드 채번 */
    @GetMapping("/create-code")
    public ApiResponse<String> createCode(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long parentId,
            @RequestParam String typeCode
    ) {
        return ApiResponse.ok(service.createCode(principal, parentId, typeCode));
    }

    /** R08 분류 등록 */
    @PostMapping
    public ApiResponse<Long> createClassTree(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AstClassTreeSaveReq req
    ) {
        return ApiResponse.ok(service.saveClassTree(principal, req));
    }

    /** R08 분류 수정 */
    @PutMapping("/{id}")
    public ApiResponse<Long> updateClassTree(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody AstClassTreeSaveReq req
    ) {
        AstClassTreeSaveReq target = new AstClassTreeSaveReq(
                id,
                req.parentTreeId(),
                req.classTreeName(),
                req.classTreeCode(),
                req.seq(),
                req.typeCode(),
                req.isin(),
                req.note(),
                req.useYn(),
                req.assetType()
        );
        return ApiResponse.ok(service.saveClassTree(principal, target));
    }

    /** R08 우측 종목 일괄 등록/수정 */
    @PutMapping("/{parentId}/items")
    public ApiResponse<Void> saveItems(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long parentId,
            @RequestBody List<AstClassTreeSaveReq> items
    ) {
        service.saveItems(principal, parentId, items);
        return ApiResponse.ok(null);
    }

    /** R08 상위분류 변경(이동) */
    @PutMapping("/{id}/move")
    public ApiResponse<Void> updateParentId(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam Long parentId
    ) {
        service.updateParentId(principal, id, parentId);
        return ApiResponse.ok(null);
    }

    /** R08 추가정보 설정 */
    @PutMapping("/{id}/item-class")
    public ApiResponse<Void> modelUpdate(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody AstItemClassUpdateReq req
    ) {
        AstItemClassUpdateReq target = new AstItemClassUpdateReq(
                id,
                req.content(),
                req.itemLClassCode(),
                req.itemMClassCode(),
                req.itemSClassCode(),
                req.itemDClassCode(),
                req.accountType(),
                req.trUnit(),
                req.issueDate(),
                req.matDate(),
                req.corpId(),
                req.curCode(),
                req.depnYear(),
                req.depnRate(),
                req.depnType(),
                req.evalType()
        );
        service.modelUpdate(principal, target);
        return ApiResponse.ok(null);
    }

    /** R08 분류/종목 삭제 */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteClassTree(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        service.deleteClassTree(principal, id);
        return ApiResponse.ok(null);
    }
}
