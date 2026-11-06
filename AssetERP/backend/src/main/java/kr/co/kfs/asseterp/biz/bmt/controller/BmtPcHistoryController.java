package kr.co.kfs.asseterp.biz.bmt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtPcHistoryRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtPcHistorySaveReq;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtPcListRes;
import kr.co.kfs.asseterp.biz.bmt.service.BmtPcHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

/** PC 이력 (AS-IS Bmt10_Lookup_History·Bmt12_Edit_PcHistory → server/bmt/Bmt12_PcHistory) */
@RestController
@RequestMapping("/api/v1/bmt/pc-histories")
@RequiredArgsConstructor
public class BmtPcHistoryController {

    private final BmtPcHistoryService service;

    /** AS-IS bmt.Bmt12_PcHistory.selectByInfoId */
    @GetMapping
    public ApiResponse<List<BmtPcHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long infoId) {
        return ApiResponse.ok(service.search(principal, infoId));
    }

    /** AS-IS bmt.Bmt12_PcHistory.selectByCompanyId — PC장비상세 목록(W19) */
    @GetMapping("/list")
    public ApiResponse<List<BmtPcListRes>> searchList(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                                      @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchList(principal, baseDate, searchText));
    }

    /** AS-IS bmt.Bmt12_PcHistory.deleteByInfoId → 지운 건수 */
    @DeleteMapping("/by-info/{infoId}")
    public ApiResponse<Integer> deleteByInfoId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId) {
        return ApiResponse.ok(service.deleteByInfoId(principal, infoId));
    }

    /** AS-IS bmt.Bmt12_PcHistory.modelUpdate (신규·추가등록) */
    @PostMapping
    public ApiResponse<BmtPcHistoryRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BmtPcHistorySaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS bmt.Bmt12_PcHistory.modelUpdate (정보수정) */
    @PutMapping("/{pcHistoryId}")
    public ApiResponse<BmtPcHistoryRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long pcHistoryId,
                                               @RequestBody BmtPcHistorySaveReq req) {
        return ApiResponse.ok(service.update(principal, pcHistoryId, req));
    }

    /** AS-IS bmt.Bmt12_PcHistory.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> pcHistoryIds) {
        return ApiResponse.ok(service.delete(principal, pcHistoryIds));
    }
}
