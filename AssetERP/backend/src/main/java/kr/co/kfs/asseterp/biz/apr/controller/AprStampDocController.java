package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocApplRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocLookupRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocSumRes;
import kr.co.kfs.asseterp.biz.apr.service.AprStampDocService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 법인서류 매수관리 (AS-IS Apr16_Tab_StampDocManager → server/apr/Apr16_StampDoc) */
@RestController
@RequestMapping("/api/v1/apr/stamp-docs")
@RequiredArgsConstructor
public class AprStampDocController {

    private final AprStampDocService service;

    /** AS-IS apr.Apr16_StampDoc.selectDocByRegDate */
    @GetMapping
    public ApiResponse<List<AprStampDocRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                    @RequestParam(required = false) String applType,
                                                    @RequestParam(required = false) Long stampReprCorpId) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, applType, stampReprCorpId));
    }

    /** AS-IS apr.Apr16_StampDoc.selectDocGroupSum */
    @GetMapping("/sum")
    public ApiResponse<List<AprStampDocSumRes>> searchSum(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(required = false) String applType,
                                                          @RequestParam(required = false) Long stampReprCorpId) {
        return ApiResponse.ok(service.searchSum(principal, applType, stampReprCorpId));
    }

    /** AS-IS apr.Apr16_StampDoc.selectByApplType */
    @GetMapping("/lookup")
    public ApiResponse<List<AprStampDocLookupRes>> searchLookup(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam(required = false) String applType) {
        return ApiResponse.ok(service.searchLookup(principal, applType));
    }

    /** AS-IS apr.Apr16_StampDoc.selectApplDocByRegDateIsNull — 등록일이 없는 신청내역 */
    @GetMapping("/appl")
    public ApiResponse<List<AprStampDocApplRes>> searchAppl(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchAppl(principal));
    }

    /** AS-IS apr.Apr16_StampDoc.update → 저장한 건수 */
    @PutMapping
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AprStampDocSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS apr.Apr16_StampDoc.deleteReg */
    @DeleteMapping
    public ApiResponse<Integer> deleteReg(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteReg(principal, ids));
    }

    /** AS-IS apr.Apr16_StampDoc.updateRegDate — 신청내역 가져오기 */
    @PutMapping("/reg-date")
    public ApiResponse<Integer> registerRegDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.registerRegDate(principal, ids));
    }

    /** AS-IS sys.Sys99_Print.insertRdStampDocManager → rdGroupId */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.insertRdPrint(principal, startDate, closeDate));
    }
}
