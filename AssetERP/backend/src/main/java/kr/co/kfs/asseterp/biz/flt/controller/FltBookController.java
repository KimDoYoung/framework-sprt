package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookListRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookRes;
import kr.co.kfs.asseterp.biz.flt.dto.LockupStdRes;
import kr.co.kfs.asseterp.biz.flt.service.FltBookService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
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

    /** AS-IS flt.Flt11_Book.selectByBookList (I09 보유내역조회) — 기준일 보유내역, 로그인 사용자 본인 */
    @GetMapping("/list")
    public ApiResponse<List<BookListRes>> searchList(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam String baseDate,
                                                     @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchList(principal, baseDate, searchText));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdBookList + RD 리포트 Flt11_Rd_BookList → 조회 결과 xlsx) */
    @GetMapping("/list/excel")
    public ResponseEntity<byte[]> downloadList(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam String baseDate,
                                               @RequestParam(required = false) String searchText) {
        byte[] body = service.downloadList(principal, baseDate, searchText);
        String fileName = "임직원매매 보유내역(" + baseDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS flt.Flt11_Book.selectByBookList (J04 준감인 보유내역조회) — personId 생략 = 회사 전체 사원 */
    @GetMapping("/admin/list")
    public ApiResponse<List<BookListRes>> searchListAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(required = false) Long personId,
                                                          @RequestParam String baseDate,
                                                          @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchListAdmin(principal, personId, baseDate, searchText));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdBookListAdmin + RD 리포트 → 조회 결과 xlsx) */
    @GetMapping("/admin/list/excel")
    public ResponseEntity<byte[]> downloadListAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long personId,
                                                    @RequestParam String baseDate,
                                                    @RequestParam(required = false) String searchText) {
        byte[] body = service.downloadListAdmin(principal, personId, baseDate, searchText);
        String fileName = "임직원매매 보유내역(" + baseDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS flt.Flt01_CompanyStd.selectByDate (의무보유기간 기준) → 없으면 null */
    @GetMapping("/lockup-std")
    public ApiResponse<LockupStdRes> lockupStd(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.lockupStd(principal, stdDate));
    }
}
