package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRowRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRowSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocTotalRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprCorpDocManageService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;

/** 법인서류 매수관리(Apr17_Tab_CorpDoc)·법인서류 및 날인 신청(Apr17_Tab_CorpDocApp) — AS-IS server/apr/Apr17_CorpDoc · Apr19_RelateStamp (U2-02) */
@RestController
@RequestMapping("/api/v1/apr/corp-docs")
@RequiredArgsConstructor
public class AprCorpDocManageController {

    private final AprCorpDocManageService service;

    /** apr.Apr17_CorpDoc.selectByCorpRegDate */
    @GetMapping("/registered")
    public ApiResponse<List<AprCorpDocRowRes>> searchRegistered(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.searchRegistered(principal, startDate, closeDate));
    }

    /** apr.Apr17_CorpDoc.selectByRegDate */
    @GetMapping("/totals")
    public ApiResponse<List<AprCorpDocTotalRes>> searchTotals(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchTotals(principal));
    }

    /** sys.Sys99_Print.insertRdCorpDoc — 출력 그룹 ID */
    @PostMapping("/registered/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.insertRdCorpDoc(principal, startDate, closeDate));
    }

    /** apr.Apr17_CorpDoc.update (법인서류 매수관리) */
    @PutMapping("/registered")
    public ApiResponse<List<AprCorpDocRowRes>> saveRegistered(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AprCorpDocRowSaveReq> reqs) {
        return ApiResponse.ok(service.saveRegistered(principal, reqs));
    }

    /** apr.Apr17_CorpDoc.regDelete + regDateUpdate(null) */
    @DeleteMapping("/registered")
    public ApiResponse<Integer> deleteRegistered(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteRegistered(principal, ids));
    }

    /** apr.Apr17_CorpDoc.selectByAppDate */
    @GetMapping("/applications")
    public ApiResponse<List<AprCorpDocRowRes>> searchApplications(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestParam(required = false) String searchText,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                  @RequestParam(defaultValue = "false") boolean procResult) {
        return ApiResponse.ok(service.searchApplications(principal, searchText, startDate, closeDate, procResult));
    }

    /** apr.Apr17_CorpDoc.update (신청 화면) */
    @PutMapping("/applications")
    public ApiResponse<List<AprCorpDocRowRes>> saveApplications(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AprCorpDocRowSaveReq> reqs) {
        return ApiResponse.ok(service.saveApplications(principal, reqs));
    }

    /** apr.Apr17_CorpDoc.copyUpdate */
    @PostMapping("/applications/copy")
    public ApiResponse<AprCorpDocRowRes> copyApplication(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AprCorpDocRowSaveReq source) {
        return ApiResponse.ok(service.copyApplication(principal, source));
    }

    /** apr.Apr17_CorpDoc.delete */
    @DeleteMapping("/applications")
    public ApiResponse<Integer> deleteApplications(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteApplications(principal, ids));
    }

    /** apr.Apr19_RelateStamp.update */
    @PutMapping("/stamps")
    public ApiResponse<List<AprRelateStampRes>> saveStamps(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AprRelateStampSaveReq> reqs) {
        return ApiResponse.ok(service.saveStamps(principal, reqs));
    }

    /** apr.Apr19_RelateStamp.delete */
    @DeleteMapping("/stamps")
    public ApiResponse<Integer> deleteStamps(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteStamps(principal, ids));
    }

    /** apr.Apr19_RelateStamp.selectByCorpDocId */
    @GetMapping("/{corpDocId}/stamps")
    public ApiResponse<List<AprRelateStampRes>> searchStamps(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long corpDocId) {
        return ApiResponse.ok(service.searchStamps(principal, corpDocId));
    }

    /** apr.Apr17_CorpDoc.selectById */
    @GetMapping("/{corpDocId}")
    public ApiResponse<AprCorpDocRowRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long corpDocId) {
        return ApiResponse.ok(service.get(principal, corpDocId));
    }
}
