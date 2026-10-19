package kr.co.kfs.asseterp.biz.apr.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.apr.dto.AprDownloadHistoryRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDownloadHistorySaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprDownloadHistoryService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
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

/** 문서 다운로드 기록 (AS-IS server/apr/Apr40_DownloadHistory) */
@RestController
@RequestMapping("/api/v1/apr/download-histories")
@RequiredArgsConstructor
public class AprDownloadHistoryController {

    private final AprDownloadHistoryService service;

    /** AS-IS apr.Apr40_DownloadHistory.selectByTextPaging (Apr40_Lookup_DownloadHistory). 검색어는 서버가 %…%로 */
    @GetMapping
    public ApiResponse<PageRes<AprDownloadHistoryRes>> searchByText(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                    @RequestParam(defaultValue = "") String searchText,
                                                                    @RequestParam long offset,
                                                                    @RequestParam long limit) {
        return ApiResponse.ok(service.searchByText(principal, startDate, closeDate, searchText, offset, limit));
    }

    /** AS-IS apr.Apr40_DownloadHistory.updateList (Dcr00_Tab_ApprList.insertHistory) */
    @PostMapping
    public ApiResponse<Void> createList(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody AprDownloadHistorySaveReq req) {
        service.createList(principal, req.apprIds());
        return ApiResponse.ok(null);
    }
}
