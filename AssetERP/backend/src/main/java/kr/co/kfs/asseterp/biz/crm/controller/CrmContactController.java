package kr.co.kfs.asseterp.biz.crm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactDetailRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactEmpRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactSaveReq;
import kr.co.kfs.asseterp.biz.crm.service.CrmContactService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 영업 거래처 조회창 (AS-IS Crm09_Lookup_SelectSingle → server/crm/Crm09_Contact) */
@RestController
@RequestMapping("/api/v1/crm/contacts")
@RequiredArgsConstructor
public class CrmContactController {

    private final CrmContactService service;

    /** AS-IS crm.Crm09_Contact.selectBiz02Emp — open("emp") */
    @GetMapping("/biz02-emps")
    public ApiResponse<List<CrmContactEmpRes>> searchBiz02Emps(@AuthenticationPrincipal UserPrincipal principal,
                                                                                            @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchBiz02Emps(principal, searchText));
    }

    /** AS-IS crm.Crm09_Contact.selectKeyInCompanyName — open("keyInCompany") */
    @GetMapping("/key-in-companies")
    public ApiResponse<List<CrmContactRes>> searchKeyInCompanies(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchKeyInCompanies(principal, searchText));
    }

    /** AS-IS crm09_contact.selectById (EE84 Crm09_Lookup_ContactPoint.openEdit) */
    @GetMapping("/{contactId}")
    public ApiResponse<CrmContactDetailRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contactId) {
        return ApiResponse.ok(service.get(principal, contactId));
    }

    /** AS-IS crm.Crm09_Contact.modelUpdate — contactId가 없으면 새 거래처 */
    @PutMapping
    public ApiResponse<CrmContactDetailRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CrmContactSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }
}
