package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprAltApprService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 대결자 지정 (AS-IS Apr07_Tab_AltAppr → server/apr/Apr07_AltAppr) */
@RestController
@RequestMapping("/api/v1/apr/alt-apprs")
@RequiredArgsConstructor
public class AprAltApprController {

    private final AprAltApprService service;

    /** AS-IS apr.Apr07_AltAppr.selectByEmpId */
    @GetMapping
    public ApiResponse<List<AprAltApprRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS apr.Apr07_AltAppr.notAltApprIdList + update → 저장된 행 */
    @PutMapping
    public ApiResponse<List<AprAltApprRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AprAltApprSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS apr.Apr07_AltAppr.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
