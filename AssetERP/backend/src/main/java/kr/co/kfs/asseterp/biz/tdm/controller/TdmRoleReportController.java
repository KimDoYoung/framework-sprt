package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportAttachRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmRoleReportService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무구조도 제출(AS-IS Tdm36_Tab_RoleReport, N14) → server/tdm/Tdm36_RoleReport */
@RestController
@RequestMapping("/api/v1/tdm/role-reports")
@RequiredArgsConstructor
public class TdmRoleReportController {

    private final TdmRoleReportService service;

    /** AS-IS tdm.Tdm36_RoleReport.selectByDate (checkYn01 = 전체보기, checkYn02 = 미처리건만 조회) */
    @GetMapping
    public ApiResponse<List<RoleReportRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) String startDate,
                                                   @RequestParam(required = false) String closeDate,
                                                   @RequestParam(defaultValue = "true") boolean notPeriodYn,
                                                   @RequestParam(defaultValue = "false") boolean notEndYn) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, notPeriodYn, notEndYn));
    }

    /** AS-IS tdm.Tdm36_RoleReport.getAttachList */
    @GetMapping("/{roleReportId}/attaches")
    public ApiResponse<List<RoleReportAttachRes>> attaches(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleReportId) {
        return ApiResponse.ok(service.attaches(principal, roleReportId));
    }

    /** AS-IS tdm.Tdm36_RoleReport.update — roleReportId ≤ 0이면 등록 */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<RoleReportSaveReq> rows) {
        service.save(principal, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm36_RoleReport.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> roleReportIds) {
        return ApiResponse.ok(service.delete(principal, roleReportIds));
    }
}
