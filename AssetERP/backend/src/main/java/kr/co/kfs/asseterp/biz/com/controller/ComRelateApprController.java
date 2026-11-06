package kr.co.kfs.asseterp.biz.com.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.ComRelateApprRes;
import kr.co.kfs.asseterp.biz.com.dto.ComRelateApprSaveReq;
import kr.co.kfs.asseterp.biz.com.service.ComRelateApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 증빙자료 창 (AS-IS server/com/Com01_RelateAppr — 화면 Com01_Lookup_RelateAppr, EE34) */
@RestController
@RequestMapping("/api/v1/com/relate-apprs")
@RequiredArgsConstructor
public class ComRelateApprController {

    private final ComRelateApprService service;

    /** AS-IS com.Com01_RelateAppr.selectByKeyTableId */
    @GetMapping
    public ApiResponse<List<ComRelateApprRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long keyTableId) {
        return ApiResponse.ok(service.search(principal, keyTableId));
    }

    /** AS-IS com.Com01_RelateAppr.modelUpdate / listUpdate → 넣은 행 수 */
    @PostMapping
    public ApiResponse<Integer> add(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ComRelateApprSaveReq req) {
        return ApiResponse.ok(service.add(principal, req));
    }

    /** AS-IS com.Com01_RelateAppr.delete → 지운 행 수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> relateApprIds) {
        return ApiResponse.ok(service.delete(principal, relateApprIds));
    }

    /** [신규문서 작성] 단추를 둘 회사인가 (erpProductCode != S1) */
    @GetMapping("/appr-button")
    public ApiResponse<Boolean> apprButton(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.apprButtonEnabled(principal));
    }

    /** AS-IS apr.Apr01_Appr.permissionsCheck — 상세보기 열람권한 */
    @GetMapping("/{apprId}/permission")
    public ApiResponse<Boolean> permission(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.canView(principal, apprId));
    }
}
