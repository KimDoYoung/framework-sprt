package kr.co.kfs.asseterp.oms.biz.emp.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransSaveReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransHistoryRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransRes;
import kr.co.kfs.asseterp.oms.biz.emp.service.EmpTransService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
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

/** 발령 (AS-IS emp.Emp03_Trans) — 사원 Lookup, 사원정보 관리 일반발령 탭 */
@RestController
@RequestMapping("/api/v1/emp/trans")
@RequiredArgsConstructor
public class EmpTransController {

    private final EmpTransService empTransService;

    @GetMapping
    public ApiResponse<List<TransRes>> searchTrans(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate transDate,
            @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(empTransService.searchTrans(principal, searchText, transDate, companyId));
    }

    /** 사원의 발령 (최근 순) */
    @GetMapping("/persons/{personId}")
    public ApiResponse<List<EmpTransRes>> searchPersonTrans(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        return ApiResponse.ok(empTransService.searchPersonTrans(principal, personId));
    }

    /** 추가·변경된 발령 저장 → 사원의 발령 다시 조회 */
    @PutMapping
    public ApiResponse<List<EmpTransRes>> updateTrans(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<EmpTransSaveReq> rows) {
        return ApiResponse.ok(empTransService.updateTrans(principal, rows));
    }

    @DeleteMapping("/{transId}")
    public ApiResponse<Void> deleteTrans(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long transId) {
        empTransService.deleteTrans(principal, transId);
        return ApiResponse.ok(null);
    }

    /** 기간 내 발령 변경 (AS-IS Emp00_Tab_ChangeHistory 일반발령) */
    @GetMapping("/histories")
    public ApiResponse<List<TransHistoryRes>> searchHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
            @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(empTransService.searchHistory(principal, startDate, closeDate, searchText));
    }
}
