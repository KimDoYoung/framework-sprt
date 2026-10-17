package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestLawContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestRes;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsUserRequestService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 법규등록요청 (AS-IS Ics17_Tab_UserRequestAdmin → server/ics/Ics17_UserRequest) */
@RestController
@RequestMapping("/api/v1/ics/user-requests")
@RequiredArgsConstructor
public class IcsUserRequestController {

    private final IcsUserRequestService service;

    /** AS-IS ics.Ics17_UserRequest.selectBySearchTextAdmin (관리자) */
    @GetMapping("/admin")
    public ApiResponse<List<UserRequestRes>> searchAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam String startDate,
                                                         @RequestParam String closeDate,
                                                         @RequestParam(required = false) String companyText,
                                                         @RequestParam(required = false) String stateCode,
                                                         @RequestParam(defaultValue = "false") boolean unconfirmedOnly,
                                                         @RequestParam(defaultValue = "false") boolean incompleteOnly,
                                                         @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchAdmin(principal, startDate, closeDate, companyText, stateCode, unconfirmedOnly, incompleteOnly, searchText));
    }

    /** AS-IS ics.Ics17_UserRequest.update (관리자) → 저장된 행 */
    @PutMapping("/{userRequestId}")
    public ApiResponse<UserRequestRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long userRequestId,
                                              @RequestBody UserRequestSaveReq req) {
        return ApiResponse.ok(service.update(principal, userRequestId, req));
    }

    /** AS-IS ics.Ics17_UserRequest.updateLawContent → 저장된 행 */
    @PutMapping("/{userRequestId}/law-content")
    public ApiResponse<UserRequestRes> updateLawContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long userRequestId,
                                                        @RequestBody UserRequestLawContentReq req) {
        return ApiResponse.ok(service.updateLawContent(principal, userRequestId, req.lawContent()));
    }
}
