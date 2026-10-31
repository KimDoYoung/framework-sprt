package kr.co.kfs.asseterp.biz.apr.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprWriteRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprWriteService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 전자결재 상신·임시저장 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc, V03) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprApprWriteController {

    private final AprApprWriteService service;

    /** AS-IS insertApproval의 DBUtil.setSeq — 새 문서를 열 때 문서 번호를 먼저 받는다 */
    @GetMapping("/new-id")
    public ApiResponse<Long> nextApprId() {
        return ApiResponse.ok(service.nextApprId());
    }

    /** AS-IS apr.Apr01_Appr.update ([저장] mode=save · [결재요청] mode=request) */
    @PutMapping("/{apprId}")
    public ApiResponse<AprApprWriteRes> save(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId,
                                             @RequestBody AprApprSaveReq req) {
        return ApiResponse.ok(service.save(principal, apprId, req));
    }

    /** AS-IS apr.Apr16_StampDoc.deleteByApprId + apr.Apr01_Appr.deleteByApprId ([삭제], 임시저장 문서) */
    @DeleteMapping("/{apprId}")
    public ApiResponse<AprApprWriteRes> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.delete(principal, apprId));
    }
}
