package kr.co.kfs.asseterp.biz.apr.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprNewRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampLineRes;
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

    /**
     * AS-IS 인감 선택 뒤 결재선 다시 만들기 — retrieveRoleStamp(checkRole=true, 새 문서의 기본 인감) · findLookupStamp/대표회사 선택의 resetApprStep (V12).
     * stampId가 없으면 인감 없는 기본 결재선
     */
    @GetMapping("/stamp-line")
    public ApiResponse<AprStampLineRes> stampLine(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId,
                                                  @RequestParam(required = false) Long stampId, @RequestParam(defaultValue = "false") boolean checkRole) {
        return ApiResponse.ok(service.stampLine(principal, classTreeId, stampId, checkRole));
    }
}
