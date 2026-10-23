package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmMsgReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmPrintReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmStatusReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeOption;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsDcrPreconfirmService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 준감인 사전확인대장 (AS-IS Ics40_Tab_DcrPreConfirm·Ics40_Tab_DcrReviewConfirm·Ics41_Lookup_DcrType·Ics40_Edit_Msg → server/ics/Ics40_DcrPreconfirm·Ics41_DcrType) — #1425(M05), #1499(M06) */
@RestController
@RequestMapping("/api/v1/ics/dcr-preconfirms")
@RequiredArgsConstructor
public class IcsDcrPreconfirmController {

    private final IcsDcrPreconfirmService service;

    /** AS-IS ics.Ics40_DcrPreconfirm.selectByConfirm */
    @GetMapping
    public ApiResponse<List<IcsDcrPreconfirmRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                         @RequestParam(defaultValue = "%") String dcrTypeCode,
                                                         @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, dcrTypeCode, searchText));
    }

    /** AS-IS ics.Ics40_DcrPreconfirm.selectByReviewConfirm (M06) */
    @GetMapping("/review")
    public ApiResponse<List<IcsDcrPreconfirmRes>> searchReview(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                               @RequestParam(defaultValue = "%") String dcrTypeCode,
                                                               @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchReview(principal, startDate, closeDate, dcrTypeCode, searchText));
    }

    /** 회사 설정 dcrPreconfirmSkipYn (그리드 열 구성) */
    @GetMapping("/skip-yn")
    public ApiResponse<Boolean> skipYn(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.skipYn(principal));
    }

    /** AS-IS ics.Ics40_DcrPreconfirm.updateByStatus → 처리 건수 */
    @PutMapping("/status")
    public ApiResponse<Integer> updateByStatus(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsDcrPreconfirmStatusReq req) {
        return ApiResponse.ok(service.updateByStatus(principal, req));
    }

    /** AS-IS ics.Ics40_DcrPreconfirm.modelUpdate (Ics40_Edit_Msg) → 저장된 행 */
    @PutMapping("/{dcrPreconfirmId}/confirm-msg")
    public ApiResponse<IcsDcrPreconfirmRes> updateConfirmMsg(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long dcrPreconfirmId,
                                                             @RequestBody IcsDcrPreconfirmMsgReq req) {
        return ApiResponse.ok(service.updateConfirmMsg(principal, dcrPreconfirmId, req.confirmMsg()));
    }

    /** AS-IS sys.Sys99_Print.insertRdDcrPreConfirm → 출력 그룹 ID (RD rdGroupId) */
    @PostMapping("/rd-download")
    public ApiResponse<String> rdDownload(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsDcrPreconfirmPrintReq req) {
        return ApiResponse.ok(service.insertRd(principal, req));
    }

    // ── 대장분류 ──

    /** AS-IS ics.Ics41_DcrType.selectByText (전체) */
    @GetMapping("/dcr-types")
    public ApiResponse<List<IcsDcrTypeRes>> dcrTypes(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchDcrTypes(principal));
    }

    /** AS-IS sys.Sys00_Common.selectIcs41DcrType (콤보) */
    @GetMapping("/dcr-types/options")
    public ApiResponse<List<IcsDcrTypeOption>> dcrTypeOptions(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.dcrTypeOptions(principal));
    }

    /** AS-IS ics.Ics41_DcrType.adYnCheck — 없는 코드면 data가 null */
    @GetMapping("/dcr-types/ad-yn")
    public ApiResponse<IcsDcrTypeRes> adYn(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String dcrTypeCode) {
        return ApiResponse.ok(service.adYn(principal, dcrTypeCode));
    }

    /** AS-IS ics.Ics40_DcrPreconfirm.selectByCompanyId — 사전확인대장에 쓰인 대장분류코드 */
    @GetMapping("/dcr-types/used-codes")
    public ApiResponse<List<String>> usedCodes(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.usedDcrTypeCodes(principal));
    }

    /** AS-IS ics.Ics41_DcrType.update → 저장된 행(요청 순서) */
    @PutMapping("/dcr-types")
    public ApiResponse<List<IcsDcrTypeRes>> saveDcrTypes(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcsDcrTypeSaveReq> rows) {
        return ApiResponse.ok(service.saveDcrTypes(principal, rows));
    }

    /** AS-IS ics.Ics41_DcrType.delete → 지운 건수 */
    @DeleteMapping("/dcr-types")
    public ApiResponse<Integer> deleteDcrTypes(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> dcrTypeIds) {
        return ApiResponse.ok(service.deleteDcrTypes(principal, dcrTypeIds));
    }
}
