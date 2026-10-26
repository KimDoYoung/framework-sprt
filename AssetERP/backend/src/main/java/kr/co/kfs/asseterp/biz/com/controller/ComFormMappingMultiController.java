package kr.co.kfs.asseterp.biz.com.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingMultiRes;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingMultiSaveReq;
import kr.co.kfs.asseterp.biz.com.service.ComFormMappingMultiService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 상세코드별 데이터맵핑 양식 (AS-IS Com11_Lookup_FormMappingMulti → server/com/Com11_FormMappingMulti) */
@RestController
@RequestMapping("/api/v1/com/form-mapping-multis")
@RequiredArgsConstructor
public class ComFormMappingMultiController {

    private final ComFormMappingMultiService service;

    /** AS-IS com.Com11_FormMappingMulti.getUpdateModel */
    @GetMapping
    public ApiResponse<FormMappingMultiRes> get(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam String kindCode,
                                                @RequestParam(required = false) String detailCode,
                                                @RequestParam String linkCode) {
        return ApiResponse.ok(service.get(principal, kindCode, detailCode, linkCode));
    }

    /** AS-IS com.Com11_FormMappingMulti.modelUpdate → 양식 번호 */
    @PutMapping
    public ApiResponse<Long> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FormMappingMultiSaveReq req) {
        return ApiResponse.ok(service.update(principal, req));
    }
}
