package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.FundOperateStatusDetailRes;
import kr.co.kfs.asseterp.biz.icam.dto.FundOperateStatusPrintReq;
import kr.co.kfs.asseterp.biz.icam.dto.FundOperateStatusRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamFundOperateStatusService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/icam/fund-operate-status")
@RequiredArgsConstructor
public class IcamFundOperateStatusController {

    private final IcamFundOperateStatusService service;

    @GetMapping
    public ApiResponse<List<FundOperateStatusRes>> search(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
            @RequestParam(required = false) String fundType,
            @RequestParam(required = false) String searchText
    ) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, fundType, searchText));
    }

    @GetMapping("/details")
    public ApiResponse<List<FundOperateStatusDetailRes>> searchDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
            @RequestParam(required = false) String fundType,
            @RequestParam(required = false) String searchText
    ) {
        return ApiResponse.ok(service.searchDetails(principal, stdDate, fundType, searchText));
    }

    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody FundOperateStatusPrintReq req
    ) {
        return ApiResponse.ok(service.insertRdPrint(principal, req));
    }
}
