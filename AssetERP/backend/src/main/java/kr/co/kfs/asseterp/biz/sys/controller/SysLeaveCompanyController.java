package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveCompanyRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveCompanySaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysLeaveCompanyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 휴가기준관리 (AS-IS Sys31_Lookup_LeaveCompany → server/sys/Sys31_LeaveCompany) */
@RestController
@RequestMapping("/api/v1/sys/leave-companies")
@RequiredArgsConstructor
public class SysLeaveCompanyController {

    private final SysLeaveCompanyService service;

    /** AS-IS sys.Sys31_LeaveCompany.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<LeaveCompanyRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS sys.Sys31_LeaveCompany.update → 저장 건수 */
    @PutMapping
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<LeaveCompanySaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }
}
