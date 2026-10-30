package kr.co.kfs.asseterp.biz.apr.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprActionRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprActionStateRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprCancelReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprConfirmReq;
import kr.co.kfs.asseterp.biz.apr.service.AprApprActionService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 전자결재 결재 처리 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc, V02) */
@RestController
@RequestMapping("/api/v1/apr/apprs/{apprId}")
@RequiredArgsConstructor
public class AprApprActionController {

    private final AprApprActionService service;

    /** AS-IS retrieveApproval/myTurnCheck/myCancelApprovalCheck — 이 사원에게 켜질 [승인][반려] / [승인취소] / [상신취소] */
    @GetMapping("/action-state")
    public ApiResponse<AprApprActionStateRes> getState(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getState(principal, apprId));
    }

    /** AS-IS apr.Apr04_ApprStep.confirmCheck ([승인]·[반려]를 누른 직후, 의견 창을 열기 전) */
    @PostMapping("/confirm-check")
    public ApiResponse<AprApprActionRes> confirmCheck(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.confirmCheck(principal, apprId));
    }

    /** AS-IS apr.Apr04_ApprStep.confirmCheck + confirmUpdate ([승인]·[반려]) */
    @PostMapping("/confirm")
    public ApiResponse<AprApprActionRes> confirm(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId,
                                                 @RequestBody AprApprConfirmReq req) {
        return ApiResponse.ok(service.confirm(principal, apprId, req.action(), req.message()));
    }

    /** AS-IS apr.Apr04_ApprStep.nextTurnCheck + clearApprStepId ([승인취소]) */
    @PostMapping("/cancel-approval")
    public ApiResponse<AprApprActionRes> cancelApproval(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.cancelApproval(principal, apprId));
    }

    /** AS-IS apr.Apr04_ApprStep.cancelCheck + Apr92_ApprModi.deleteByApprId + cancelUpdate ([상신취소]), 특정 화면 상신 문서는 폐기 */
    @PostMapping("/cancel-request")
    public ApiResponse<AprApprActionRes> cancelRequest(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId,
                                                       @RequestBody AprApprCancelReq req) {
        return ApiResponse.ok(service.cancelRequest(principal, apprId, req.confirmed()));
    }
}
