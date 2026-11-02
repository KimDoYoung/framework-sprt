package kr.co.kfs.asseterp.biz.mkt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktHistoryRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktHistorySaveReq;
import kr.co.kfs.asseterp.biz.mkt.dto.MktRelateFundRes;
import kr.co.kfs.asseterp.biz.mkt.service.MktHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** Z05 업무활동내역 (AS-IS Mkt03_Grid_History·Mkt03_Lookup_History → server/mkt/Mkt03_History·Mkt04_RelateFund) */
@RestController
@RequestMapping("/api/v1/mkt/histories")
@RequiredArgsConstructor
public class MktHistoryController {

    private final MktHistoryService service;

    /** AS-IS getSeq */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS mkt.Mkt03_History.selectByTargetCompanyId */
    @GetMapping
    public ApiResponse<List<MktHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(defaultValue = "%") String itemType,
                                                   @RequestParam(required = false) Long targetCompanyId,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                   @RequestParam(defaultValue = "false") boolean allContactYn,
                                                   @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, itemType, targetCompanyId, startDate, closeDate, allContactYn, searchText));
    }

    /** Z06 AS-IS mkt.Mkt03_History.selectByTargetCompanyId(isManager=true) — 업무활동등록(관리자) */
    @GetMapping("/manage")
    public ApiResponse<List<MktHistoryRes>> searchManage(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) Long targetCompanyId,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                         @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchManage(principal, targetCompanyId, startDate, closeDate, searchText));
    }

    /** AS-IS mkt.Mkt03_History.selectById */
    @GetMapping("/{id:\\d+}")
    public ApiResponse<MktHistoryRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return ApiResponse.ok(service.get(principal, id));
    }

    /** AS-IS mkt.Mkt03_History.updateOne + mkt.Mkt04_RelateFund.updateByList */
    @PutMapping
    public ApiResponse<MktHistoryRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MktHistorySaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS mkt.Mkt03_History.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS mkt.Mkt04_RelateFund.selectByHistoryId */
    @GetMapping("/{id:\\d+}/relate-funds")
    public ApiResponse<List<MktRelateFundRes>> relateFunds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return ApiResponse.ok(service.searchRelateFunds(principal, id));
    }

    /** AS-IS mkt.Mkt04_RelateFund.delete → 지운 건수 */
    @DeleteMapping("/{id:\\d+}/relate-funds")
    public ApiResponse<Integer> deleteRelateFunds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id,
                                                  @RequestBody List<Long> relateFundIds) {
        return ApiResponse.ok(service.deleteRelateFunds(principal, id, relateFundIds));
    }
}
