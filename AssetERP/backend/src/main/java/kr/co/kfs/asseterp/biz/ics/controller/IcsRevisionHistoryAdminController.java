package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryAdminRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryAdminSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionLawRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsRevisionHistoryAdminService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 법규개정내역 등록 (AS-IS Ics20_Tab_RevisionHistoryAdmin·Ics20_Edit_RevisionHistoryAdmin → server/ics/Ics20_RevisionHistory·Ics19_RevisionRelateIcs) */
@RestController
@RequestMapping("/api/v1/ics/revision-history-admin")
@RequiredArgsConstructor
public class IcsRevisionHistoryAdminController {

    private final IcsRevisionHistoryAdminService service;

    /** AS-IS ics.Ics20_RevisionHistory.selectByDate */
    @GetMapping
    public ApiResponse<List<IcsRevisionHistoryAdminRes>> search(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
            @RequestParam(defaultValue = "%") String financeAgencyCode,
            @RequestParam(defaultValue = "") String searchText,
            @RequestParam(defaultValue = "") String relatedLawSearchText,
            @RequestParam(defaultValue = "reg") String dateType) {
        return ApiResponse.ok(service.search(startDate, closeDate, financeAgencyCode, searchText, relatedLawSearchText, dateType));
    }

    /** AS-IS ics.Ics20_RevisionHistory.update(GridUpdate) → 저장된 행 */
    @PutMapping
    public ApiResponse<IcsRevisionHistoryAdminRes> save(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestBody IcsRevisionHistoryAdminSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS ics.Ics20_RevisionHistory.delete → 지운 건수 */
    @DeleteMapping("/{revisionHistoryId}")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long revisionHistoryId) {
        return ApiResponse.ok(service.delete(principal, revisionHistoryId));
    }

    /** AS-IS ics.Ics19_RevisionRelateIcs.selectByRevisionHistoryId */
    @GetMapping("/{revisionHistoryId}/laws")
    public ApiResponse<List<IcsRevisionLawRes>> searchLaws(@PathVariable Long revisionHistoryId) {
        return ApiResponse.ok(service.searchLaws(revisionHistoryId));
    }

    /** AS-IS ics.Ics19_RevisionRelateIcs.update(GridUpdate, 새 행) → 넣은 행 */
    @PostMapping("/{revisionHistoryId}/laws")
    public ApiResponse<List<IcsRevisionLawRes>> addLaws(@AuthenticationPrincipal UserPrincipal principal,
                                                        @PathVariable Long revisionHistoryId, @RequestBody List<Long> classTreeIds) {
        return ApiResponse.ok(service.addLaws(principal, revisionHistoryId, classTreeIds));
    }

    /** AS-IS ics.Ics19_RevisionRelateIcs.delete → 지운 건수 */
    @DeleteMapping("/laws")
    public ApiResponse<Integer> deleteLaws(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> revisionRelateIcsIds) {
        return ApiResponse.ok(service.deleteLaws(principal, revisionRelateIcsIds));
    }
}
