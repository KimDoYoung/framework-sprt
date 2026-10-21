package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpApprDocRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.InvestLimitRes;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeCodeRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrItemRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrListRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusReq;
import kr.co.kfs.asseterp.biz.flt.dto.TrUnfillReq;
import kr.co.kfs.asseterp.biz.flt.dto.ViolateRes;
import kr.co.kfs.asseterp.biz.flt.service.FltTrService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** 임직원매매 사전신고 (AS-IS Flt10_Tab_BuyReport, Flt10_Lookup_Item, Flt10_Lookup_ExpectTr → server/flt/Flt10_Tr 외) */
@RestController
@RequestMapping("/api/v1/flt/trs")
@RequiredArgsConstructor
public class FltTrController {

    private final FltTrService service;

    /** AS-IS flt.Flt10_Tr.selectByAccountId — 로그인 사용자 본인. regDate가 있으면 그날, 없으면 startDate~closeDate */
    @GetMapping
    public ApiResponse<List<TrRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam String trType,
                                           @RequestParam(required = false) Long accountId,
                                           @RequestParam(required = false) String regDate,
                                           @RequestParam(required = false) String startDate,
                                           @RequestParam(required = false) String closeDate,
                                           @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, trType, accountId, regDate, startDate, closeDate, searchText));
    }

    /** AS-IS flt.Flt10_Tr.selectByTrList (I08 매매내역조회) — 로그인 사용자 본인, trType·ioType 생략 = 전체 */
    @GetMapping("/list")
    public ApiResponse<List<TrListRes>> searchList(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam String startDate,
                                                   @RequestParam String closeDate,
                                                   @RequestParam(defaultValue = "true") boolean preTrYn,
                                                   @RequestParam(required = false) String trType,
                                                   @RequestParam(required = false) String ioType,
                                                   @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchList(principal, startDate, closeDate, preTrYn, trType, ioType, searchText));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdTrList + RD 리포트 Flt10_Rd_TrList → 조회 결과 xlsx) */
    @GetMapping("/list/excel")
    public ResponseEntity<byte[]> downloadList(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam String startDate,
                                               @RequestParam String closeDate,
                                               @RequestParam(defaultValue = "true") boolean preTrYn,
                                               @RequestParam(required = false) String trType,
                                               @RequestParam(required = false) String ioType,
                                               @RequestParam(required = false) String searchText) {
        byte[] body = service.downloadList(principal, startDate, closeDate, preTrYn, trType, ioType, searchText);
        String fileName = "임직원 매매내역(" + startDate + " ~ " + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS flt.Flt10_Tr.selectByTrList (J03 준감인 매매내역조회) — personId 생략 = 회사 전체 사원, trType·ioType 생략 = 전체 */
    @GetMapping("/admin/list")
    public ApiResponse<List<TrListRes>> searchListAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) Long personId,
                                                        @RequestParam String startDate,
                                                        @RequestParam String closeDate,
                                                        @RequestParam(defaultValue = "true") boolean preTrYn,
                                                        @RequestParam(required = false) String trType,
                                                        @RequestParam(required = false) String ioType,
                                                        @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchListAdmin(principal, personId, startDate, closeDate, preTrYn, trType, ioType, searchText));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdTrListAdmin + RD 리포트 → xlsx). report=true가 [엑셀다운로드(금감원양식)] */
    @GetMapping("/admin/list/excel")
    public ResponseEntity<byte[]> downloadListAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long personId,
                                                    @RequestParam String startDate,
                                                    @RequestParam String closeDate,
                                                    @RequestParam(defaultValue = "false") boolean report,
                                                    @RequestParam(required = false) String trType,
                                                    @RequestParam(required = false) String ioType,
                                                    @RequestParam(required = false) String searchText) {
        byte[] body = service.downloadListAdmin(principal, personId, startDate, closeDate, report, trType, ioType, searchText);
        String fileName = "임직원 매매내역(" + startDate + " ~ " + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS flt.Flt10_Tr.selectViolate (I10 위반내역조회) — personId 생략 = 회사 전체 사원 */
    @GetMapping("/violate")
    public ApiResponse<List<ViolateRes>> searchViolate(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam String stdDate,
                                                       @RequestParam(required = false) Long personId) {
        return ApiResponse.ok(service.searchViolate(principal, stdDate, personId));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdViolate + RD 리포트 Flt10_Rd_Violate → 조회 결과 xlsx) */
    @GetMapping("/violate/excel")
    public ResponseEntity<byte[]> downloadViolate(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam String stdDate,
                                                  @RequestParam(required = false) Long personId) {
        byte[] body = service.downloadViolate(principal, stdDate, personId);
        String fileName = "임직원매매 위반내역(" + stdDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS flt.Flt10_Tr.selectEmpAppr (J06 정기보고현황) — 기준일 시점 사원별 서약서·점검주기·상신상태. unApprYn=true면 미보고건만 */
    @GetMapping("/emp-apprs")
    public ApiResponse<List<EmpApprRes>> searchEmpApprs(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam String stdDate,
                                                        @RequestParam(defaultValue = "false") boolean unApprYn,
                                                        @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchEmpApprs(principal, stdDate, unApprYn, searchText));
    }

    /** AS-IS flt.Flt10_Tr.selectByApprId (J06 Flt10_Grid_EmpAppr) — 사원의 기간 내 정기보고 상신문서 */
    @GetMapping("/emp-apprs/docs")
    public ApiResponse<List<EmpApprDocRes>> searchEmpApprDocs(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam Long personId,
                                                              @RequestParam String startDate,
                                                              @RequestParam String closeDate) {
        return ApiResponse.ok(service.searchEmpApprDocs(principal, personId, startDate, closeDate));
    }

    /** AS-IS flt.Flt10_Tr.deleteAppr (J06 삭제 아이콘) — 상신문서를 삭제(폐기 보관 포함)하고 매매내역 연결을 끊는다 */
    @DeleteMapping("/emp-apprs/docs/{apprId}")
    public ApiResponse<Void> deleteEmpAppr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        service.deleteAppr(principal, apprId);
        return ApiResponse.ok(null);
    }

    /** AS-IS flt.Flt02_Emp.selectByDate + flt.Flt04_Oath.selectByDate (화면 위 안내) */
    @GetMapping("/check")
    public ApiResponse<TrCheckRes> check(@AuthenticationPrincipal UserPrincipal principal,
                                         @RequestParam(required = false) String stdDate) {
        return ApiResponse.ok(service.check(principal, stdDate));
    }

    /** AS-IS flt.Flt10_Tr.selectInvestLimit */
    @GetMapping("/invest-limit")
    public ApiResponse<List<InvestLimitRes>> investLimit(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.investLimit(principal, stdDate));
    }

    /** AS-IS flt.Flt10_Tr.selectItemName (종목 찾기) */
    @GetMapping("/item-names")
    public ApiResponse<List<TrItemRes>> itemNames(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam String stdDate,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.itemNames(principal, stdDate, searchText));
    }

    /** AS-IS flt.Flt01_CompanyStd.getExpectTrDate → 매매유효일, 기준관리가 없으면 null */
    @GetMapping("/expect-date")
    public ApiResponse<String> expectDate(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.expectTrDate(principal, stdDate));
    }

    /** AS-IS flt.Flt08_BuyLockup.checkLockup */
    @GetMapping("/buy-lockup")
    public ApiResponse<BuyLockupRes> buyLockup(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam String itemCode, @RequestParam String stdDate) {
        return ApiResponse.ok(service.buyLockup(principal, itemCode, stdDate));
    }

    /** AS-IS flt.Flt03_Account.selectByDate (사전신고 화면 계좌 그리드) */
    @GetMapping("/accounts")
    public ApiResponse<List<TrAccountRes>> accounts(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String setupDate) {
        return ApiResponse.ok(service.accounts(principal, setupDate));
    }

    /** AS-IS sys.Sys00_Common.selectByFltItemType (종목유형 콤보) */
    @GetMapping("/item-types")
    public ApiResponse<List<ItemTypeCodeRes>> itemTypes(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String startDate) {
        return ApiResponse.ok(service.itemTypeCodes(principal, startDate));
    }

    /** AS-IS flt.Flt10_Tr.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<TrRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<TrSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS flt.Flt10_Tr.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS flt.Flt10_Tr.updateStatusCode (승인신청 "10" / 신청취소 null) → 바꾼 건수 */
    @PutMapping("/status")
    public ApiResponse<Integer> updateStatus(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TrStatusReq req) {
        return ApiResponse.ok(service.updateStatus(principal, req));
    }

    /** AS-IS flt.Flt10_Tr.updateUnFill (P 미체결 / C 미체결취소) → 바꾼 건수 */
    @PutMapping("/unfill")
    public ApiResponse<Integer> updateUnfill(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TrUnfillReq req) {
        return ApiResponse.ok(service.updateUnfill(principal, req));
    }
}
