package kr.co.kfs.asseterp.biz.apr.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampApplAddReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampApplEditRes;
import kr.co.kfs.asseterp.biz.apr.service.AprStampApplService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 상신 문서창 날인신청 탭 (AS-IS Apr16_Grid_StampDoc · Apr16_Grid_StampApplList · Apr16_Lookup_StampApplQty, V14) */
@RestController
@RequestMapping("/api/v1/apr/apprs/{apprId}/stamp-docs")
@RequiredArgsConstructor
public class AprStampApplController {

    private final AprStampApplService service;

    /** AS-IS apr.Apr16_StampDoc.selectByApprId + selectProvideCoByApprId + apr.Apr04_ApprStep.checkApprId */
    @GetMapping
    public ApiResponse<AprStampApplEditRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.get(principal, apprId));
    }

    /** AS-IS apr.Apr16_StampDoc.modelUpdate — 새 줄 번호 */
    @PostMapping
    public ApiResponse<Long> add(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprStampApplAddReq req) {
        return ApiResponse.ok(service.add(principal, apprId, req));
    }

    /** AS-IS apr.Apr16_StampDoc.delete */
    @DeleteMapping("/{stampDocId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @PathVariable Long stampDocId) {
        service.delete(principal, apprId, stampDocId);
        return ApiResponse.ok(null);
    }
}
