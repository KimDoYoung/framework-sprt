package kr.co.kfs.asseterp.biz.bbs.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsClassTreeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 게시판 분류/세부항목 (AS-IS server/bbs/Bbs30_ClassTree — Z13) */
@RestController
@RequestMapping("/api/v1/bbs/class-trees")
@RequiredArgsConstructor
public class BbsClassTreeController {

    private final BbsClassTreeService service;

    /** AS-IS bbs.Bbs30_ClassTree.selectByRoleUserTypeCode — 내가 볼 수 있는 세부항목 */
    @GetMapping("/mine")
    public ApiResponse<List<ClassTreeRes>> searchMine(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchMine(principal));
    }

    /** AS-IS bbs.Bbs30_ClassTree.selectByTypeCode(typeCode=C) / selectByParentTreeId(typeCode=T, parentTreeId) */
    @GetMapping
    public ApiResponse<List<ClassTreeRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String typeCode,
                                                  @RequestParam(required = false) Long parentTreeId) {
        return ApiResponse.ok(service.search(principal, typeCode, parentTreeId));
    }

    /** AS-IS bbs.Bbs30_ClassTree.update — 저장한 줄(요청과 같은 순서) */
    @PutMapping
    public ApiResponse<List<ClassTreeRes>> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody List<ClassTreeSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS bbs.Bbs30_ClassTree.delete */
    @DeleteMapping("/{classTreeId}")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(service.delete(principal, classTreeId));
    }

    /** AS-IS bbs.Bbs30_ClassTree.updateParentTreeId — [이동] */
    @PutMapping("/{classTreeId}/parent")
    public ApiResponse<Void> updateParent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId, @RequestParam Long parentTreeId) {
        service.updateParentTreeId(principal, classTreeId, parentTreeId);
        return ApiResponse.ok(null);
    }

    /** AS-IS bbs.Bbs30_ClassTree.updatePublicYn */
    @PutMapping("/{classTreeId}/public")
    public ApiResponse<Void> updatePublic(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId, @RequestParam boolean publicYn) {
        service.updatePublicYn(principal, classTreeId, publicYn);
        return ApiResponse.ok(null);
    }
}
