package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsRevisionHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법규 개정내역 (AS-IS Ics20_Lookup_RevisionHistory·Ics20_Lookup_Content → server/ics/Ics20_RevisionHistory) */
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

    /** AS-IS ics.Ics20_RevisionHistory.updateContent */
    @PutMapping("/{revisionHistoryId}/content")
    public ApiResponse<Void> updateContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long revisionHistoryId,
                                           @RequestBody IcsRevisionContentReq req) {
        service.updateContent(principal, revisionHistoryId, req.content());
        return ApiResponse.ok(null);
    }
}
