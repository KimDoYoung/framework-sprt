package kr.co.kfs.asseterp.biz.act.controller;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubRdReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalRealAccountRes;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.nio.charset.StandardCharsets;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlListRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRdReq;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalLineRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalPayMonthRes;
import kr.co.kfs.asseterp.biz.act.service.ActJournalDtlService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 급여 전표확인 Pay10_Lookup_Journal (S18) — AS-IS act.Act03_JournalDtl */
@RestController
@RequestMapping("/api/v1/act/journal-dtls")
@RequiredArgsConstructor
public class ActJournalDtlController {

    private final ActJournalDtlService service;

    /** act.Act03_JournalDtl.selectPayMonth (payType = 월급여지급구분 PayMonthCode) */
    @GetMapping("/pay-month")
    public ApiResponse<List<JournalPayMonthRes>> payMonth(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate,
                                                          @RequestParam String payType) {
        return ApiResponse.ok(service.searchPayMonth(principal, payDate, payType));
    }

    /** act.Act03_JournalDtl.selectByAstId (U01 일일자금관리 입금·출금 그리드) — drCrType D 입금 / C 출금 */
    @GetMapping("/by-ast")
    public ApiResponse<List<JournalDtlRes>> byAst(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                  @RequestParam Long astId, @RequestParam String drCrType) {
        return ApiResponse.ok(service.searchByAstId(principal, date, astId, drCrType));
    }

    /** act.Act03_JournalDtl.selectByJournalId (U04 세금/4대보험 등록의 아래 분개 그리드) */
    @GetMapping("/by-journal")
    public ApiResponse<List<JournalLineRes>> byJournal(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam Long journalId) {
        return ApiResponse.ok(service.searchByJournalId(principal, journalId));
    }

    /** act.Act03_JournalDtl.selectByCompanyId — 분개장 Act02_Tab_Journal (X15). abroType 0 전체(기본) · 1 국내 · 2 국외 */
    @GetMapping
    public ApiResponse<List<JournalDtlListRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                       @RequestParam(required = false) Long corpId,
                                                       @RequestParam(required = false) String searchText,
                                                       @RequestParam(required = false) String trCode,
                                                       @RequestParam(required = false, defaultValue = "0") String abroType) {
        return ApiResponse.ok(service.searchList(principal, startDate, closeDate, corpId, searchText, trCode, abroType));
    }

    /** sys.Sys99_Print.insertRdJournal — 출력그룹ID */
    @PostMapping("/rd")
    public ApiResponse<Long> rd(@AuthenticationPrincipal UserPrincipal principal, @RequestBody JournalDtlRdReq req) {
        return ApiResponse.ok(service.insertRd(principal, req));
    }

    // ---- 계정별원장 Act02_Tab_JournalSub (X17)

    /** act.Act03_JournalDtl.selectByAccountCode */
    @GetMapping("/by-account")
    public ApiResponse<List<JournalSubRes>> byAccount(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                      @RequestParam String accountCode,
                                                      @RequestParam(required = false) String trCode,
                                                      @RequestParam(required = false) Long corpId,
                                                      @RequestParam(required = false) Long depositId,
                                                      @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchByAccountCode(principal, startDate, closeDate, accountCode, trCode, corpId, depositId, searchText));
    }

    /** act.Act02_Journal.getAccountCode — 기간에 분개가 있는 계정 */
    @GetMapping("/account-codes")
    public ApiResponse<List<JournalAccountRes>> accountCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.searchAccountCodes(principal, startDate, closeDate));
    }

    /** act.Act13_RealAccountMap.selectByAstClassTreeId — 관리계좌(종목분류)의 실계정, 없으면 data null */
    @GetMapping("/real-account")
    public ApiResponse<JournalRealAccountRes> realAccount(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.getRealAccount(principal, classTreeId));
    }

    /** sys.Sys99_Print.insertRdJournalSub — 출력그룹ID */
    @PostMapping("/by-account/rd")
    public ApiResponse<Long> rdByAccount(@AuthenticationPrincipal UserPrincipal principal, @RequestBody JournalSubRdReq req) {
        return ApiResponse.ok(service.insertRdSub(principal, req));
    }

    /** ExcelDownload act02List — accountCode가 없거나 none이면 전체 계정 */
    @GetMapping("/by-account/excel")
    public ResponseEntity<byte[]> excelByAccount(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                 @RequestParam(required = false) String accountCode) {
        byte[] body = service.downloadAccountExcel(principal, startDate, closeDate, accountCode);
        String fileName = "계정별원장(" + startDate + "~" + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }
}
