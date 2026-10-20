package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpApprStepExceptRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpApprStepExceptSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpApprStepExceptService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 결재선 예외처리 (AS-IS Emp30_Tab_ApprStepExcept → server/emp/Emp30_ApprStepExcept, G10) */
@RestController
@RequestMapping("/api/v1/emp/appr-step-excepts")
@RequiredArgsConstructor
public class EmpApprStepExceptController {

    private final EmpApprStepExceptService service;

    /** AS-IS emp.Emp30_ApprStepExcept.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<EmpApprStepExceptRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS emp.Emp30_ApprStepExcept.update → 저장된 행 */
    @PutMapping
    public ApiResponse<List<EmpApprStepExceptRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<EmpApprStepExceptSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp30_ApprStepExcept.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
