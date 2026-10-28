package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpJointLeaveService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 공동연차관리 (AS-IS Emp24_Tab_JointLeave) */
@RestController
@RequestMapping("/api/v1/emp/joint-leaves")
@RequiredArgsConstructor
public class EmpJointLeaveController {

    private final EmpJointLeaveService service;

    /** AS-IS emp.Emp24_JointLeave.selectByYear */
    @GetMapping
    public ApiResponse<List<JointLeaveRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdYear) {
        return ApiResponse.ok(service.search(principal, stdYear));
    }

    /** AS-IS emp.Emp24_JointLeave.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<JointLeaveRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<JointLeaveSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp24_JointLeave.deleteApprId + delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
