package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.*;
import kr.co.kfs.asseterp.biz.biz.service.BizContCorpService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 계약사 관리 (AS-IS server/biz/Biz10_ContCorp 외 Biz11~Biz17 — 화면 Biz10_Tab_ContCorp, EE20) */
@RestController
@RequestMapping("/api/v1/biz/cont-corps")
@RequiredArgsConstructor
public class BizContCorpController {

    private final BizContCorpService service;

    /** AS-IS biz.Biz10_ContCorp.selectByText */
    @GetMapping
    public ApiResponse<List<BizContCorpRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(defaultValue = "") String searchText,
                                                    @RequestParam(defaultValue = "false") boolean check,
                                                    @RequestParam(required = false) String stdYear,
                                                    @RequestParam(defaultValue = "%") String statusCode,
                                                    @RequestParam(defaultValue = "true") boolean statusCheck,
                                                    @RequestParam(required = false) String endMonth) {
        return ApiResponse.ok(service.search(principal, searchText, check, stdYear, statusCode, statusCheck, endMonth));
    }

    /** AS-IS getSeq */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS biz.Biz10_ContCorp.selectById */
    @GetMapping("/{contCorpId}")
    public ApiResponse<BizContCorpRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contCorpId) {
        return ApiResponse.ok(service.get(principal, contCorpId));
    }

    /** AS-IS biz.Biz10_ContCorp.insertUpdate */
    @PostMapping
    public ApiResponse<BizContSaveRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizContSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS biz.Biz11_ContHistory.deleteContCorpId + biz.Biz10_ContCorp.delete → 지운 계약사 수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> contCorpIds) {
        return ApiResponse.ok(service.delete(principal, contCorpIds));
    }

    // ── 이력 (Biz11_ContHistory) ──

    @GetMapping("/{contCorpId}/histories")
    public ApiResponse<List<BizContCorpRes>> histories(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contCorpId) {
        return ApiResponse.ok(service.searchHistories(principal, contCorpId));
    }

    /** AS-IS biz.Biz11_ContHistory.deleteCheck → 이력 수 */
    @GetMapping("/{contCorpId}/histories/count")
    public ApiResponse<Integer> historyCount(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contCorpId) {
        return ApiResponse.ok(service.countHistories(principal, contCorpId));
    }

    @DeleteMapping("/histories")
    public ApiResponse<Integer> deleteHistories(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> contHistoryIds) {
        return ApiResponse.ok(service.deleteHistories(principal, contHistoryIds));
    }

    // ── 보수정보 (Biz12_FeeInfo) ──

    @PutMapping("/fee-infos")
    public ApiResponse<BizContFeeInfoRes> saveFeeInfo(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizContFeeInfoReq req) {
        return ApiResponse.ok(service.saveFeeInfo(principal, req));
    }

    // ── 공유자 (Biz15_Share) ──

    @GetMapping("/histories/{contHistoryId}/shares")
    public ApiResponse<List<BizContShareRes>> shares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contHistoryId) {
        return ApiResponse.ok(service.searchShares(principal, contHistoryId));
    }

    /** AS-IS biz.Biz15_Share.insert */
    @PostMapping("/histories/{contHistoryId}/shares/copy")
    public ApiResponse<Integer> copyShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contHistoryId, @RequestParam Long contCorpId) {
        return ApiResponse.ok(service.copyShares(principal, contCorpId, contHistoryId));
    }

    /** AS-IS biz.Biz15_Share.update + biz.Biz15_Share.delete */
    @PutMapping("/shares")
    public ApiResponse<Integer> saveShares(@AuthenticationPrincipal UserPrincipal principal, @RequestBody SharesReq req) {
        return ApiResponse.ok(service.saveShares(principal, req.adds(), req.deleteIds()));
    }

    public record SharesReq(List<BizContShareReq> adds, List<Long> deleteIds) {
    }

    // ── 운영정보 (Biz13_WithCorp) ──

    @GetMapping("/{contCorpId}/with-corps")
    public ApiResponse<List<BizContWithCorpRes>> withCorps(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contCorpId) {
        return ApiResponse.ok(service.searchWithCorps(principal, contCorpId));
    }

    @PutMapping("/with-corps")
    public ApiResponse<Integer> saveWithCorps(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizContWithCorpReq> rows) {
        return ApiResponse.ok(service.saveWithCorps(principal, rows));
    }

    @DeleteMapping("/with-corps")
    public ApiResponse<Integer> deleteWithCorps(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteWithCorps(principal, ids));
    }

    // ── 연관문서 (Biz14_RelateAppr) ──

    @GetMapping("/histories/{contHistoryId}/relate-apprs")
    public ApiResponse<List<BizContRelateApprRes>> relateApprs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contHistoryId) {
        return ApiResponse.ok(service.searchRelateApprs(principal, contHistoryId));
    }

    @PostMapping("/relate-apprs")
    public ApiResponse<Long> createRelateAppr(@RequestBody BizContRelateApprReq req) {
        return ApiResponse.ok(service.createRelateAppr(req));
    }

    @DeleteMapping("/relate-apprs")
    public ApiResponse<Integer> deleteRelateApprs(@RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteRelateApprs(ids));
    }

    // ── 개별계약서 (Biz16_EachCont) ──

    @GetMapping("/{contCorpId}/each-conts")
    public ApiResponse<List<BizContEachRes>> eachConts(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contCorpId) {
        return ApiResponse.ok(service.searchEachConts(principal, contCorpId));
    }

    @GetMapping("/{contCorpId}/each-conts/address")
    public ApiResponse<List<BizContEachAddrRes>> eachContAddr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contCorpId) {
        return ApiResponse.ok(service.searchEachContAddr(principal, contCorpId));
    }

    @PutMapping("/each-conts")
    public ApiResponse<Integer> saveEachConts(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizContEachReq> rows) {
        return ApiResponse.ok(service.saveEachConts(principal, rows));
    }

    @DeleteMapping("/each-conts")
    public ApiResponse<Integer> deleteEachConts(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteEachConts(principal, ids));
    }

    /** AS-IS biz.Biz16_EachCont.updateApprId */
    @PutMapping("/each-conts/{contractId}/appr-id")
    public ApiResponse<Integer> updateEachContApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contractId, @RequestParam Long apprId) {
        return ApiResponse.ok(service.updateEachContApprId(principal, contractId, apprId));
    }

    // ── 이중사무관리 펀드 (Biz17_DualManageFund) ──

    @GetMapping("/{contCorpId}/dual-funds")
    public ApiResponse<List<BizContDualFundRes>> dualFunds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contCorpId) {
        return ApiResponse.ok(service.searchDualFunds(principal, contCorpId));
    }

    @PutMapping("/dual-funds")
    public ApiResponse<Integer> saveDualFunds(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizContDualFundReq> rows) {
        return ApiResponse.ok(service.saveDualFunds(principal, rows));
    }

    @DeleteMapping("/dual-funds")
    public ApiResponse<Integer> deleteDualFunds(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteDualFunds(principal, ids));
    }

    /** AS-IS ast.Ast30_BookFundFee.selectByContCorpId — Biz17_Lookup_HoldFee */
    @GetMapping("/{contCorpId}/hold-funds")
    public ApiResponse<List<BizContHoldFeeRes>> holdFunds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contCorpId,
                                                           @RequestParam String holdDate, @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchHoldFees(principal, contCorpId, holdDate, searchText));
    }

    /** AS-IS sys.Sys99_Print.insertRdContCorp → 출력 그룹 ID (RD 리포트 rdGroupId) */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizContPrintReq req) {
        return ApiResponse.ok(service.rdPrint(principal, req));
    }
}
