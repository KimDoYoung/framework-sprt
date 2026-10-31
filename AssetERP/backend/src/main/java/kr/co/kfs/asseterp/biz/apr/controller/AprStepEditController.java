package kr.co.kfs.asseterp.biz.apr.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRecentDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRetouchReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepEmpRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepLineReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepPosRes;
import kr.co.kfs.asseterp.biz.apr.service.AprStepEditService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 전자결재 결재선 설정 창 (AS-IS client/vi/apr/Apr04_Edit_ApprStep, V07) */
@RestController
@RequestMapping("/api/v1/apr/step-lines")
@RequiredArgsConstructor
public class AprStepEditController {

    private final AprStepEditService service;

    /** AS-IS emp.Emp00_TransInfo.selectByText(mode=text) · selectByOrgCodeId(org) · getTransDate(all) · getOrgCodeId(orgDown) */
    @GetMapping("/emps")
    public ApiResponse<List<AprStepEmpRes>> emps(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(defaultValue = "text") String mode,
                                                 @RequestParam(required = false) String searchText,
                                                 @RequestParam(required = false) Long orgCodeId,
                                                 @RequestParam(defaultValue = "false") boolean includeYn) {
        return ApiResponse.ok(service.emps(principal, mode, searchText, orgCodeId, includeYn));
    }

    /** AS-IS insertApprovalEmp — 고른 사원으로 결재선 줄 만들기 */
    @PostMapping("/lines")
    public ApiResponse<List<AprNewStepRes>> lines(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AprStepLineReq req) {
        return ApiResponse.ok(service.lines(principal, req));
    }

    /** AS-IS arrayPosCode — 직급순 재정렬에 쓰는 직위 코드 */
    @PostMapping("/pos-codes")
    public ApiResponse<List<AprStepPosRes>> posCodes(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> personIds) {
        return ApiResponse.ok(service.posCodes(principal, personIds));
    }

    /** AS-IS apprStepLockYnChk — 회사 결재선 잠금 여부 */
    @GetMapping("/lock")
    public ApiResponse<Boolean> locked(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.locked(principal));
    }

    /** AS-IS apr.Apr01_Appr.selectByWeek(mode=week) · selectByDcrGroup(group) — 최근결재선 불러오기 창의 문서 목록 */
    @GetMapping("/recent-docs")
    public ApiResponse<List<AprRecentDocRes>> recentDocs(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(defaultValue = "week") String mode,
                                                         @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.recentDocs(principal, mode, searchText));
    }

    /** AS-IS apr.Apr04_ApprStep.getApprStepList + recentLoad — 고른 문서의 결재선(상신자 제외)을 지금 재직 정보로 */
    @GetMapping("/recent-docs/{apprId}/lines")
    public ApiResponse<List<AprNewStepRes>> recentLines(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.recentLines(principal, apprId));
    }

    /** AS-IS apr.Apr04_ApprStep.updateList — 결재중 문서의 결재선 수정 */
    @PutMapping("/apprs/{apprId}")
    public ApiResponse<AprApprWriteRes> retouch(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprRetouchReq req) {
        return ApiResponse.ok(service.retouch(principal, apprId, req));
    }
}
