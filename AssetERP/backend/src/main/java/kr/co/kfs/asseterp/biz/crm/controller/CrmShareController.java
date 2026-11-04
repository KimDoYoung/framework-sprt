package kr.co.kfs.asseterp.biz.crm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmShareRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmShareSaveReq;
import kr.co.kfs.asseterp.biz.crm.service.CrmShareService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공유지정 창 (AS-IS Crm14_Lookup_ShareDefault → Crm14_ShareDefault, Crm15_Lookup_Share → Crm15_Share) */
@RestController
@RequestMapping("/api/v1/crm/shares")
@RequiredArgsConstructor
public class CrmShareController {

    private final CrmShareService service;

    /** AS-IS crm.Crm14_ShareDefault.selectByContactId */
    @GetMapping("/default/{contactId}")
    public ApiResponse<List<CrmShareRes>> searchDefault(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contactId) {
        return ApiResponse.ok(service.searchDefault(principal, contactId));
    }

    /** AS-IS crm.Crm14_ShareDefault.delete + update → selectShareInfo 문구 */
    @PutMapping("/default/{contactId}")
    public ApiResponse<String> saveDefault(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contactId,
                                           @RequestBody CrmShareSaveReq req) {
        return ApiResponse.ok(service.saveDefault(principal, contactId, req));
    }

    /** AS-IS crm.Crm15_Share.selectByWorkDetailId */
    @GetMapping("/work-detail/{workDetailId}")
    public ApiResponse<List<CrmShareRes>> searchByWorkDetail(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long workDetailId) {
        return ApiResponse.ok(service.searchByWorkDetail(principal, workDetailId));
    }

    /** AS-IS crm.Crm15_Share.delete + update → selectShareInfo 문구 */
    @PutMapping("/work-detail/{workDetailId}")
    public ApiResponse<String> saveByWorkDetail(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long workDetailId,
                                                @RequestBody CrmShareSaveReq req) {
        return ApiResponse.ok(service.saveByWorkDetail(principal, workDetailId, req));
    }
}
