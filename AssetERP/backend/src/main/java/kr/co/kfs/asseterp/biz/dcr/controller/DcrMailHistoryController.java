package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailFileRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailHistoryRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrMailHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 발신메일목록 (AS-IS Dcr10_Tab_MailHistory·Dcr10_Lookup_MailViwer → server/dcr/Dcr10_MailHistory, G14) */
@RestController
@RequestMapping("/api/v1/dcr/mail-histories")
@RequiredArgsConstructor
public class DcrMailHistoryController {

    private final DcrMailHistoryService service;

    /** AS-IS dcr.Dcr10_MailHistory.selectBySenderEmail — 날짜는 'yyyy-MM-dd' */
    @GetMapping
    public ApiResponse<List<DcrMailHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam String startDate, @RequestParam String endDate,
                                                       @RequestParam(required = false, defaultValue = "") String titleText,
                                                       @RequestParam(required = false) Long fundId,
                                                       @RequestParam(required = false, defaultValue = "전체") String mailGubun) {
        return ApiResponse.ok(service.search(principal, startDate, endDate, titleText, fundId, mailGubun));
    }

    /** AS-IS sys.Sys10_File.selectMailFileHistory */
    @GetMapping("/{mailHistoryId}/files")
    public ApiResponse<List<DcrMailFileRes>> searchFiles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long mailHistoryId) {
        return ApiResponse.ok(service.searchFiles(principal, mailHistoryId));
    }
}
