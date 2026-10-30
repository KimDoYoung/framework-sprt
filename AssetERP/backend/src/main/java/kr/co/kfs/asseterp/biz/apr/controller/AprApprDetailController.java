package kr.co.kfs.asseterp.biz.apr.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStampApplRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateLawRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 전자결재 문서 열기 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc 읽기, V01) */
@RestController
@RequestMapping("/api/v1/apr/apprs/{apprId}")
@RequiredArgsConstructor
public class AprApprDetailController {

    private final AprApprDetailService service;

    /** AS-IS apr.Apr01_Appr.selectById */
    @GetMapping("/detail")
    public ApiResponse<AprApprDetailRes> getDetail(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getDetail(principal, apprId));
    }

    /** AS-IS apr.Apr04_ApprStep.selectByApprId (결재선) */
    @GetMapping("/steps")
    public ApiResponse<List<AprApprStepRes>> getSteps(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getSteps(principal, apprId));
    }

    /** AS-IS apr.Apr03_RelateFund.selectByApprId (연관펀드 탭) */
    @GetMapping("/funds")
    public ApiResponse<List<AprApprFundRes>> getFunds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getFunds(principal, apprId));
    }

    /** AS-IS apr.Apr12_RelateAdv.selectByApprId (연관일임 탭) */
    @GetMapping("/advs")
    public ApiResponse<List<AprApprAdvRes>> getAdvs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getAdvs(principal, apprId));
    }

    /** AS-IS apr.Apr21_RelateAppr.selectByApprId (연관문서 탭) */
    @GetMapping("/relate-apprs")
    public ApiResponse<List<AprRelateApprRes>> getRelateApprs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getRelateApprs(principal, apprId));
    }

    /** AS-IS apr.Apr20_RelateIcs.selectByApprId (연관법규 탭) */
    @GetMapping("/relate-ics")
    public ApiResponse<List<AprRelateLawRes>> getRelateIcs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getRelateIcs(principal, apprId));
    }

    /** AS-IS apr.Apr22_RelateIcr.selectByApprId (연관내규 탭) */
    @GetMapping("/relate-icr")
    public ApiResponse<List<AprRelateLawRes>> getRelateIcr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getRelateIcr(principal, apprId));
    }

    /** AS-IS apr.Apr16_StampDoc.selectByApprId (날인신청 탭) */
    @GetMapping("/stamp-appls")
    public ApiResponse<List<AprApprStampApplRes>> getStampAppls(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getStampAppls(principal, apprId));
    }

    /** AS-IS sys.Sys10_File.selectByParentId (첨부파일 탭) */
    @GetMapping("/files")
    public ApiResponse<List<AprApprFileRes>> getFiles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getFiles(principal, apprId));
    }

    /** AS-IS apr.Apr50_Bookmark.selectByPublicYn (북마크 별) */
    @GetMapping("/bookmark")
    public ApiResponse<Boolean> isBookmarked(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.isBookmarked(principal, apprId));
    }

    /** AS-IS apr.Apr42_Comment.getSize (댓글 단추의 건수) */
    @GetMapping("/comment-size")
    public ApiResponse<Integer> getCommentSize(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getCommentSize(principal, apprId));
    }

    /** AS-IS apr.Apr41_OpenHistory.insert (문서를 열 때 열람기록, 임시저장·관리자는 남기지 않는다) */
    @PostMapping("/open-history")
    public ApiResponse<Void> recordOpen(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        service.recordOpen(principal, apprId);
        return ApiResponse.ok(null);
    }
}
