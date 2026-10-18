package kr.co.kfs.asseterp.biz.com.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingRes;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingSaveReq;
import kr.co.kfs.asseterp.biz.com.service.ComFormMappingService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 데이터맵핑 문서양식 (AS-IS Com10_Lookup_CommonMapping → server/com/Com10_FormMapping) */
@RestController
@RequestMapping("/api/v1/com/form-mappings")
@RequiredArgsConstructor
public class ComFormMappingController {

    private final ComFormMappingService service;

    /** AS-IS com.Com10_FormMapping.selectById (없으면 data = null) */
    @GetMapping("/{formMappingId}")
    public ApiResponse<FormMappingRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long formMappingId) {
        return ApiResponse.ok(service.get(principal, formMappingId));
    }

    /** AS-IS com.Com10_FormMapping.modelUpdate → 양식 번호 */
    @PutMapping
    public ApiResponse<Long> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FormMappingSaveReq req) {
        return ApiResponse.ok(service.update(principal, req));
    }
}
