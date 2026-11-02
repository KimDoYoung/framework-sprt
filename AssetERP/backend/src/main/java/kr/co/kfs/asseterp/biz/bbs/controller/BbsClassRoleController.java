package kr.co.kfs.asseterp.biz.bbs.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassRoleRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassRoleSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsClassRoleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 게시판 분류 권한 (AS-IS server/bbs/Bbs33_Role — Z13) */
@RestController
@RequestMapping("/api/v1/bbs/class-trees/{classTreeId}/roles")
@RequiredArgsConstructor
public class BbsClassRoleController {

    private final BbsClassRoleService service;

    /** AS-IS bbs.Bbs33_Role.selectByClassTreeId */
    @GetMapping
    public ApiResponse<List<ClassRoleRes>> search(@PathVariable Long classTreeId) {
        return ApiResponse.ok(service.searchByClassTreeId(classTreeId));
    }

    /** AS-IS bbs.Bbs33_Role.checkRole — 내게 이 세부항목 권한이 있는가 */
    @GetMapping("/mine")
    public ApiResponse<Boolean> hasRole(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(service.hasRole(principal, classTreeId));
    }

    /** AS-IS bbs.Bbs33_Role.update — 저장한 줄 */
    @PutMapping
    public ApiResponse<List<ClassRoleRes>> save(@PathVariable Long classTreeId, @Valid @RequestBody List<ClassRoleSaveReq> rows) {
        return ApiResponse.ok(service.save(classTreeId, rows));
    }

    /** AS-IS bbs.Bbs33_Role.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@PathVariable Long classTreeId, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(classTreeId, ids));
    }
}
