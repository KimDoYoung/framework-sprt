package kr.co.kfs.asseterp.biz.chk.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteAnswerReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteCreateReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteItem;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteTextReq;
import kr.co.kfs.asseterp.biz.chk.service.ChkDailyListWriteService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 일일점검내역 작성 (AS-IS Chk03_Tab_DailyListWrite·Chk03_Edit_Reason·Chk03_Edit_Note → server/chk/Chk03_DailyListWrite) — 메뉴 #1241 */
@RestController
@RequestMapping("/api/v1/chk/daily-list-writes")
@RequiredArgsConstructor
public class ChkDailyListWriteController {

    private final ChkDailyListWriteService service;

    /** AS-IS chk.Chk02_DailyList.selectByPersonId — 점검일자(date)의 내 점검내역과 작성 행 */
    @GetMapping
    public ApiResponse<List<ChkDailyListWriteRes>> list(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam Long classTreeId,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                        @RequestParam(defaultValue = "false") boolean checkBox) {
        return ApiResponse.ok(service.list(principal, classTreeId, date, checkBox));
    }

    /** AS-IS chk.Chk03_DailyListWrite.updateAnswerCode → 작성 행 */
    @PutMapping("/answers")
    public ApiResponse<ChkDailyListWriteItem> updateAnswerCode(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChkDailyListWriteAnswerReq req) {
        return ApiResponse.ok(service.updateAnswerCode(principal, req));
    }

    /** AS-IS chk.Chk03_DailyListWrite.modelUpdate (답변 없는 새 행) → 작성 행 */
    @PostMapping
    public ApiResponse<ChkDailyListWriteItem> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChkDailyListWriteCreateReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS chk.Chk03_DailyListWrite.selectById */
    @GetMapping("/{dailyListWriteId}")
    public ApiResponse<ChkDailyListWriteItem> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long dailyListWriteId) {
        return ApiResponse.ok(service.get(principal, dailyListWriteId));
    }

    /** AS-IS Chk03_Edit_Reason.update → chk.Chk03_DailyListWrite.modelUpdate (점검결과) */
    @PutMapping("/{dailyListWriteId}/reason")
    public ApiResponse<ChkDailyListWriteItem> updateReason(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long dailyListWriteId,
                                                           @RequestBody ChkDailyListWriteTextReq req) {
        return ApiResponse.ok(service.updateReason(principal, dailyListWriteId, req.text()));
    }

    /** AS-IS Chk03_Edit_Note.update → chk.Chk03_DailyListWrite.modelUpdate (비고) */
    @PutMapping("/{dailyListWriteId}/note")
    public ApiResponse<ChkDailyListWriteItem> updateNote(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long dailyListWriteId,
                                                         @RequestBody ChkDailyListWriteTextReq req) {
        return ApiResponse.ok(service.updateNote(principal, dailyListWriteId, req.text()));
    }
}
