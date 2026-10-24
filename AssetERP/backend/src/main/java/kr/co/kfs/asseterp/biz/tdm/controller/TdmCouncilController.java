package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRoleLookupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCouncilService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 회의체 등록 (AS-IS server/tdm/Tdm05_Cncl, Tdm22_RoleRelateCncl) */
@RestController
@RequestMapping("/api/v1/tdm/councils")
@RequiredArgsConstructor
public class TdmCouncilController {

    private final TdmCouncilService service;

    /** AS-IS tdm.Tdm05_Cncl.selectByDate */
    @GetMapping
    public ApiResponse<List<CouncilRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                                @RequestParam(defaultValue = "true") boolean allYn) {
        return ApiResponse.ok(service.search(principal, baseDate == null ? LocalDate.now() : baseDate, allYn));
    }

    /** AS-IS tdm.Tdm05_Cncl.modelUpdate */
    @PutMapping
    public ApiResponse<CouncilRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CouncilSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS tdm.Tdm05_Cncl.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> cnclIds) {
        return ApiResponse.ok(service.delete(principal, cnclIds));
    }

    /** AS-IS tdm.Tdm22_RoleRelateCncl.selectByCnclId */
    @GetMapping("/{cnclId}/roles")
    public ApiResponse<List<CouncilRoleRes>> searchRoles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long cnclId) {
        return ApiResponse.ok(service.searchRoles(principal, cnclId));
    }

    /** AS-IS tdm.Tdm22_RoleRelateCncl.update */
    @PutMapping("/{cnclId}/roles")
    public ApiResponse<List<CouncilRoleRes>> saveRoles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long cnclId,
                                                       @RequestBody List<CouncilRoleRes> rows) {
        return ApiResponse.ok(service.saveRoles(principal, cnclId, rows));
    }

    /** AS-IS tdm.Tdm22_RoleRelateCncl.delete */
    @DeleteMapping("/{cnclId}/roles")
    public ApiResponse<Integer> deleteRoles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long cnclId,
                                            @RequestBody List<Long> roleRelateCnclIds) {
        return ApiResponse.ok(service.deleteRoles(principal, cnclId, roleRelateCnclIds));
    }

    /** AS-IS tdm.Tdm20_Role.selectByDate — 직책 고르기창 (Tdm20_Lookup_SelectMulti) */
    @GetMapping("/role-lookup")
    public ApiResponse<List<CouncilRoleLookupRes>> searchRoleLookup(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                                                    @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchRoleLookup(principal, baseDate == null ? LocalDate.now() : baseDate, searchText));
    }
}
