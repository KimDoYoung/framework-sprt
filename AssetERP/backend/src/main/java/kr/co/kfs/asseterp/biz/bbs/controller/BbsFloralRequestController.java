package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralMessageSendReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestNewRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestStatusReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralShareRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralShareSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsFloralRequestService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;

/** 화환신청 확인 (AS-IS Bbs20_Tab_FloralRequestMng → server/bbs/Bbs20_FloralRequest · Bbs21_FloralRequestShare) */
@RestController
@RequestMapping("/api/v1/bbs/floral-requests")
@RequiredArgsConstructor
public class BbsFloralRequestController {

    private final BbsFloralRequestService service;

    /** AS-IS bbs.Bbs20_FloralRequest.selectByTextAdmin — confirmYn = 미완료건만(발송완료·반려 제외) */
    @GetMapping
    public ApiResponse<List<FloralRequestRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                      @RequestParam(defaultValue = "") String searchText,
                                                      @RequestParam(defaultValue = "true") boolean confirmYn) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, searchText, confirmYn));
    }

    /** Y12 AS-IS bbs.Bbs20_FloralRequest.selectByText — 신청 화면(본인 + 공개 건), confirmYn = 미완료건만 */
    @GetMapping("/mine")
    public ApiResponse<List<FloralRequestRes>> searchMine(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                          @RequestParam(defaultValue = "") String searchText,
                                                          @RequestParam(defaultValue = "true") boolean confirmYn) {
        return ApiResponse.ok(service.searchMine(principal, startDate, closeDate, searchText, confirmYn));
    }

    /** Y12 AS-IS Bbs20_Edit_FloralRequest.insert — 새 신청의 기본값(번호를 새로 받는다) */
    @PostMapping("/new")
    public ApiResponse<FloralRequestNewRes> newRequest(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.newRequest(principal));
    }

    /** Y12 AS-IS bbs.Bbs22_FloralMessage.getMessage — 경조구분의 문구(없으면 null) */
    @GetMapping("/message")
    public ApiResponse<String> getMessage(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String code) {
        return ApiResponse.ok(service.getMessage(principal, code));
    }

    /** Y12 AS-IS bbs.Bbs20_FloralRequest.modelUpdate → 저장한 번호 */
    @PutMapping("/save")
    public ApiResponse<Long> saveRequest(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FloralRequestSaveReq req) {
        return ApiResponse.ok(service.saveRequest(principal, req));
    }

    /** Y12 AS-IS bbs.Bbs20_FloralRequest.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteRequests(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteRequests(principal, ids));
    }

    /** Y12 AS-IS bbs.Bbs21_FloralRequestShare.insertDefaultShare → "신청공유" 문구(복사한 것이 없으면 null) */
    @PostMapping("/{floralRequestId}/default-shares")
    public ApiResponse<String> insertDefaultShare(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long floralRequestId,
                                                  @RequestParam Long contactId) {
        return ApiResponse.ok(service.insertDefaultShare(principal, floralRequestId, contactId));
    }

    /** Y12 AS-IS bbs.Bbs21_FloralRequestShare.deleteDefaultShare */
    @DeleteMapping("/{floralRequestId}/default-shares")
    public ApiResponse<Void> deleteDefaultShare(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long floralRequestId) {
        service.deleteDefaultShare(principal, floralRequestId);
        return ApiResponse.ok(null);
    }

    /** AS-IS bbs.Bbs20_FloralRequest.selectById */
    @GetMapping("/{floralRequestId}")
    public ApiResponse<FloralRequestRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long floralRequestId) {
        return ApiResponse.ok(service.get(principal, floralRequestId));
    }

    /** AS-IS bbs.Bbs20_FloralRequest.update — 변경 행 → 다시 읽은 행들(요청 순서) */
    @PutMapping
    public ApiResponse<List<FloralRequestRes>> updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestBody List<FloralRequestStatusReq> rows) {
        return ApiResponse.ok(service.updateStatus(principal, rows));
    }

    /** AS-IS bbs.Bbs20_FloralRequest.sendMessage → 발송 건수 */
    @PostMapping("/messages")
    public ApiResponse<Integer> sendMessage(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FloralMessageSendReq req) {
        return ApiResponse.ok(service.sendMessage(principal, req));
    }

    /** AS-IS bbs.Bbs21_FloralRequestShare.selectByFloralRequestId */
    @GetMapping("/{floralRequestId}/shares")
    public ApiResponse<List<FloralShareRes>> searchShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long floralRequestId) {
        return ApiResponse.ok(service.searchShares(principal, floralRequestId));
    }

    /** AS-IS bbs.Bbs21_FloralRequestShare.delete + update → selectShareInfo 문구 */
    @PutMapping("/{floralRequestId}/shares")
    public ApiResponse<String> saveShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long floralRequestId,
                                          @RequestBody FloralShareSaveReq req) {
        return ApiResponse.ok(service.saveShares(principal, floralRequestId, req));
    }
}
