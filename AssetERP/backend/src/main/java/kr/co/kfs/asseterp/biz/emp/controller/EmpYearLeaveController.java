package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.YearLeaveRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpYearLeaveService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 연월차휴가 현황 (AS-IS Emp20_Tab_YearList) — monthStdDateType: 1 현재 · 2 기준연도말 · 3 특정일, retireType: 100 재직 · 900 퇴직 · 000 전체 */
@RestController
@RequestMapping("/api/v1/emp/year-leaves")
@RequiredArgsConstructor
public class EmpYearLeaveController {

    private final EmpYearLeaveService service;

    /** AS-IS emp.Emp01_Person.selectByYearList */
    @GetMapping
    public ApiResponse<List<YearLeaveRes>> searchYearList(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam String stdYear,
                                                          @RequestParam String monthStdDateType,
                                                          @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                          @RequestParam String retireType) {
        return ApiResponse.ok(service.searchYearList(principal, stdYear, monthStdDateType, stdDate, retireType));
    }

    /** AS-IS sys.Sys99_Print.insertRdYearList → rdGroupId */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam String stdYear,
                                       @RequestParam String monthStdDateType,
                                       @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                       @RequestParam String retireType) {
        return ApiResponse.ok(service.insertRdPrint(principal, stdYear, monthStdDateType, stdDate, retireType));
    }
}
