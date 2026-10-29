package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralMessageRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralMessageSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsFloralRequestService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 경조구분별 문구 (AS-IS Bbs22_Lookup_FloralMessage → server/bbs/Bbs22_FloralMessage) */
@RestController
@RequestMapping("/api/v1/bbs/floral-messages")
@RequiredArgsConstructor
public class BbsFloralMessageController {

    private final BbsFloralRequestService service;

    /** AS-IS bbs.Bbs22_FloralMessage.checkOccasionsCode 뒤 selectByCompanyId (창을 열 때) */
    @GetMapping
    public ApiResponse<List<FloralMessageRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchMessages(principal));
    }

    /** AS-IS bbs.Bbs22_FloralMessage.update → 다시 읽은 목록 */
    @PutMapping
    public ApiResponse<List<FloralMessageRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<FloralMessageSaveReq> rows) {
        return ApiResponse.ok(service.updateMessages(principal, rows));
    }
}
