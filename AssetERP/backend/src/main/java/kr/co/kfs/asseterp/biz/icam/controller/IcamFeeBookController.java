package kr.co.kfs.asseterp.biz.icam.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookCheckReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookCheckRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamFeeBookService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** ICAM 펀드보수 월말잔액 (AS-IS Icam12_Tab_OfficeMngFeeBook → server/icam/Icam12_FeeBook · Icam13_FeeBookCheck) — 메뉴 #1200 */
@RestController
@RequestMapping("/api/v1/icam/fee-books")
@RequiredArgsConstructor
public class IcamFeeBookController {

    private final IcamFeeBookService service;

    /** AS-IS icam.Icam12_FeeBook.selectByStdDatePaging — 페이지 행 + 전체 건수 */
    @GetMapping
    public ApiResponse<PageRes<IcamFeeBookRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                       @RequestParam(defaultValue = "") String searchText,
                                                       @RequestParam(required = false) String fundCode,
                                                       @RequestParam(defaultValue = "0") int offset,
                                                       @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(service.search(principal, stdDate, searchText, fundCode, offset, limit));
    }

    /** AS-IS icam.Icam13_FeeBookCheck.selectByStdDate — 대사 결과 */
    @GetMapping("/checks")
    public ApiResponse<List<IcamFeeBookCheckRes>> searchChecks(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchChecks(principal, stdDate));
    }

    /** AS-IS icam.Icam13_FeeBookCheck.checkFeeBook — ICAM 월말잔액 대사 (외부 ICAM DB 연동이 없어 서버가 거절) */
    @PostMapping("/checks")
    public ApiResponse<Void> check(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody IcamFeeBookCheckReq req) {
        service.checkFeeBook(principal, req.stdDate());
        return ApiResponse.ok(null);
    }
}
