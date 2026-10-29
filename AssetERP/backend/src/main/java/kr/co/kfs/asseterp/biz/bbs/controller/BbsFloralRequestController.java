package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralMessageSendReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestStatusReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralShareRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralShareSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsFloralRequestService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
