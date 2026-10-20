package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeMoveReq;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsClassTreeItemRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsWriteTreeRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsClassTreeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법규관리(관리자) 분류 트리 (AS-IS Ics01_Tab_ClassTree 트리 + Ics01_Edit_ClassTree·Ics01_Move_TreeGrid → server/ics/Ics01_ClassTree) — 메뉴 #1012 */
@RestController
@RequestMapping("/api/v1/ics/class-trees")
@RequiredArgsConstructor
public class IcsClassTreeController {

    private final IcsClassTreeService service;

    /** AS-IS ics.Ics01_ClassTree.selectByCompanyId(typeCode IC) */
    @GetMapping
    public ApiResponse<List<ClassTreeRes>> searchTree(@RequestParam(defaultValue = "IC") String typeCode) {
        return ApiResponse.ok(service.searchTree(typeCode));
    }

    /** AS-IS ics.Ics01_ClassTree.selectByParentTreeId / selectByAll (IcsComboBoxField·Ics01_Lookup_CheckList, H04) — parentTreeId가 없으면 최상위를 뺀 모든 분류 */
    @GetMapping("/items")
    public ApiResponse<List<IcsClassTreeItemRes>> searchItems(@RequestParam(required = false) Long parentTreeId,
                                                              @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchItems(parentTreeId, searchText));
    }

    /** AS-IS ics.Ics01_ClassTree.selectByCompanyId(typeCode %) (Ics01_Tab_ApprList 법규별 문서작성 트리, F03) */
    @GetMapping("/write")
    public ApiResponse<List<IcsWriteTreeRes>> searchWriteTree() {
        return ApiResponse.ok(service.searchWriteTree());
    }

    /** AS-IS ics.Ics01_ClassTree.update (등록) */
    @PostMapping
    public ApiResponse<ClassTreeRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ClassTreeSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS ics.Ics01_ClassTree.update (수정) */
    @PutMapping("/{classTreeId}")
    public ApiResponse<ClassTreeRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                            @RequestBody ClassTreeSaveReq req) {
        return ApiResponse.ok(service.update(principal, classTreeId, req));
    }

    /** AS-IS ics.Ics01_ClassTree.update (상위 분류 이동) */
    @PutMapping("/{classTreeId}/parent")
    public ApiResponse<Void> move(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId, @RequestBody ClassTreeMoveReq req) {
        service.move(principal, classTreeId, req.parentTreeId());
        return ApiResponse.ok(null);
    }

    /** AS-IS ics.Ics01_ClassTree.deleteAll → 지운 건수(하위 포함) */
    @DeleteMapping("/{classTreeId}")
    public ApiResponse<Integer> deleteAll(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(service.deleteAll(principal, classTreeId));
    }
}
