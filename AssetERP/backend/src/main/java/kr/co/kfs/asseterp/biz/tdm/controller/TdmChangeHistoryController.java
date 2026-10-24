package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChangeDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChangeHistoryRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChangeHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무 변경/삭제 이력 (AS-IS server/tdm/Tdm95_ChangeHistory·Tdm96_ChangeDetail) */
@RestController
@RequestMapping("/api/v1/tdm/change-histories")
@RequiredArgsConstructor
public class TdmChangeHistoryController {

    private final TdmChangeHistoryService service;

    /** AS-IS tdm.Tdm95_ChangeHistory.selectByTargetId */
    @GetMapping
    public ApiResponse<List<ChangeHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam String targetTable,
                                                      @RequestParam(required = false) Long targetId,
                                                      @RequestParam(required = false) String changeType,
                                                      @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, targetTable, targetId, changeType, searchText));
    }

    /** AS-IS tdm.Tdm96_ChangeDetail.selectByChangeHistoryId */
    @GetMapping("/{changeHistoryId}/details")
    public ApiResponse<List<ChangeDetailRes>> searchDetails(@AuthenticationPrincipal UserPrincipal principal,
                                                            @PathVariable Long changeHistoryId) {
        return ApiResponse.ok(service.searchDetails(principal, changeHistoryId));
    }
}
