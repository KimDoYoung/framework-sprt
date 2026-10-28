package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpErrandService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 외출관리 (AS-IS Emp54_Tab_ErrandManager) */
@RestController
@RequestMapping("/api/v1/emp/errands")
@RequiredArgsConstructor
public class EmpErrandController {

    private final EmpErrandService service;

    /** AS-IS emp.Emp54_Errand.selectByManager */
    @GetMapping
    public ApiResponse<List<ErrandRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                               @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, searchText));
    }
}
