package kr.co.kfs.asseterp.biz.apr.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkPublicReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalCheckRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalConfirmEmpRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprPersonAuthRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprPersonAuthSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprTypoRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTypoSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDisposalService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprMarkService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprTypoService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 전자결재 문서창의 [오타수정]·[중요표시]·[공람설정]·[문서폐기 신청] (AS-IS client/vi/apr/Apr01_Edit_ApprModi · Apr50_Lookup_PersonList · Apr13_Lookup_PersonAuth · Apr90_Lookup_DisposalList, V09) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprApprExtraController {

    private final AprApprTypoService typoService;
    private final AprApprMarkService markService;
    private final AprApprDisposalService disposalService;

    // ── 오타수정 ──

    /** AS-IS apr.Apr92_ApprModi.selectByPersonId (personId 없으면 로그인 사원) */
    @GetMapping("/{apprId}/typo")
    public ApiResponse<AprTypoRes> getTypo(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestParam(required = false) Long personId) {
        return ApiResponse.ok(typoService.getTypo(principal, apprId, personId));
    }

    /** AS-IS apr.Apr01_Appr.modelUpdate (오타수정) */
    @PutMapping("/{apprId}/typo")
    public ApiResponse<AprApprDetailRes> saveTypo(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprTypoSaveReq req) {
        return ApiResponse.ok(typoService.save(principal, apprId, req));
    }

    // ── 중요표시 ──

    /** AS-IS apr.Apr50_Bookmark.selectByApprId */
    @GetMapping("/{apprId}/bookmarks")
    public ApiResponse<List<AprBookmarkRes>> getBookmarks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(markService.getBookmarks(principal, apprId));
    }

    /** AS-IS apr.Apr50_Bookmark.insert (전체 중요표시 스위치) */
    @PutMapping("/{apprId}/bookmarks/public")
    public ApiResponse<Void> setBookmarkPublic(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprBookmarkPublicReq req) {
        markService.setBookmarkPublic(principal, apprId, req.publicYn());
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr50_Bookmark.update (새 사원 줄) */
    @PutMapping("/{apprId}/bookmarks")
    public ApiResponse<Void> addBookmarkPersons(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprBookmarkSaveReq req) {
        markService.addBookmarkPersons(principal, apprId, req.personIds());
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr50_Bookmark.delete (체크한 줄) */
    @DeleteMapping("/{apprId}/bookmarks")
    public ApiResponse<Void> deleteBookmarks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestParam List<Long> ids) {
        markService.deleteBookmarks(principal, apprId, ids);
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr50_Bookmark.deleteByApprId ([초기화]) */
    @DeleteMapping("/{apprId}/bookmarks/all")
    public ApiResponse<Void> clearBookmarks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        markService.clearBookmarks(principal, apprId);
        return ApiResponse.ok(null);
    }

    // ── 공람설정 ──

    /** AS-IS apr.Apr13_PersonAuth.selectByApprId */
    @GetMapping("/{apprId}/person-auths")
    public ApiResponse<List<AprPersonAuthRes>> getPersonAuths(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(markService.getPersonAuths(principal, apprId));
    }

    /** AS-IS apr.Apr13_PersonAuth.update + delete */
    @PutMapping("/{apprId}/person-auths")
    public ApiResponse<Void> savePersonAuths(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprPersonAuthSaveReq req) {
        markService.savePersonAuths(principal, apprId, req.addPersonIds(), req.deleteIds());
        return ApiResponse.ok(null);
    }

    // ── 문서폐기 신청 ──

    /** AS-IS apr.Apr90_DisposalList.checkDisposal */
    @GetMapping("/{apprId}/disposal-check")
    public ApiResponse<AprDisposalCheckRes> checkDisposal(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(disposalService.check(principal, apprId));
    }

    /** AS-IS Apr90_Lookup_ConfirmEmp.getApprStep — 승인자 처음 값 (없으면 null) */
    @GetMapping("/disposal-confirm-emp")
    public ApiResponse<AprDisposalConfirmEmpRes> getDisposalConfirmEmp(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(disposalService.getConfirmEmp(principal));
    }

    /** AS-IS apr.Apr90_DisposalList.modelUpdate */
    @PostMapping("/{apprId}/disposal")
    public ApiResponse<Void> submitDisposal(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprDisposalReq req) {
        disposalService.submit(principal, apprId, req);
        return ApiResponse.ok(null);
    }
}
