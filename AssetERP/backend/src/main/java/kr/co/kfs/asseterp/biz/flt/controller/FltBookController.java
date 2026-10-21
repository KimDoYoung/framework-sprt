package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookRes;
import kr.co.kfs.asseterp.biz.flt.dto.LockupStdRes;
import kr.co.kfs.asseterp.biz.flt.service.FltBookService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 임직원매매 보유내역 (AS-IS Flt11_Lookup_BookList → server/flt/Flt11_Book). */
@RestController
@RequestMapping("/api/v1/flt/books")
@RequiredArgsConstructor
public class FltBookController {

    private final FltBookService service;

    /** AS-IS flt.Flt11_Book.selectByText (expectYn=false) — 기준일 보유잔고, 로그인 사용자 본인 */
    @GetMapping
    public ApiResponse<List<BookRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam(required = false) Long accountId,
                                             @RequestParam String stdDate,
                                             @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, accountId, stdDate, searchText));
    }

    /** AS-IS flt.Flt11_Book.selectByText2 (expectYn=true) — 로그인 사용자 본인 */
    @GetMapping("/expect")
    public ApiResponse<List<BookRes>> searchExpect(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) Long accountId,
                                                   @RequestParam String stdDate,
                                                   @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchExpect(principal, accountId, stdDate, searchText));
    }

    /** AS-IS flt.Flt01_CompanyStd.selectByDate (의무보유기간 기준) → 없으면 null */
    @GetMapping("/lockup-std")
    public ApiResponse<LockupStdRes> lockupStd(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.lockupStd(principal, stdDate));
    }
}
