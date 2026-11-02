package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBatchReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDetailRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeJobReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeUpdateReq;
import kr.co.kfs.asseterp.biz.icam.service.IcamFeeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** ICAM 보수(관리자용) (AS-IS Icam10_Tab_FeeAdmin → server/icam/Icam10_Fee) — 메뉴 #1203 */
@RestController
@RequestMapping("/api/v1/icam/fees")
@RequiredArgsConstructor
public class IcamFeeController {

    private final IcamFeeService service;

    /** AS-IS icam.Icam10_Fee.selectByFeeTypePaging — 페이지 행 + 전체 건수 */
    @GetMapping
    public ApiResponse<PageRes<IcamFeeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam Long companyId,
                                                   @RequestParam String feeType,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                   @RequestParam(defaultValue = "") String searchText,
                                                   @RequestParam(defaultValue = "0") int offset,
                                                   @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(service.search(principal, companyId, feeType, startDate, closeDate, searchText, offset, limit));
    }

    /** AS-IS icam.Icam10_Fee.selectByFundCode — 펀드 하루의 적요별 보수 (X25 Ast30_Lookup_FeeDetail) */
    @GetMapping("/by-fund")
    public ApiResponse<List<IcamFeeDetailRes>> searchByFund(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(required = false) Long corpId,
                                                            @RequestParam String fundCode,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                            @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByFund(principal, corpId, fundCode, stdDate, searchText));
    }

    /** AS-IS BatchMain(icamOfficeMngFee·icamFundMngFee): ICAM 발생보수 가져오기 — 외부 ICAM DB 연동이 없어 서버가 거절 */
    @PostMapping("/batch")
    public ApiResponse<Void> runBatch(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamFeeBatchReq req) {
        service.runBatch(principal, req.actionCode(), req.companyId(), req.startDate(), req.closeDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS icam.Icam10_Fee.updateFee — [펀드보수 발생내역 수정] 저장(발생보수만) */
    @PutMapping("/{feeId}")
    public ApiResponse<Void> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long feeId, @RequestBody IcamFeeUpdateReq req) {
        service.updateFee(principal, feeId, req.fee());
        return ApiResponse.ok(null);
    }

    /** AS-IS icam.Icam10_Fee.getICAMFundFee — 외부 ICAM DB 연동이 없어 서버가 거절 */
    @PostMapping("/icam-fund-fee")
    public ApiResponse<Void> getIcamFundFee(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamFeeJobReq req) {
        service.runFundFee(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS icam.Icam10_Fee.createFeeBook — 보수원장 재생성 */
    @PostMapping("/fee-books")
    public ApiResponse<Void> createFeeBook(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamFeeJobReq req) {
        service.createFeeBook(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS icam.Icam10_Fee.createFeeRcvTr — 보수인출거래 재생성 */
    @PostMapping("/rcv-trs")
    public ApiResponse<Void> createFeeRcvTr(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamFeeJobReq req) {
        service.createFeeRcvTr(principal, req);
        return ApiResponse.ok(null);
    }
}
