package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcCreateReq;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcDetailSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcTaskDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcTaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcUpdateReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmRoleAllcService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;

/** 임원별 직책배정 (AS-IS server/tdm/Tdm30_RoleAllc·Tdm34_RoleAllcDetail·Tdm35_RoleAllcTask) */
@RestController
@RequestMapping("/api/v1/tdm/role-allcs")
@RequiredArgsConstructor
public class TdmRoleAllcController {

    private final TdmRoleAllcService service;

    /** AS-IS tdm.Tdm30_RoleAllc.selectByText */
    @GetMapping
    public ApiResponse<List<RoleAllcRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                                 @RequestParam(defaultValue = "true") boolean allYn,
                                                 @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, baseDate == null ? LocalDate.now() : baseDate, allYn, searchText));
    }

    /** AS-IS tdm.Tdm30_RoleAllc.notInRoleAllcIdList */
    @GetMapping("/others")
    public ApiResponse<List<RoleAllcRes>> searchOthers(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(required = false) List<Long> excludeIds) {
        return ApiResponse.ok(service.searchOthers(principal, excludeIds));
    }

    /** AS-IS Tdm30_Edit_RoleAllc.update (tdm30 + tdm34 modelUpdate) */
    @PostMapping
    public ApiResponse<RoleAllcRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody RoleAllcCreateReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS Tdm30_Edit_RoleAllcModify.update (tdm30 modelUpdate) */
    @PutMapping("/{roleAllcId}")
    public ApiResponse<RoleAllcRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleAllcId,
                                           @RequestBody RoleAllcUpdateReq req) {
        return ApiResponse.ok(service.update(principal, roleAllcId, req));
    }

    /** AS-IS tdm.Tdm30_RoleAllc.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> roleAllcIds) {
        return ApiResponse.ok(service.delete(principal, roleAllcIds));
    }

    /** AS-IS tdm.Tdm34_RoleAllcDetail.selectByRoleAllcId */
    @GetMapping("/{roleAllcId}/details")
    public ApiResponse<List<RoleAllcDetailRes>> searchDetails(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleAllcId) {
        return ApiResponse.ok(service.searchDetails(principal, roleAllcId));
    }

    /** AS-IS tdm.Tdm34_RoleAllcDetail.update */
    @PutMapping("/{roleAllcId}/details")
    public ApiResponse<List<RoleAllcDetailRes>> saveDetails(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleAllcId,
                                                            @RequestBody List<RoleAllcDetailSaveReq> rows) {
        return ApiResponse.ok(service.saveDetails(principal, roleAllcId, rows));
    }

    /** AS-IS tdm.Tdm34_RoleAllcDetail.delete */
    @DeleteMapping("/details")
    public ApiResponse<Integer> deleteDetails(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> roleAllcDetailIds) {
        return ApiResponse.ok(service.deleteDetails(principal, roleAllcDetailIds));
    }

    /** AS-IS tdm.Tdm35_RoleAllcTask.selectTask */
    @GetMapping("/details/{roleAllcDetailId}/tasks")
    public ApiResponse<List<RoleAllcTaskRes>> searchTasks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleAllcDetailId) {
        return ApiResponse.ok(service.searchTasks(principal, roleAllcDetailId));
    }

    /** AS-IS tdm.Tdm35_RoleAllcTask.selectTaskDetail */
    @GetMapping("/details/{roleAllcDetailId}/tasks/{taskId}/details")
    public ApiResponse<List<RoleAllcTaskDetailRes>> searchTaskDetails(@AuthenticationPrincipal UserPrincipal principal,
                                                                       @PathVariable Long roleAllcDetailId, @PathVariable Long taskId) {
        return ApiResponse.ok(service.searchTaskDetails(principal, roleAllcDetailId, taskId));
    }

    /** AS-IS tdm.Tdm35_RoleAllcTask.deleteInsert */
    @PostMapping("/details/{roleAllcDetailId}/tasks/rebuild")
    public ApiResponse<Void> rebuildTasks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleAllcDetailId) {
        service.rebuildTasks(principal, roleAllcDetailId);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm31_RoleDesc.getRollAllcDetailId (승인 완료된 책무기술서가 없으면 null) */
    @GetMapping("/details/{roleAllcDetailId}/role-desc")
    public ApiResponse<Long> searchRoleDescId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleAllcDetailId) {
        return ApiResponse.ok(service.searchRoleDescId(principal, roleAllcDetailId));
    }
}
