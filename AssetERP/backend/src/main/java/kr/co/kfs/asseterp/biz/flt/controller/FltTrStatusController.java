package kr.co.kfs.asseterp.biz.flt.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltTrStatusService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 임직원매매현황 메모 (AS-IS Flt15_Lookup_Note → server/flt/Flt15_TrStatus) */
@RestController
@RequestMapping("/api/v1/flt/tr-statuses")
@RequiredArgsConstructor
public class FltTrStatusController {

    private final FltTrStatusService service;

    /** AS-IS flt.Flt15_TrStatus.selectByPersonId — 없으면 빈 메모 행을 만들어서 돌려준다 */
    @GetMapping
    public ApiResponse<TrStatusRes> get(@AuthenticationPrincipal UserPrincipal principal,
                                        @RequestParam Long personId, @RequestParam String stdDate) {
        return ApiResponse.ok(service.get(principal, personId, stdDate));
    }

    /** AS-IS flt.Flt15_TrStatus.update */
    @PutMapping
    public ApiResponse<TrStatusRes> update(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TrStatusSaveReq req) {
        return ApiResponse.ok(service.update(principal, req));
    }
}
