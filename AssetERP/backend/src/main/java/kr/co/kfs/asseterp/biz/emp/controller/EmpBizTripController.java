package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpBizTripService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 출장관리 (AS-IS Emp53_Tab_BizTripManager) */
@RestController
@RequestMapping("/api/v1/emp/biz-trips")
@RequiredArgsConstructor
public class EmpBizTripController {

    private final EmpBizTripService service;

    /** AS-IS emp.Emp53_BizTrip.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<BizTripRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                @RequestParam(defaultValue = "true") boolean resultSkipYn,
                                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, resultSkipYn, searchText));
    }

    /** AS-IS emp.Emp53_BizTrip.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<BizTripRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizTripSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }
}
