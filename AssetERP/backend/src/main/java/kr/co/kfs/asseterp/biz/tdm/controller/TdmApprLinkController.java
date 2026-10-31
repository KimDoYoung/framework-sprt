package kr.co.kfs.asseterp.biz.tdm.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmApprLinkIdReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmCheckApprLinkReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmWorkDateReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmApprLinkService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 책무 결재 상신(A90·A91·A92·A94, V34) 뒤 결재문서 번호 기록 */
@RestController
@RequestMapping("/api/v1/tdm")
@RequiredArgsConstructor
public class TdmApprLinkController {

    private final TdmApprLinkService service;

    /** A90 Tdm34_TabPage_RoleAllcDetail.updateApprId */
    @PutMapping("/role-allc-details/{roleAllcDetailId}/appr-id")
    public ApiResponse<Void> roleAllcDetailApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleAllcDetailId,
                                                  @RequestBody @Valid TdmApprLinkIdReq req) {
        service.updateRoleAllcDetailApprId(principal, roleAllcDetailId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** A91 Tdm31_Tab_RoleDesc.updateApprId */
    @PutMapping("/role-descs/{roleDescId}/appr-id")
    public ApiResponse<Void> roleDescApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDescId,
                                            @RequestBody @Valid TdmApprLinkIdReq req) {
        service.updateRoleDescApprId(principal, roleDescId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** A91 Tdm31_Tab_RoleDesc 결재요청 아이콘의 updateWorkDate(99) / rollBackWorkDate(10) */
    @PutMapping("/role-descs/{roleDescId}/work-date")
    public ApiResponse<Void> roleDescWorkDate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDescId,
                                              @RequestBody TdmWorkDateReq req) {
        service.updateRoleDescWorkDate(principal, roleDescId, req.on());
        return ApiResponse.ok(null);
    }

    /** A92 Tdm32_Tab_RoleDigm 결재요청 아이콘의 파일 구분 정하기(upsertByRoleDigmId·updateUseFileType) — 정한 구분("1" 시스템 생성·"2" 올린 파일)을 돌려준다 */
    @PutMapping("/role-digms/{roleDigmId}/use-file-type")
    public ApiResponse<String> roleDigmUseFileType(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDigmId) {
        return ApiResponse.ok(service.readyRoleDigmAppr(principal, roleDigmId));
    }

    /** A92 Tdm32_Tab_RoleDigm.updateApprId */
    @PutMapping("/role-digms/{roleDigmId}/appr-id")
    public ApiResponse<Void> roleDigmApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDigmId,
                                            @RequestBody @Valid TdmApprLinkIdReq req) {
        service.updateRoleDigmApprId(principal, roleDigmId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** A94 Tdm50_TabPage_CheckJob.insertApprId */
    @PostMapping("/check-jobs/{chckJobId}/relate-appr")
    public ApiResponse<Void> checkRelateAppr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckJobId,
                                             @RequestBody @Valid TdmCheckApprLinkReq req) {
        service.insertCheckRelateAppr(principal, chckJobId, req.roleId(), req.apprId());
        return ApiResponse.ok(null);
    }
}
