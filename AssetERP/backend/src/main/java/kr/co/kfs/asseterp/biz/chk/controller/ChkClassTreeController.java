package kr.co.kfs.asseterp.biz.chk.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.chk.dto.ChkClassTreeRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.chk.service.ChkClassTreeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 일일점검내역 분류(관리자) (AS-IS Chk01_Tab_ClassTree·Chk01_Edit_ClassTree → server/chk/Chk01_ClassTree) — 메뉴 #1244 */
@RestController
@RequestMapping("/api/v1/chk/class-trees")
@RequiredArgsConstructor
public class ChkClassTreeController {

    private final ChkClassTreeService service;

    /** AS-IS chk.Chk01_ClassTree.selectByAll */
    @GetMapping
    public ApiResponse<List<ChkClassTreeRes>> searchTree() {
        return ApiResponse.ok(service.searchTree());
    }

    /** AS-IS chk.Chk01_ClassTree.selectByLinkCode (E07) — 없으면 data null */
    @GetMapping("/link/{linkCode}")
    public ApiResponse<ChkClassTreeRes> getByLinkCode(@PathVariable String linkCode) {
        return ApiResponse.ok(service.getByLinkCode(linkCode));
    }

    /** AS-IS chk.Chk01_ClassTree.selectByCompanyId (E07) — Chk01_Lookup_ClassTree */
    @GetMapping("/by-company")
    public ApiResponse<List<ChkClassTreeRes>> searchTreeByCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestParam(required = false) Long parentTreeId) {
        return ApiResponse.ok(service.searchTreeByCompany(principal, parentTreeId));
    }

    /** AS-IS chk.Chk01_ClassTree.update (새 분류) → 저장된 행 */
    @PostMapping
    public ApiResponse<ChkClassTreeRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChkClassTreeSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS chk.Chk01_ClassTree.update (수정) → 저장된 행 */
    @PutMapping("/{classTreeId}")
    public ApiResponse<ChkClassTreeRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                               @RequestBody ChkClassTreeSaveReq req) {
        return ApiResponse.ok(service.update(principal, classTreeId, req));
    }

    /** AS-IS chk.Chk01_ClassTree.delete → 지운 건수 */
    @DeleteMapping("/{classTreeId}")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(service.delete(principal, classTreeId));
    }
}
