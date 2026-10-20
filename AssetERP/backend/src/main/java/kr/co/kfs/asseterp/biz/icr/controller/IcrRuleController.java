package kr.co.kfs.asseterp.biz.icr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeMoveReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleContentReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleSaveReq;
import kr.co.kfs.asseterp.biz.icr.service.IcrClassTreeService;
import kr.co.kfs.asseterp.biz.icr.service.IcrRuleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 내규관리 내규 그리드 (AS-IS Icr01_Grid_IcrType·Icr01_Lookup_Content·Icr01_Move_Grid·Icr01_Lookup_IcrFile → server/icr/Icr01_ClassTree) — 메뉴 #1347 */
@RestController
@RequestMapping("/api/v1/icr/rules")
@RequiredArgsConstructor
public class IcrRuleController {

    private final IcrRuleService service;
    private final IcrClassTreeService classTreeService;

    /** AS-IS icr.Icr01_ClassTree.selectByClassTreeId */
    @GetMapping
    public ApiResponse<List<IcrRuleRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId,
                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, classTreeId, searchText));
    }

    /** AS-IS icr.Icr01_ClassTree.refresh */
    @GetMapping("/{classTreeId}")
    public ApiResponse<IcrRuleRes> refresh(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(service.refresh(principal, classTreeId));
    }

    /** AS-IS icr.Icr01_ClassTree.update (그리드 저장) → 저장된 행들 */
    @PutMapping
    public ApiResponse<List<IcrRuleRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcrRuleSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS icr.Icr01_ClassTree.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> classTreeIds) {
        return ApiResponse.ok(service.delete(principal, classTreeIds));
    }

    /** AS-IS icr.Icr01_ClassTree.modelUpdate (Icr01_Lookup_Content 저장) */
    @PutMapping("/{classTreeId}/content")
    public ApiResponse<IcrRuleRes> updateContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                                 @RequestBody IcrRuleContentReq req) {
        return ApiResponse.ok(service.updateContent(principal, classTreeId, req));
    }

    /** AS-IS icr.Icr01_ClassTree.update (Icr01_Move_Grid: 내규의 상위 분류 이동) */
    @PutMapping("/{classTreeId}/parent")
    public ApiResponse<Void> move(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId, @RequestBody IcrClassTreeMoveReq req) {
        classTreeService.move(principal, classTreeId, req.parentTreeId());
        return ApiResponse.ok(null);
    }

    /** AS-IS sys.Sys10_File.delete (Icr01_Lookup_IcrFile 삭제 열) — sys10_file 행만 */
    @DeleteMapping("/{classTreeId}/files/{fileId}")
    public ApiResponse<Void> deleteFile(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId, @PathVariable Long fileId) {
        service.deleteFile(principal, classTreeId, fileId);
        return ApiResponse.ok(null);
    }
}
