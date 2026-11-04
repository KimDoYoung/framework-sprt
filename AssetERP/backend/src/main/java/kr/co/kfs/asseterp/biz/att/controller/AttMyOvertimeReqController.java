package kr.co.kfs.asseterp.biz.att.controller;

import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeInfoRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeReqRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeSaveReq;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeSettingsRes;
import kr.co.kfs.asseterp.biz.att.service.AttMyOvertimeReqService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 연장근무신청 창 (AS-IS Att03_Lookup_OvertimeReq → server/att/Att03_OvertimeReq). 내 신청만 다룬다 */
@RestController
@RequestMapping("/api/v1/att/overtime-reqs/me")
@RequiredArgsConstructor
public class AttMyOvertimeReqController {

    private final AttMyOvertimeReqService service;

    /** AS-IS att.Att03_OvertimeReq.selectByPersonId */
    @GetMapping
    public ApiResponse<List<AttMyOvertimeReqRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(service.search(principal, baseDate));
    }

    /** AS-IS att.Att03_OvertimeReq.selectByYearMonth — 신청이 있는 근무일자(yyyy-MM-dd) */
    @GetMapping("/work-dates")
    public ApiResponse<List<String>> workDates(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyyMM) {
        return ApiResponse.ok(service.workDates(principal, yyyyMM));
    }

    /** AS-IS att.Att03_OvertimeReq.getInfo */
    @GetMapping("/info")
    public ApiResponse<AttMyOvertimeInfoRes> info(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(service.info(principal, baseDate));
    }

    /** AS-IS att.Att01_WorkPolicy.getModel + pay.Pay34_WorkTimeConfig.getModel + att.Att05_PmWork.getWorkDateInfo */
    @GetMapping("/settings")
    public ApiResponse<AttMyOvertimeSettingsRes> settings(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(service.settings(principal, baseDate));
    }

    /** AS-IS 창의 updateChk01~02 + att.Att03_OvertimeReq.checkWeekMaxTime·delete·update */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AttMyOvertimeSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS att.Att03_OvertimeReq.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS Att03_Lookup_OvertimeReq.updateApprId — 상신 문서 ID 기록 */
    @PutMapping("/{overtimeReqId}/appr")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long overtimeReqId, @RequestParam Long apprId) {
        service.updateApprId(principal, overtimeReqId, apprId);
        return ApiResponse.ok(null);
    }
}
