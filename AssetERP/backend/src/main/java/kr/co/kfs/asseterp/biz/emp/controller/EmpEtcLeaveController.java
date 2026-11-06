package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveApprIdReq;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveManageRes;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveManageSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpEtcLeaveService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 포상휴가관리 (AS-IS Emp22_Tab_EtcLeave) — `GET /etc-leaves`(사원별 보기)는 EmpLeaveController */
@RestController
@RequestMapping("/api/v1/emp/etc-leaves")
@RequiredArgsConstructor
public class EmpEtcLeaveController {

    private final EmpEtcLeaveService service;

    /** AS-IS emp.Emp22_EtcLeave.selectByDate */
    @GetMapping("/search")
    public ApiResponse<List<EtcLeaveManageRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                       @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, searchText));
    }

    /** AS-IS emp.Emp22_EtcLeave.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<EtcLeaveManageRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<EtcLeaveManageSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp22_EtcLeave.updateApprId (결재창 상신·저장 뒤, V17) */
    @PutMapping("/{etcLeaveId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long etcLeaveId, @RequestBody EtcLeaveApprIdReq req) {
        service.updateApprId(principal, etcLeaveId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp22_EtcLeave.deleteApprId + delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
