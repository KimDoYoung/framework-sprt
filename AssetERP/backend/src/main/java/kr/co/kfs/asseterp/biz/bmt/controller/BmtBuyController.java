package kr.co.kfs.asseterp.biz.bmt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuyRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuySaveReq;
import kr.co.kfs.asseterp.biz.bmt.service.BmtBuyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 판촉물 구매 및 제공내역 (AS-IS Bmt01_Tab_Buy → server/bmt/Bmt01_Buy) */
@RestController
@RequestMapping("/api/v1/bmt/buys")
@RequiredArgsConstructor
public class BmtBuyController {

    private final BmtBuyService service;

    /** AS-IS bmt.Bmt01_Buy.selectByCompanyId — leftYn(재고없음 제외) */
    @GetMapping
    public ApiResponse<List<BmtBuyRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                               @RequestParam(defaultValue = "true") boolean leftYn) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, leftYn));
    }

    /** AS-IS bmt.Bmt01_Buy.update — 변경 행 목록 → 다시 읽은 행들(요청 순서) */
    @PutMapping
    public ApiResponse<List<BmtBuyRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BmtBuySaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS bmt.Bmt01_Buy.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> buyIds) {
        return ApiResponse.ok(service.delete(principal, buyIds));
    }
}
