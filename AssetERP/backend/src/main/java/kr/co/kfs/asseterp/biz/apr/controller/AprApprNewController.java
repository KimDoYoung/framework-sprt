package kr.co.kfs.asseterp.biz.apr.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprNewRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprNewService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 전자결재 새 문서 열기 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc.insertApproval, V06) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprApprNewController {

    private final AprApprNewService service;

    /** AS-IS insertApproval — 문서 번호·기본 제목/본문·기본 결재선·연관법규/내규 (DB는 바꾸지 않는다) */
    @GetMapping("/new")
    public ApiResponse<AprApprNewRes> open(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.open(principal, classTreeId));
    }
}
