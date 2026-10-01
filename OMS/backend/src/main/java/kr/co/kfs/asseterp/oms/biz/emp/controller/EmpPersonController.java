package kr.co.kfs.asseterp.oms.biz.emp.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleSaveReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonSaveReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.UserInfoRes;
import kr.co.kfs.asseterp.oms.common.dto.PageRes;
import kr.co.kfs.asseterp.oms.biz.emp.service.EmpAddTitleService;
import kr.co.kfs.asseterp.oms.biz.emp.service.EmpPersonService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 사원 기본정보·겸직발령 (AS-IS emp.Emp01_Person, emp.Emp04_AddTitle). 로그인 회사 사원만 */
@RestController
@RequestMapping("/api/v1/emp/persons")
@RequiredArgsConstructor
public class EmpPersonController {

    private final EmpPersonService empPersonService;
    private final EmpAddTitleService empAddTitleService;

    /** 사용자정보 조회 (AS-IS Emp01_Tab_UserInfo, 전 고객사 — KFS 관리자). page는 0부터 */
    @GetMapping("/user-infos")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<PageRes<UserInfoRes>> searchUserInfos(@RequestParam(required = false) Long companyId,
                                                             @RequestParam(required = false) String searchText,
                                                             @RequestParam(defaultValue = "true") boolean useOnly,
                                                             @RequestParam(defaultValue = "true") boolean excludeRetired,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.ok(empPersonService.searchUserInfos(companyId, searchText, useOnly, excludeRetired, page, size));
    }

    @GetMapping("/{personId}")
    public ApiResponse<PersonRes> getPerson(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        return ApiResponse.ok(empPersonService.getPerson(principal, personId));
    }

    @PutMapping("/{personId}")
    public ApiResponse<PersonRes> updatePerson(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId,
                                               @RequestBody PersonSaveReq req) {
        return ApiResponse.ok(empPersonService.updatePerson(principal, personId, req));
    }

    @DeleteMapping("/{personId}")
    public ApiResponse<Void> deletePerson(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        empPersonService.deletePerson(principal, personId);
        return ApiResponse.ok(null);
    }

    // ── 겸직발령 (AS-IS Emp04_AddTitle) ──

    @GetMapping("/{personId}/add-titles")
    public ApiResponse<List<AddTitleRes>> searchAddTitles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        return ApiResponse.ok(empAddTitleService.searchAddTitles(principal, personId));
    }

    @PostMapping("/{personId}/add-titles")
    public ApiResponse<AddTitleRes> createAddTitle(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId,
                                                   @RequestBody AddTitleSaveReq req) {
        return ApiResponse.ok(empAddTitleService.createAddTitle(principal, personId, req));
    }

    @PutMapping("/add-titles/{addTitleId}")
    public ApiResponse<AddTitleRes> updateAddTitle(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long addTitleId,
                                                   @RequestBody AddTitleSaveReq req) {
        return ApiResponse.ok(empAddTitleService.updateAddTitle(principal, addTitleId, req));
    }

    @DeleteMapping("/add-titles/{addTitleId}")
    public ApiResponse<Void> deleteAddTitle(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long addTitleId) {
        empAddTitleService.deleteAddTitle(principal, addTitleId);
        return ApiResponse.ok(null);
    }
}
