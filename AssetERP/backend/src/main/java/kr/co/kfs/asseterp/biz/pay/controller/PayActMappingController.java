package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayActMappingRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayActMappingSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayActMappingService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 계약서 Mapping Pay06_Lookup_ActList (S13) — AS-IS pay.Pay06_ActMapping */
@RestController
@RequestMapping("/api/v1/pay/act-mappings")
@RequiredArgsConstructor
public class PayActMappingController {

    private final PayActMappingService service;

    /** pay.Pay06_ActMapping.selectByLinkCode */
    @GetMapping
    public ApiResponse<List<PayActMappingRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam String linkCode,
                                                      @RequestParam(required = false) String kindCode) {
        return ApiResponse.ok(service.search(principal, linkCode, kindCode));
    }

    /** pay.Pay06_ActMapping.update */
    @PutMapping
    public ApiResponse<List<PayActMappingRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestBody List<PayActMappingSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** pay.Pay06_ActMapping.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
