package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeavePersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeavePersonSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpEtcLeavePersonService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 포상휴가 대상 직원 (AS-IS Emp23_EtcLeavePerson) */
@RestController
@RequestMapping("/api/v1/emp/etc-leave-persons")
@RequiredArgsConstructor
public class EmpEtcLeavePersonController {

    private final EmpEtcLeavePersonService service;

    /** AS-IS emp.Emp23_EtcLeavePerson.selectByEtcLeaveId */
    @GetMapping
    public ApiResponse<List<EtcLeavePersonRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long etcLeaveId) {
        return ApiResponse.ok(service.search(principal, etcLeaveId));
    }

    /** AS-IS emp.Emp23_EtcLeavePerson.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<EtcLeavePersonRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<EtcLeavePersonSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp23_EtcLeavePerson.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
