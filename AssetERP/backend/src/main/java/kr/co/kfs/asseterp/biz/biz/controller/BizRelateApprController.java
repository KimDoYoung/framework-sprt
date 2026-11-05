package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprDataYmReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprPersonReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprRes;
import kr.co.kfs.asseterp.biz.biz.service.BizCardManagementApprService;
import kr.co.kfs.asseterp.biz.biz.service.BizRelateApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 상신문서 연결 (AS-IS Biz05_Lookup_RelateAppr·Biz01_Tab_Card 상신 상태 → server/biz/Biz05_RelateAppr) */
@RestController
@RequestMapping("/api/v1/biz/relate-apprs")
@RequiredArgsConstructor
public class BizRelateApprController {

    private final BizRelateApprService service;
    private final BizCardManagementApprService cardManagementService;

    /** AS-IS biz.Biz05_RelateAppr.selectByPromoId */
    @GetMapping
    public ApiResponse<List<BizRelateApprRes>> searchByPromo(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long promoId) {
        return ApiResponse.ok(service.searchByPromo(principal, promoId));
    }

    /** AS-IS biz.Biz05_RelateAppr.selectByPersonId — 한 건이면 그 행, 아니면 data가 null(미상신) */
    @GetMapping("/by-person")
    public ApiResponse<BizRelateApprRes> byPerson(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String dataYm, @RequestParam String linkCode) {
        return ApiResponse.ok(service.getByPerson(principal, dataYm, linkCode));
    }

    /** AS-IS biz.Biz05_RelateAppr.selectByDataYm — 한 건이면 그 행, 아니면 data가 null(미상신) */
    @GetMapping("/by-data-ym")
    public ApiResponse<BizRelateApprRes> byDataYm(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String dataYm, @RequestParam String linkCode) {
        return ApiResponse.ok(service.getByDataYm(principal, dataYm, linkCode));
    }

    /** AS-IS biz.Biz05_RelateAppr.selectFileCount → 'n건' */
    @GetMapping("/file-count")
    public ApiResponse<String> fileCount(@RequestParam Long promoId) {
        return ApiResponse.ok(service.getFileCount(promoId));
    }

    /** AS-IS biz.Biz05_RelateAppr.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> relateApprIds) {
        return ApiResponse.ok(service.delete(principal, relateApprIds));
    }

    /** AS-IS biz.Biz05_RelateAppr.modelUpdate (Biz05_Lookup_RelateAppr [불러오기]) → 새 연결 ID */
    @PostMapping("/promo")
    public ApiResponse<Long> insertPromo(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PromoReq req) {
        return ApiResponse.ok(service.insertPromo(principal, req.promoId(), req.apprId()));
    }

    public record PromoReq(Long promoId, Long apprId) {
    }

    /** AS-IS biz.Biz05_RelateAppr.insert (A35·A36 월 단위 상신 연결) → 새 연결 ID */
    @PostMapping("/data-ym")
    public ApiResponse<Long> insertDataYm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody @jakarta.validation.Valid BizRelateApprDataYmReq req) {
        return ApiResponse.ok(service.insertDataYm(principal, req.dataYm(), req.linkCode(), req.apprId()));
    }

    /** AS-IS biz.Biz05_RelateAppr.insertPersonId (+ A41 첨부 엑셀) → 새 연결 ID */
    @PostMapping("/person")
    public ApiResponse<Long> insertPersonId(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizRelateApprPersonReq req) throws java.io.IOException {
        return ApiResponse.ok(service.insertPersonId(principal, req));
    }

    /**
     * A13 법인카드 내역관리 상신 뒤 처리 — Biz05_RelateAppr.insert(A13) + 첨부 엑셀 + 증빙 파일 복사 (V38).
     * excelCreated가 false면 AS-IS처럼 "Excel 생성 중 오류가 발생했습니다. 관리자에게 연락해주세요"를 알리고 증빙 복사는 하지 않았다.
     */
    @PostMapping("/card-management")
    public ApiResponse<CardManagementApprRes> afterCardManagementAppr(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CardManagementApprReq req) {
        return ApiResponse.ok(new CardManagementApprRes(cardManagementService.afterApproval(principal, req.dataYm(), req.apprId())));
    }

    public record CardManagementApprReq(String dataYm, Long apprId) {
    }

    public record CardManagementApprRes(boolean excelCreated) {
    }
}
