package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthEvalReq;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltBookMonthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 임직원매매 월말 평가금액 (AS-IS Flt10_Tab_RealTransaction 아래쪽 → server/flt/Flt12_BookMonth) */
@RestController
@RequestMapping("/api/v1/flt/book-months")
@RequiredArgsConstructor
public class FltBookMonthController {

    private final FltBookMonthService service;

    /** AS-IS flt.Flt12_BookMonth.selectByBookDate */
    @GetMapping
    public ApiResponse<List<BookMonthRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) Long accountId,
                                                  @RequestParam String startDate,
                                                  @RequestParam String closeDate,
                                                  @RequestParam(required = false) String searchText,
                                                  @RequestParam(defaultValue = "false") boolean myAccountYn) {
        return ApiResponse.ok(service.search(principal, accountId, startDate, closeDate, searchText, myAccountYn));
    }

    /** AS-IS flt.Flt12_BookMonth.checkBookMonth — 평가금액이 비어 있으면 오류 */
    @GetMapping("/check")
    public ApiResponse<Integer> check(@AuthenticationPrincipal UserPrincipal principal,
                                      @RequestParam String startDate,
                                      @RequestParam String closeDate,
                                      @RequestParam(defaultValue = "false") boolean myAccountYn) {
        service.check(principal, startDate, closeDate, myAccountYn);
        return ApiResponse.ok(1);
    }

    /** AS-IS flt.Flt12_BookMonth.update (GridUpdate) */
    @PutMapping
    public ApiResponse<List<BookMonthRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BookMonthSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS flt.Flt12_BookMonth.insertBookAmt (상장주식 평가처리·평가금액을 취득금액으로 저장) → 처리한 건수 */
    @PostMapping("/evaluate")
    public ApiResponse<Integer> evaluate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BookMonthEvalReq req) {
        return ApiResponse.ok(service.evaluate(principal, req));
    }
}
