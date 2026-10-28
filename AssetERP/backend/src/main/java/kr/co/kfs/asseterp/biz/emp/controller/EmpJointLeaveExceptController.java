package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveExceptRes;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveExceptSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpJointLeaveExceptService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 공동연차 제외사원 (AS-IS Emp28_JointLeaveExcept) */
@RestController
@RequestMapping("/api/v1/emp/joint-leave-excepts")
@RequiredArgsConstructor
public class EmpJointLeaveExceptController {

    private final EmpJointLeaveExceptService service;

    /** AS-IS emp.Emp28_JointLeaveExcept.selectByJointLeaveId */
    @GetMapping
    public ApiResponse<List<JointLeaveExceptRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long jointLeaveId) {
        return ApiResponse.ok(service.search(principal, jointLeaveId));
    }

    /** AS-IS emp.Emp28_JointLeaveExcept.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<JointLeaveExceptRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<JointLeaveExceptSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp28_JointLeaveExcept.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
