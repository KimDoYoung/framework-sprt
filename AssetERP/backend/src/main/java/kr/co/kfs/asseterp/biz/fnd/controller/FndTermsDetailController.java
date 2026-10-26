package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundTermsDetailRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRevisionRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRevisionSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsUpdateReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsViewRes;
import kr.co.kfs.asseterp.biz.fnd.service.FndTermsDetailService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 펀드규약 상세 (AS-IS server/fnd/Fnd26_TermsDetail · Fnd25_Terms) */
@RestController
@RequestMapping("/api/v1/fnd/terms")
@RequiredArgsConstructor
public class FndTermsDetailController {

    private final FndTermsDetailService service;

    /** AS-IS fnd.Fnd26_TermsDetail.selectByTermsId (P07 규약 내용 조회창) */
    @GetMapping("/{termsId}/details")
    public ApiResponse<List<FundTermsDetailRes>> searchByTermsId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long termsId) {
        return ApiResponse.ok(service.searchByTermsId(principal, termsId));
    }

    /** AS-IS fnd.Fnd26_TermsDetail.selectBySearchText (P12 왼쪽 규약 목록) */
    @GetMapping
    public ApiResponse<List<TermsRes>> searchTerms(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) String termsType,
                                                   @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchTerms(principal, termsType, searchText));
    }

    /** AS-IS fnd.Fnd25_Terms.selectBySearchTextManager (P13 펀드규약 조회) */
    @GetMapping("/list")
    public ApiResponse<List<TermsViewRes>> searchTermsView(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam(required = false) String termsType,
                                                           @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchTermsView(principal, termsType, searchText));
    }

    /** AS-IS fnd.Fnd26_TermsDetail.selectBySearchTextManager (P12 오른쪽 개정 목록) */
    @GetMapping("/{termsId}/revisions")
    public ApiResponse<List<TermsRevisionRes>> searchRevisions(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long termsId,
                                                               @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchRevisions(principal, termsId, searchText));
    }

    /** AS-IS dbConfig.getSeq — 편집 창의 새 개정 ID */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS fnd.Fnd26_TermsDetail.update (mode insert/new/copy/edit) */
    @PutMapping("/revisions")
    public ApiResponse<Void> saveRevision(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TermsRevisionSaveReq req) {
        service.saveRevision(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd26_TermsDetail.update (mode fnd25update, P12 예탁원코드 창) */
    @PutMapping("/{termsId}")
    public ApiResponse<Void> updateTerms(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long termsId, @RequestBody TermsUpdateReq req) {
        service.updateTerms(principal, termsId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd26_TermsDetail.delete (P12 개정 삭제) */
    @DeleteMapping("/revisions")
    public ApiResponse<Void> deleteRevisions(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> termsDetailIds) {
        service.deleteRevisions(principal, termsDetailIds);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd26_TermsDetail.deleteAll (P12 예탁원코드 창 [삭제]) */
    @DeleteMapping("/{termsId}")
    public ApiResponse<Void> deleteTerms(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long termsId) {
        service.deleteTerms(principal, termsId);
        return ApiResponse.ok(null);
    }
}
