package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryAdminRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionLawRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsRevisionHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 법규 개정내역 (AS-IS Ics20_Lookup_RevisionHistory·Ics20_Lookup_Content·Ics20_Tab_RevisionHistory → server/ics/Ics20_RevisionHistory) */
@RestController
@RequestMapping("/api/v1/ics/revision-histories")
@RequiredArgsConstructor
public class IcsRevisionHistoryController {

    private final IcsRevisionHistoryService service;

    /** AS-IS ics.Ics20_RevisionHistory.selectByClassTreeId */
    @GetMapping
    public ApiResponse<List<IcsRevisionHistoryRes>> search(@RequestParam Long classTreeId) {
        return ApiResponse.ok(service.searchByClassTreeId(classTreeId));
    }

    /** AS-IS ics.Ics20_RevisionHistory.selectByDate (Ics20_Tab_RevisionHistory) */
    @GetMapping("/period")
    public ApiResponse<List<IcsRevisionHistoryAdminRes>> searchByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
            @RequestParam(defaultValue = "%") String financeAgencyCode,
            @RequestParam(defaultValue = "") String searchText,
            @RequestParam(defaultValue = "") String relatedLawSearchText,
            @RequestParam(defaultValue = "reg") String dateType) {
        return ApiResponse.ok(service.searchByDate(startDate, closeDate, financeAgencyCode, searchText, relatedLawSearchText, dateType));
    }

    /** AS-IS ics.Ics19_RevisionRelateIcs.selectByRevisionHistoryId (Ics20_Edit_RevisionHistory 연결법규) */
    @GetMapping("/{revisionHistoryId}/laws")
    public ApiResponse<List<IcsRevisionLawRes>> searchLaws(@PathVariable Long revisionHistoryId) {
        return ApiResponse.ok(service.searchLaws(revisionHistoryId));
    }

    /** AS-IS ics.Ics20_RevisionHistory.updateContent */
    @PutMapping("/{revisionHistoryId}/content")
    public ApiResponse<Void> updateContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long revisionHistoryId,
                                           @RequestBody IcsRevisionContentReq req) {
        service.updateContent(principal, revisionHistoryId, req.content());
        return ApiResponse.ok(null);
    }
}
