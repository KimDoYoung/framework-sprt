package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveCheckRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveDaysRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveApprIdReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveCodesRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveOverRequestReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpMyLeaveService;
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

/** 휴가신청 (AS-IS Emp20_Tab_Leave, 메뉴 #1032) */
@RestController
@RequestMapping("/api/v1/emp/my-leaves")
@RequiredArgsConstructor
public class EmpMyLeaveController {

    private final EmpMyLeaveService service;

    /** AS-IS emp.Emp20_Leave.selectByPersonId (본인, managerYn=false) */
    @GetMapping
    public ApiResponse<List<MyLeaveRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdYear) {
        return ApiResponse.ok(service.search(principal, stdYear));
    }

    /** AS-IS emp.Emp20_Leave.selectByDays + emp.Emp22_EtcLeave.selectByDays (apprCheckYn=false) */
    @GetMapping("/days")
    public ApiResponse<LeaveDaysRes> getDays(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdYear) {
        return ApiResponse.ok(service.getDays(principal, stdYear));
    }

    /** AS-IS sys.Sys00_Common.selectLeaveCode · selectSpcLeaveCode */
    @GetMapping("/codes")
    public ApiResponse<MyLeaveCodesRes> getCodes(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getCodes(principal));
    }

    /** AS-IS emp.Emp20_Leave.count (calcCode 1이면 countByDate) */
    @GetMapping("/count")
    public ApiResponse<Double> count(@AuthenticationPrincipal UserPrincipal principal,
                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                     @RequestParam String leaveCode, @RequestParam(required = false) String calcCode) {
        return ApiResponse.ok(service.count(principal, startDate, closeDate, leaveCode, calcCode));
    }

    /** AS-IS emp.Emp22_EtcLeave.selectByEtcLeaveId */
    @GetMapping("/etc-leaves/{etcLeaveId}")
    public ApiResponse<EtcLeaveCheckRes> getEtcLeave(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long etcLeaveId,
                                                     @RequestParam(required = false) Long leaveId) {
        return ApiResponse.ok(service.getEtcLeaveCheck(principal, etcLeaveId, leaveId));
    }

    /** AS-IS emp.Emp20_Leave.selectById */
    @GetMapping("/{leaveId}")
    public ApiResponse<MyLeaveRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long leaveId) {
        return ApiResponse.ok(service.get(principal, leaveId));
    }

    /** AS-IS emp.Emp20_Leave.update (UpdateDataModel) → 저장한 행 */
    @PutMapping
    public ApiResponse<MyLeaveRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MyLeaveSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS emp.Emp20_Leave.update (결재문서 ID) */
    @PutMapping("/{leaveId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long leaveId,
                                          @RequestBody MyLeaveApprIdReq req) {
        service.updateApprId(principal, leaveId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr07_AltAppr.selectByLeaveId — 대결자 지정 내역이 있는가 */
    @GetMapping("/{leaveId}/alt-appr")
    public ApiResponse<Boolean> hasAltAppr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long leaveId) {
        return ApiResponse.ok(service.hasAltAppr(principal, leaveId));
    }

    /** AS-IS Sms02_History.sendMessage + emp.Emp20_Leave.updateOverConfirm (초과사용 승인요청) */
    @PutMapping("/{leaveId}/over-confirm-request")
    public ApiResponse<MyLeaveRes> requestOverConfirm(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long leaveId,
                                                      @RequestBody MyLeaveOverRequestReq req) {
        return ApiResponse.ok(service.requestOverConfirm(principal, leaveId, req.confirmerId()));
    }

    /** AS-IS emp.Emp20_Leave.delete (+ apr.Apr07_AltAppr.deleteByLeaveId) */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> ids,
                                    @RequestParam(defaultValue = "false") boolean deleteAltAppr) {
        service.delete(principal, ids, deleteAltAppr);
        return ApiResponse.ok(null);
    }
}
