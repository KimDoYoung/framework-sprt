package kr.co.kfs.asseterp.biz.apr.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 링크코드로 여는 전자결재 창의 제목·본문 (AS-IS Apr01_Edit_ApprDoc.insertLinkApproval, V17) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprLinkSeedController {

    private final AprLinkSeedService service;

    /** refId = 호출한 원본 화면의 행 번호(A25는 etcLeaveId). DB는 바꾸지 않는다 */
    @GetMapping("/link-seed")
    public ApiResponse<AprLinkSeedRes> seed(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId,
                                            @RequestParam String linkCode, @RequestParam(required = false) Long refId) {
        return ApiResponse.ok(service.seed(principal, classTreeId, linkCode, refId));
    }
}
