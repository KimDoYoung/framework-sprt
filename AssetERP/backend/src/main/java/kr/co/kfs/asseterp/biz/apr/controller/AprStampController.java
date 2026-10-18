package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampRes;
import kr.co.kfs.asseterp.biz.apr.service.AprStampService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 인감 (AS-IS Apr10_Lookup_DocStamp → server/apr/Apr10_Stamp) */
@RestController
@RequestMapping("/api/v1/apr/stamps")
@RequiredArgsConstructor
public class AprStampController {

    private final AprStampService service;

    /** AS-IS apr.Apr10_Stamp.selectBySearchText2 — 문서분류에서 쓸 수 있는 인감 */
    @GetMapping("/doc")
    public ApiResponse<List<AprStampRes>> searchDocStamp(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam Long classTreeId,
                                                         @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchDocStamp(principal, classTreeId, searchText));
    }
}
