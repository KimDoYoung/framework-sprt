package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizDocClassRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoAccountReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoNoteReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoUpdateReq;
import kr.co.kfs.asseterp.biz.biz.service.BizPromoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 이익제공 입력(법인카드) (AS-IS Biz01_Tab_Card → server/biz/Biz01_Promo, sys/Sys99_Print.insertRdCard) */
@RestController
@RequestMapping("/api/v1/biz/promos")
@RequiredArgsConstructor
public class BizPromoController {

    private final BizPromoService service;

    /** AS-IS biz.Biz01_Promo.selectByCard */
    @GetMapping("/cards")
    public ApiResponse<List<BizPromoCardRes>> searchByCard(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                           @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByCard(principal, startDate, closeDate, searchText));
    }

    /** AS-IS biz.Biz01_Promo.closeCheck → 마감된 내역이 있으면 true */
    @PostMapping("/close-check")
    public ApiResponse<Boolean> closeCheck(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> promoIds) {
        return ApiResponse.ok(service.hasClosed(principal, promoIds));
    }

    /** AS-IS biz.Biz01_Promo.modelUpdate → 저장한 건수 */
    @PutMapping("/{promoId}")
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long promoId, @RequestBody BizPromoUpdateReq req) {
        return ApiResponse.ok(service.update(principal, promoId, req));
    }

    /** AS-IS biz.Biz01_Promo.noteUpdate */
    @PutMapping("/{promoId}/note")
    public ApiResponse<Integer> updateNote(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long promoId, @RequestBody BizPromoNoteReq req) {
        return ApiResponse.ok(service.updateNote(principal, promoId, req.note()));
    }

    /** AS-IS biz.Biz01_Promo.updateAccount → 저장한 건수 */
    @PutMapping("/accounts")
    public ApiResponse<Integer> updateAccount(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizPromoAccountReq req) {
        return ApiResponse.ok(service.updateAccount(principal, req));
    }

    /** AS-IS sys.Sys00_Common.selectByProvideContentCode */
    @GetMapping("/provide-accounts")
    public ApiResponse<List<BizAccountOptionRes>> provideAccounts(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String provideContentCode) {
        return ApiResponse.ok(service.searchProvideAccounts(principal, provideContentCode));
    }

    /** AS-IS dcr.Dcr30_Link.selectByLinkCode — 지정된 문서분류가 없으면 data가 null */
    @GetMapping("/doc-class")
    public ApiResponse<BizDocClassRes> docClass(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String linkCode) {
        return ApiResponse.ok(service.getDocClass(principal, linkCode));
    }

    /** AS-IS sys.Sys99_Print.insertRdCard → 출력 그룹 ID (RD 리포트 rdGroupId) */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizPromoPrintReq req) {
        return ApiResponse.ok(service.insertRdCard(principal, req));
    }
}
