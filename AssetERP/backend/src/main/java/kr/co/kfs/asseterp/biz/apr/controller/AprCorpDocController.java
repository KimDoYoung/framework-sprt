package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRelateRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRes;
import kr.co.kfs.asseterp.biz.apr.service.AprCorpDocService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 법인서류 신청내역·연결문서 창 (AS-IS Apr17_Lookup_CorpDoc · Apr18_Lookup_RelateAppr · Apr19_Lookup_RelateAppr) */
@RestController
@RequestMapping("/api/v1/apr/corp-docs")
@RequiredArgsConstructor
public class AprCorpDocController {

    private final AprCorpDocService service;

    /** AS-IS apr.Apr17_CorpDoc.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<AprCorpDocRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS apr.Apr17_CorpDoc.regDateUpdate — 고른 신청내역 번호들의 등록일을 오늘로 */
    @PostMapping("/reg-date")
    public ApiResponse<Void> regDateUpdate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        service.regDateUpdate(principal, ids);
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr18_RelateCorpDoc.selectByCorpDocId */
    @GetMapping("/{corpDocId}/relates")
    public ApiResponse<List<AprCorpDocRelateRes>> searchRelates(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long corpDocId) {
        return ApiResponse.ok(service.searchRelates(principal, corpDocId));
    }

    /** AS-IS apr.Apr18_RelateCorpDoc.modelUpdate — 상신문서를 신청내역에 연결 */
    @PostMapping("/{corpDocId}/relates/{apprId}")
    public ApiResponse<Void> insertRelate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long corpDocId, @PathVariable Long apprId) {
        service.insertRelate(principal, corpDocId, apprId);
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr18_RelateCorpDoc.delete — 연결 번호들 */
    @DeleteMapping("/relates")
    public ApiResponse<Void> deleteRelates(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        service.deleteRelates(principal, ids);
        return ApiResponse.ok(null);
    }
}
