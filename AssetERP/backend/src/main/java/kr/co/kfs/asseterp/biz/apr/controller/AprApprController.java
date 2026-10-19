package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/** 상신문서 (AS-IS server/apr/Apr01_Appr) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprApprController {

    private final AprApprService service;

    /** AS-IS apr.Apr01_Appr.selectByPaging (Dcr01_Tab_DcrWrite 문서작성 목록, 페이징) */
    @GetMapping("/dcr-write")
    public ApiResponse<PageRes<AprDcrWriteRes>> searchDcrWrite(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                               @RequestParam(defaultValue = "") String searchText,
                                                               @RequestParam(defaultValue = "") String receiveName,
                                                               @RequestParam(required = false) Long classTreeId,
                                                               @RequestParam(defaultValue = "0") long offset,
                                                               @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchDcrWrite(principal, startDate, closeDate, searchText, receiveName, classTreeId, offset, limit));
    }
}
