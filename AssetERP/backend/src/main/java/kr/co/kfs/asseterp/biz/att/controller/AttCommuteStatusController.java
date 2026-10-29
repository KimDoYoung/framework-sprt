package kr.co.kfs.asseterp.biz.att.controller;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteStatusRes;
import kr.co.kfs.asseterp.biz.att.service.AttCommuteStatusService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 근태현황 (AS-IS Att02_Tab_CommuteStatus #1487 · Att02_Tab_PersonStatus #1492 → server/att/Att02_Commute) */
@RestController
@RequestMapping("/api/v1/att/commutes")
@RequiredArgsConstructor
public class AttCommuteStatusController {

    private final AttCommuteStatusService service;

    /** AS-IS att.Att02_Commute.getCommuteStatus (근태현황(관리자)) */
    @GetMapping("/status")
    public ApiResponse<List<AttCommuteStatusRes>> getCommuteStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                                   @RequestParam(required = false) Long personId,
                                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                                                   @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.getCommuteStatus(principal, personId, baseDate, searchText));
    }

    /** AS-IS att.Att02_Commute.getPersonStatus (근태현황 — 로그인 사원 본인) */
    @GetMapping("/person-status")
    public ApiResponse<List<AttCommuteStatusRes>> getPersonStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.getPersonStatus(principal, startDate, closeDate));
    }
}
