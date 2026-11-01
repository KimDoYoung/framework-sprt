package kr.co.kfs.asseterp.biz.bmt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtHistoryRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtHistorySaveReq;
import kr.co.kfs.asseterp.biz.bmt.service.BmtHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 전산장비 사용자이력 (AS-IS Bmt11_TabPage_History → server/bmt/Bmt11_History) */
@RestController
@RequestMapping("/api/v1/bmt/histories")
@RequiredArgsConstructor
public class BmtHistoryController {

    private final BmtHistoryService service;

    /** AS-IS bmt.Bmt11_History.selectByInfoId */
    @GetMapping
    public ApiResponse<List<BmtHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long infoId) {
        return ApiResponse.ok(service.search(principal, infoId));
    }

    /** AS-IS bmt.Bmt11_History.update — 변경 행 목록 → 다시 읽은 행들(요청 순서) */
    @PutMapping
    public ApiResponse<List<BmtHistoryRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long infoId,
                                                 @RequestBody List<BmtHistorySaveReq> rows) {
        return ApiResponse.ok(service.save(principal, infoId, rows));
    }

    /** AS-IS bmt.Bmt11_History.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> historyIds) {
        return ApiResponse.ok(service.delete(principal, historyIds));
    }
}
