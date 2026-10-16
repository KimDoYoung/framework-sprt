package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveSettingReq;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveSettingRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveYearRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveYearSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysLeaveYearService;
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

/** 연차휴가 결산기준 (AS-IS Sys30_Tab_LeaveYear → server/sys/Sys30_LeaveYear, Sys01_Company) */
@RestController
@RequestMapping("/api/v1/sys/leave-years")
@RequiredArgsConstructor
public class SysLeaveYearController {

    private final SysLeaveYearService service;

    /** AS-IS sys.Sys01_Company.selectById(휴가초과허용여부·휴가결산월) */
    @GetMapping("/setting")
    public ApiResponse<LeaveSettingRes> getSetting(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getSetting(principal));
    }

    /** AS-IS sys.Sys01_Company.update */
    @PutMapping("/setting")
    public ApiResponse<LeaveSettingRes> updateSetting(@AuthenticationPrincipal UserPrincipal principal, @RequestBody LeaveSettingReq req) {
        return ApiResponse.ok(service.updateSetting(principal, req));
    }

    /** AS-IS sys.Sys30_LeaveYear.selectByAll */
    @GetMapping
    public ApiResponse<List<LeaveYearRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS sys.Sys30_LeaveYear.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<LeaveYearRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<LeaveYearSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys30_LeaveYear.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
