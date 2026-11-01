package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MyUnLeaveApprIdReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyUnLeaveRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpMyUnLeaveService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 연월차휴가 지정통보 (AS-IS Emp21_Tab_PersonList, 메뉴 #1184) */
@RestController
@RequestMapping("/api/v1/emp/my-un-leaves")
@RequiredArgsConstructor
public class EmpMyUnLeaveController {

    private final EmpMyUnLeaveService service;

    /** AS-IS emp.Emp21_UnLeave.selectByPersonId */
    @GetMapping
    public ApiResponse<List<MyUnLeaveRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdYear) {
        return ApiResponse.ok(service.search(principal, stdYear));
    }

    /** AS-IS emp.Emp21_UnLeave.update (지정통보 결재문서 ID) */
    @PutMapping("/{unLeaveId}/expect-appr-id")
    public ApiResponse<Void> updateExpectApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long unLeaveId,
                                                @RequestBody MyUnLeaveApprIdReq req) {
        service.updateExpectApprId(principal, unLeaveId, req.apprId());
        return ApiResponse.ok(null);
    }
}
