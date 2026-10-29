package kr.co.kfs.asseterp.biz.bmt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtEmpIctRes;
import kr.co.kfs.asseterp.biz.bmt.service.BmtEmpIctService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 임직원 정보통신수단 (AS-IS Bmt12_Tab_EmpIct → server/bmt/Bmt12_PcHistory) */
@RestController
@RequestMapping("/api/v1/bmt/emp-icts")
@RequiredArgsConstructor
public class BmtEmpIctController {

    private final BmtEmpIctService service;

    /** AS-IS bmt.Bmt12_PcHistory.selectEmpICT */
    @GetMapping
    public ApiResponse<List<BmtEmpIctRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                  @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, stdDate, searchText));
    }

    /** AS-IS sys.Sys99_Print.insertRdEmplct → 출력 그룹 ID */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                       @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.insertRdPrint(principal, stdDate, searchText));
    }
}
