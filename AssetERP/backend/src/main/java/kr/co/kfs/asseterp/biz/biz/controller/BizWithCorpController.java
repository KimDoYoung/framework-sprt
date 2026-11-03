package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizWithCorpRes;
import kr.co.kfs.asseterp.biz.biz.service.BizWithCorpService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 운용사(계약사 운영정보) 조회 (AS-IS server/biz/Biz13_WithCorp) */
@RestController
@RequestMapping("/api/v1/biz/with-corps")
@RequiredArgsConstructor
public class BizWithCorpController {

    private final BizWithCorpService service;

    /** AS-IS biz.Biz13_WithCorp.selectByText */
    @GetMapping
    public ApiResponse<List<BizWithCorpRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }
}
