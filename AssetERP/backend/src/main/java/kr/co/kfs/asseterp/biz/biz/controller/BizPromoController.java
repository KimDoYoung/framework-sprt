package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizBuyPromoRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizBuyPromoSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardContentsPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardContentsRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCodeOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizDocClassRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoAccountReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoNoteReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoOtherReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoOtherRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoOtherSimpleReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoSimpleUpdateReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoUpdateReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideCompanyRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideListPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideListRes;
import kr.co.kfs.asseterp.biz.biz.service.BizPromoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
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

    /** AS-IS biz.Biz01_Promo.modelUpdate (Biz01_Edit_CardSimple) → 저장한 건수 */
    @PutMapping("/{promoId}/simple")
    public ApiResponse<Integer> updateSimple(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long promoId, @RequestBody BizPromoSimpleUpdateReq req) {
        return ApiResponse.ok(service.updateSimple(principal, promoId, req));
    }

    /** AS-IS biz.Biz01_Promo.selectByProvideCompany (Biz01_Lookup_ProvideCompany) */
    @GetMapping("/provide-companies")
    public ApiResponse<List<BizProvideCompanyRes>> provideCompanies(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchProvideCompanies(principal, searchText));
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

    /** AS-IS biz.Biz01_Promo.selectByOther (Biz01_Tab_Other) — 제공/수령 구분이 없으면 전체 */
    @GetMapping("/others")
    public ApiResponse<List<BizPromoOtherRes>> searchByOther(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                             @RequestParam(required = false, defaultValue = "%") String provideRcvType) {
        return ApiResponse.ok(service.searchByOther(principal, startDate, closeDate, provideRcvType));
    }

    /** AS-IS biz.Biz01_Promo.modelUpdate (새 행) → 내역 ID */
    @PostMapping("/others")
    public ApiResponse<Long> createOther(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizPromoOtherReq req) {
        return ApiResponse.ok(service.createOther(principal, req));
    }

    /** AS-IS biz.Biz01_Promo.modelUpdate (고친 행) → 저장한 건수 */
    @PutMapping("/others/{promoId}")
    public ApiResponse<Integer> updateOther(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long promoId, @RequestBody BizPromoOtherReq req) {
        return ApiResponse.ok(service.updateOther(principal, promoId, req));
    }

    /** AS-IS biz.Biz01_Promo.modelUpdate (Biz01_Edit_OtherSimple 새 행) → 내역 ID */
    @PostMapping("/others/simple")
    public ApiResponse<Long> createOtherSimple(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizPromoOtherSimpleReq req) {
        return ApiResponse.ok(service.createOtherSimple(principal, req));
    }

    /** AS-IS biz.Biz01_Promo.modelUpdate (Biz01_Edit_OtherSimple 고친 행) → 저장한 건수 */
    @PutMapping("/others/{promoId}/simple")
    public ApiResponse<Integer> updateOtherSimple(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long promoId, @RequestBody BizPromoOtherSimpleReq req) {
        return ApiResponse.ok(service.updateOtherSimple(principal, promoId, req));
    }

    /** AS-IS biz.Biz01_Promo.delete → 지운 건수 */
    @DeleteMapping("/others")
    public ApiResponse<Integer> deleteOthers(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> promoIds) {
        return ApiResponse.ok(service.deleteOthers(principal, promoIds));
    }

    /** AS-IS biz.Biz01_Promo.selectByBuyId (Bmt01_Tab_Buy → Biz01_TabPage_List) */
    @GetMapping("/buy-promos")
    public ApiResponse<List<BizBuyPromoRes>> searchByBuyId(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long buyId) {
        return ApiResponse.ok(service.searchByBuyId(principal, buyId));
    }

    /** AS-IS biz.Biz01_Promo.updateAdd — 변경 행 목록 → 다시 읽은 행들(요청 순서) */
    @PutMapping("/buy-promos")
    public ApiResponse<List<BizBuyPromoRes>> saveBuyPromos(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizBuyPromoSaveReq> rows) {
        return ApiResponse.ok(service.saveBuyPromos(principal, rows));
    }

    /** AS-IS sys.Sys09_Code.selectByKindCode(ProvidePurCode, 구분코드%) — Biz01_Edit_Other 제공(수령)목적 */
    @GetMapping("/provide-purposes")
    public ApiResponse<List<BizCodeOptionRes>> providePurposes(@RequestParam String rcvType) {
        return ApiResponse.ok(service.searchProvidePurposes(rcvType));
    }

    /** AS-IS biz.Biz01_Promo.selectCardContentsPaging (Biz01_Tab_CardContents) — 관리자·제공목적 `%`는 전체 */
    @GetMapping("/card-contents")
    public ApiResponse<PageRes<BizCardContentsRes>> searchCardContents(@AuthenticationPrincipal UserPrincipal principal,
                                                                       @RequestParam String dataYm,
                                                                       @RequestParam(defaultValue = "%") String managerId,
                                                                       @RequestParam(defaultValue = "%") String providePurCode,
                                                                       @RequestParam(defaultValue = "") String searchText,
                                                                       @RequestParam(defaultValue = "0") long offset,
                                                                       @RequestParam(defaultValue = "500") long limit) {
        return ApiResponse.ok(service.searchCardContents(principal, dataYm, managerId, providePurCode, searchText, offset, limit));
    }

    /** AS-IS biz.Biz01_Promo.selectByAmt — 총 승인금액(제공금액 합계) */
    @GetMapping("/card-contents/total-amount")
    public ApiResponse<Long> cardContentsAmount(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam String dataYm,
                                                @RequestParam(defaultValue = "%") String managerId,
                                                @RequestParam(defaultValue = "%") String providePurCode,
                                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.getCardContentsAmount(principal, dataYm, managerId, providePurCode, searchText));
    }

    /** AS-IS sys.Sys00_Common.selectBizCardManager — 기준년월(yyyy.MM)의 카드 관리자 */
    @GetMapping("/card-managers")
    public ApiResponse<List<BizCodeOptionRes>> cardManagers(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdYm) {
        return ApiResponse.ok(service.searchCardManagers(principal, stdYm));
    }

    /** AS-IS sys.Sys99_Print.insertRdCardContents → 출력 그룹 ID */
    @PostMapping("/card-contents/rd-print")
    public ApiResponse<String> cardContentsRdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizCardContentsPrintReq req) {
        return ApiResponse.ok(service.insertRdCardContents(principal, req));
    }

    /** AS-IS sys.Sys99_Print.insertRdCardContentsDownload → 출력 그룹 ID (엑셀용) */
    @PostMapping("/card-contents/rd-download")
    public ApiResponse<String> cardContentsRdDownload(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizCardContentsPrintReq req) {
        return ApiResponse.ok(service.insertRdCardContentsDownload(principal, req));
    }

    /** AS-IS sys.Sys99_Print.insertRdCardContentsSimple (Biz01_Tab_CardContentsSimple) → 출력 그룹 ID (엑셀용) */
    @PostMapping("/card-contents/rd-download-simple")
    public ApiResponse<String> cardContentsRdDownloadSimple(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizCardContentsPrintReq req) {
        return ApiResponse.ok(service.insertRdCardContentsSimple(principal, req));
    }

    /** AS-IS biz.Biz01_Promo.selectProvideList (Biz01_Tab_PriorApproval) — provideRcvType `1` 이익제공 / `2` 이익수령, crmName `%`는 전체, empId는 없으면 조건 없음 */
    @GetMapping("/provide-list")
    public ApiResponse<List<BizProvideListRes>> searchProvideList(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                                  @RequestParam(defaultValue = "%") String provideRcvType,
                                                                  @RequestParam(defaultValue = "%") String crmName,
                                                                  @RequestParam(required = false) Long empId) {
        return ApiResponse.ok(service.searchProvideList(principal, startDate, endDate, provideRcvType, crmName, empId));
    }

    /** AS-IS sys.Sys99_Print.insertRdProvideList → 출력 그룹 ID */
    @PostMapping("/provide-list/rd-print")
    public ApiResponse<String> provideListRdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizProvideListPrintReq req) {
        return ApiResponse.ok(service.insertRdProvideList(principal, req));
    }
}
