package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundTermsDetailRes;
import kr.co.kfs.asseterp.biz.fnd.service.FndTermsDetailService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 펀드규약 상세 (AS-IS server/fnd/Fnd26_TermsDetail) */
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
}
