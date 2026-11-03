package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupMemberRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupMemberSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprApprStepGroupMemberService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 결재선 지정그룹 멤버 (AS-IS Apr31_Page_ApprStepGroupMember → server/apr/Apr31_ApprStepGroupMember) */
@RestController
@RequestMapping("/api/v1/apr/appr-step-group-members")
@RequiredArgsConstructor
public class AprApprStepGroupMemberController {

    private final AprApprStepGroupMemberService service;

    /** AS-IS apr.Apr31_ApprStepGroupMember.selectByApprStepGroupId */
    @GetMapping
    public ApiResponse<List<AprApprStepGroupMemberRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long apprStepGroupId) {
        return ApiResponse.ok(service.search(principal, apprStepGroupId));
    }

    /** AS-IS apr.Apr31_ApprStepGroupMember.update — 요청 순서가 결재 순서 */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long apprStepGroupId,
                                  @RequestBody List<AprApprStepGroupMemberSaveReq> rows) {
        service.save(principal, apprStepGroupId, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr31_ApprStepGroupMember.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
