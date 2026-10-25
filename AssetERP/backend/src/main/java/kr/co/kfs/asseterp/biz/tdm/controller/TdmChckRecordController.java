package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckRecordRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChckRecordService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 점검(승인) 이력 (AS-IS Tdm55_Lookup_ChckRecord, N20·N21) → server/tdm/Tdm55_ChckRecord */
@RestController
@RequestMapping("/api/v1/tdm/chck-records")
@RequiredArgsConstructor
public class TdmChckRecordController {

    private final TdmChckRecordService service;

    /** AS-IS tdm.Tdm55_ChckRecord.selectByChckOrgId (exceptionTable TDM51) · selectByRelateId (NONE, relateId) · selectByInsuffId (TDM54, chckInsuffId — N23) */
    @GetMapping
    public ApiResponse<List<ChckRecordRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) Long chckOrgId,
                                                   @RequestParam(required = false) Long relateId,
                                                   @RequestParam(required = false) Long chckInsuffId) {
        if (chckInsuffId != null) {
            return ApiResponse.ok(service.searchByInsuff(principal, chckInsuffId));
        }
        if (relateId != null) {
            return ApiResponse.ok(service.searchByRelate(principal, relateId));
        }
        return ApiResponse.ok(service.searchByChckOrg(principal, chckOrgId));
    }
}
