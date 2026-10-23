package kr.co.kfs.asseterp.biz.crm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactRes;
import kr.co.kfs.asseterp.biz.crm.service.CrmContactService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
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

    /** AS-IS crm.Crm09_Contact.selectKeyInCompanyName — open("keyInCompany") */
    @GetMapping("/key-in-companies")
    public ApiResponse<List<CrmContactRes>> searchKeyInCompanies(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchKeyInCompanies(principal, searchText));
    }
}
