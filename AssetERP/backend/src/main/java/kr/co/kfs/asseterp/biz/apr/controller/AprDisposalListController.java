package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListRes;
import kr.co.kfs.asseterp.biz.apr.service.AprDisposalListService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 폐기문서 신청현황 (AS-IS Apr90_Tab_DisposalList → server/apr/Apr90_DisposalList) */
@RestController
@RequestMapping("/api/v1/apr/disposal-lists")
@RequiredArgsConstructor
public class AprDisposalListController {

    private final AprDisposalListService service;

    /** AS-IS apr.Apr90_DisposalList.selectByPersonId — 내가 신청한 폐기문서 */
    @GetMapping("/mine")
    public ApiResponse<List<AprDisposalListRes>> searchMine(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.searchByPerson(principal, startDate, closeDate));
    }
}
