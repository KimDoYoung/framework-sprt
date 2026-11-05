package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampCheckRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampConfirmReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampDateReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampListRes;
import kr.co.kfs.asseterp.biz.apr.service.AprRelateStampService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** AS-IS apr.Apr19_RelateStamp — U2-03 인감날인대장(구)·부서 인감날인대장(구)·인감날인본 업로드확인(구) */
@RestController
@RequestMapping("/api/v1/apr/relate-stamps")
@RequiredArgsConstructor
public class AprRelateStampController {

    private final AprRelateStampService service;

    /** AS-IS apr.Apr19_RelateStamp.selectBySearchText — 구)인감날인대장 */
    @GetMapping
    public ApiResponse<List<AprRelateStampListRes>> searchStampList(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                    @RequestParam(required = false) Long stampId,
                                                                    @RequestParam(defaultValue = "false") boolean outYn,
                                                                    @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchStampList(principal, startDate, closeDate, stampId, outYn, searchText));
    }

    /** AS-IS apr.Apr19_RelateStamp.selectByOrgCodeId — 부서 인감날인대장(구) */
    @GetMapping("/by-org")
    public ApiResponse<List<AprRelateStampListRes>> searchOrgStampList(@AuthenticationPrincipal UserPrincipal principal,
                                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                       @RequestParam(required = false) Long stampId,
                                                                       @RequestParam(defaultValue = "false") boolean outYn,
                                                                       @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchOrgStampList(principal, startDate, closeDate, stampId, outYn, searchText));
    }

    /** sys.Sys99_Print.insertRdStampList / insertRdOrgStampList → rdGroupId */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                       @RequestParam(required = false) Long stampId,
                                       @RequestParam(defaultValue = "false") boolean outYn,
                                       @RequestParam(required = false) String searchText,
                                       @RequestParam(defaultValue = "false") boolean org) {
        return ApiResponse.ok(service.insertStampListPrint(principal, startDate, closeDate, stampId, outYn, searchText, org));
    }

    /** AS-IS apr.Apr19_RelateStamp.selectById — 날인일자 수정 창이 여는 값 */
    @GetMapping("/{relateStampId}/stamp-date")
    public ApiResponse<LocalDate> getStampDate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long relateStampId) {
        return ApiResponse.ok(service.getStampDate(principal, relateStampId));
    }

    /** AS-IS apr.Apr19_RelateStamp.modelUpdate — 날인일자 수정 */
    @PutMapping("/stamp-date")
    public ApiResponse<Integer> updateStampDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AprRelateStampDateReq req) {
        return ApiResponse.ok(service.updateStampDate(principal, req));
    }

    /** AS-IS apr.Apr19_RelateStamp.selectByStampCheckList — 인감날인본 업로드확인(구) */
    @GetMapping("/stamp-check")
    public ApiResponse<List<AprRelateStampCheckRes>> searchStampCheck(@AuthenticationPrincipal UserPrincipal principal,
                                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                      @RequestParam(required = false) Long stampId,
                                                                      @RequestParam(defaultValue = "false") boolean notStampFileYn) {
        return ApiResponse.ok(service.searchStampCheck(principal, startDate, closeDate, stampId, notStampFileYn));
    }

    /** AS-IS apr.Apr19_RelateStamp.update — [확인]·[확인취소] */
    @PutMapping("/confirm")
    public ApiResponse<Integer> confirm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AprRelateStampConfirmReq req) {
        return ApiResponse.ok(service.confirm(principal, req));
    }
}
