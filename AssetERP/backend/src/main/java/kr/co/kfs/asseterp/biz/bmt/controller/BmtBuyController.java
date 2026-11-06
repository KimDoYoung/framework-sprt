package kr.co.kfs.asseterp.biz.bmt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuyRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuySaveReq;
import kr.co.kfs.asseterp.biz.bmt.service.BmtBuyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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

    /** A04 상신 뒤 결재문서 ID 기록 — AS-IS Bmt01_Tab_Buy.updateApprId (bmt.Bmt01_Buy.update) */
    @PutMapping("/{buyId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long buyId, @RequestBody ApprIdReq req) {
        service.updateApprId(principal, buyId, req.apprId());
        return ApiResponse.ok(null);
    }

    public record ApprIdReq(Long apprId) {
    }
}
