package kr.co.kfs.asseterp.biz.chk.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListCopyReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListSaveReq;
import kr.co.kfs.asseterp.biz.chk.service.ChkDailyListService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 일일점검내역 관리(관리자) (AS-IS Chk02_Tab_DailyListAdmin·Chk02_Edit_DailyList → server/chk/Chk02_DailyList) — 메뉴 #1245 */
@RestController
@RequestMapping("/api/v1/chk/daily-lists")
@RequiredArgsConstructor
public class ChkDailyListController {

    private final ChkDailyListService service;

    /** AS-IS chk.Chk02_DailyList.selectByAdmin — useYn: true/false, 없으면 전체 */
    @GetMapping
    public ApiResponse<List<ChkDailyListRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam Long classTreeId,
                                                     @RequestParam(required = false) String useYn,
                                                     @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, classTreeId, useYn, searchText));
    }

    /** AS-IS chk.Chk02_DailyList.modelUpdate (새 행) → 저장된 행 */
    @PostMapping
    public ApiResponse<ChkDailyListRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChkDailyListSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS chk.Chk02_DailyList.modelUpdate (수정) → 저장된 행 */
    @PutMapping("/{dailyListId}")
    public ApiResponse<ChkDailyListRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long dailyListId,
                                               @RequestBody ChkDailyListSaveReq req) {
        return ApiResponse.ok(service.update(principal, dailyListId, req));
    }

    /** AS-IS chk.Chk02_DailyList.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> dailyListIds) {
        return ApiResponse.ok(service.delete(principal, dailyListIds));
    }

    /** AS-IS chk.Chk02_DailyList.insert (점검내역복사) → 처리한 (고객사 × 점검내역) 수 */
    @PostMapping("/copy")
    public ApiResponse<Integer> copy(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChkDailyListCopyReq req) {
        return ApiResponse.ok(service.copy(principal, req));
    }
}
