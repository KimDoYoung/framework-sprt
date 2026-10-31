package kr.co.kfs.asseterp.biz.biz.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiApprIdReq;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiMonthApprReq;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiMonthRes;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiRes;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizFundPriceModiService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 기준가 정정내역 보고 (AS-IS Biz60_Tab_FundPriceModiReport · Biz60_Edit_FundPriceModi → server/biz/Biz60_FundPriceModi · Biz61_ModiRptRelateAppr) */
@RestController
@RequestMapping("/api/v1/biz/fund-price-modis")
@RequiredArgsConstructor
public class BizFundPriceModiController {

    private final BizFundPriceModiService service;

    /** AS-IS biz.Biz60_FundPriceModi.selectByText (yyyymm = `yyyy.mm`) */
    @GetMapping
    public ApiResponse<List<FundPriceModiRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm,
                                                      @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, yyyymm, searchText));
    }

    /** AS-IS getSeq — 새 보고 편집창이 첨부파일 올리기 전에 받는 번호 */
    @GetMapping("/new-id")
    public ApiResponse<Long> newId() {
        return ApiResponse.ok(service.newId());
    }

    /** AS-IS biz.Biz60_FundPriceModi.modelUpdate → 저장된 행 */
    @PutMapping
    public ApiResponse<FundPriceModiRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundPriceModiSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS biz.Biz60_FundPriceModi.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS biz.Biz60_FundPriceModi.update(apprId) — 개별 상신(A75·A76) 뒤 결재문서 ID 기록 */
    @PutMapping("/{fundPriceModiId}/appr-id")
    public ApiResponse<Integer> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long fundPriceModiId,
                                             @RequestBody FundPriceModiApprIdReq req) {
        return ApiResponse.ok(service.updateApprId(principal, fundPriceModiId, req.apprId()));
    }

    /** AS-IS biz.Biz61_ModiRptRelateAppr.selectByCompanyId — 변경년월의 월 통합 상신(없으면 data null) */
    @GetMapping("/month")
    public ApiResponse<FundPriceModiMonthRes> month(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.month(principal, yyyymm));
    }

    /** AS-IS biz.Biz61_ModiRptRelateAppr.updateApprId — 월 통합 상신(A77) 뒤 결재문서 ID 기록 */
    @PutMapping("/month")
    public ApiResponse<Void> saveMonth(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundPriceModiMonthApprReq req) {
        service.saveMonth(principal, req.yyyymm(), req.apprId());
        return ApiResponse.ok(null);
    }
}
