package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleCouncilRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleOrgLookupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleTaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmRoleService;
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

/** 직책별 책무 등록 (AS-IS server/tdm/Tdm20_Role, Tdm21_RoleRelateTask, Tdm22_RoleRelateCncl, Tdm23_RoleRelateOrg) */
@RestController
@RequestMapping("/api/v1/tdm/roles")
@RequiredArgsConstructor
public class TdmRoleController {

    private final TdmRoleService service;

    /** AS-IS tdm.Tdm20_Role.selectByDate (roleType을 주면 그 직책그룹만 — 보고CEO 고르기는 "C") */
    @GetMapping
    public ApiResponse<List<RoleRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                             @RequestParam(defaultValue = "true") boolean allYn,
                                             @RequestParam(defaultValue = "") String searchText,
                                             @RequestParam(required = false) String roleType) {
        return ApiResponse.ok(service.search(principal, baseDate == null ? LocalDate.now() : baseDate, allYn, searchText, roleType));
    }

    /** AS-IS tdm.Tdm20_Role.countUseByRoleId */
    @GetMapping("/use-count")
    public ApiResponse<Integer> countUse(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> roleIds) {
        return ApiResponse.ok(service.countUse(principal, roleIds));
    }

    /** AS-IS tdm.Tdm20_Role.modelUpdate (roleId가 없으면 새 직책) */
    @PutMapping
    public ApiResponse<RoleRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody RoleSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS Tdm20_Lookup_SelectSingle.confirm — 그 직책의 보고CEO만 바꾼다 */
    @PutMapping("/{roleId}/ceo")
    public ApiResponse<RoleRes> updateCeo(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                          @RequestParam Long ceoRoleId) {
        return ApiResponse.ok(service.updateCeo(principal, roleId, ceoRoleId));
    }

    /** AS-IS tdm.Tdm20_Role.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TaskDeleteReq req) {
        return ApiResponse.ok(service.delete(principal, req));
    }

    /** AS-IS tdm.Tdm21_RoleRelateTask.selectByRoloId */
    @GetMapping("/{roleId}/tasks")
    public ApiResponse<List<RoleTaskRes>> searchTasks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId) {
        return ApiResponse.ok(service.searchTasks(principal, roleId));
    }

    /** AS-IS tdm.Tdm21_RoleRelateTask.update */
    @PutMapping("/{roleId}/tasks")
    public ApiResponse<Integer> saveTasks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                          @RequestBody List<RoleTaskRes> rows) {
        return ApiResponse.ok(service.saveTasks(principal, roleId, rows));
    }

    /** AS-IS tdm.Tdm21_RoleRelateTask.delete */
    @DeleteMapping("/{roleId}/tasks")
    public ApiResponse<Integer> deleteTasks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                            @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteTasks(principal, roleId, ids));
    }

    /** AS-IS tdm.Tdm22_RoleRelateCncl.selectByRoleId */
    @GetMapping("/{roleId}/councils")
    public ApiResponse<List<RoleCouncilRes>> searchCouncils(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId) {
        return ApiResponse.ok(service.searchCouncils(principal, roleId));
    }

    /** AS-IS tdm.Tdm22_RoleRelateCncl.update */
    @PutMapping("/{roleId}/councils")
    public ApiResponse<Integer> saveCouncils(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                             @RequestBody List<RoleCouncilRes> rows) {
        return ApiResponse.ok(service.saveCouncils(principal, roleId, rows));
    }

    /** AS-IS tdm.Tdm22_RoleRelateCncl.delete */
    @DeleteMapping("/{roleId}/councils")
    public ApiResponse<Integer> deleteCouncils(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                               @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteCouncils(principal, roleId, ids));
    }

    /** AS-IS tdm.Tdm23_RoleRelateOrg.selectByRoleId */
    @GetMapping("/{roleId}/orgs")
    public ApiResponse<List<RoleOrgRes>> searchOrgs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchOrgs(principal, roleId, stdDate));
    }

    /** AS-IS tdm.Tdm23_RoleRelateOrg.selectByRoleId (담당부서 조회창 Tdm23_Lookup_SelectOrg) */
    @GetMapping("/{roleId}/orgs/lookup")
    public ApiResponse<List<RoleOrgLookupRes>> searchOrgLookup(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                               @RequestParam(defaultValue = "false") boolean tdm09Yn,
                                                               @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchOrgLookup(principal, roleId, stdDate, tdm09Yn, searchText));
    }

    /** AS-IS tdm.Tdm23_RoleRelateOrg.update */
    @PutMapping("/{roleId}/orgs")
    public ApiResponse<Integer> saveOrgs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                         @RequestBody List<RoleOrgRes> rows) {
        return ApiResponse.ok(service.saveOrgs(principal, roleId, stdDate, rows));
    }

    /** AS-IS tdm.Tdm23_RoleRelateOrg.delete */
    @DeleteMapping("/{roleId}/orgs")
    public ApiResponse<Integer> deleteOrgs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleId,
                                           @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteOrgs(principal, roleId, ids));
    }
}
