package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.biz.dto.*;
import kr.co.kfs.asseterp.biz.biz.service.BizErpFeeChargeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** AssetERP 사용료청구 (AS-IS server/biz/Biz55_ErpFeeCharge — 화면 Biz55_Tab_ErpFeeCharge·Biz55_Lookup_ErpFeeCharge·Biz55_Lookup_ErpCompany, EE23) */
@RestController
@RequestMapping("/api/v1/biz/erp-fee-charges")
@RequiredArgsConstructor
public class BizErpFeeChargeController {

    private final BizErpFeeChargeService service;

    /** AS-IS biz.Biz55_ErpFeeCharge.selectByStdDate — stdDate 는 청구년월의 1일 */
    @GetMapping
    public ApiResponse<List<BizErpFeeChargeRes>> search(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                        @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(stdDate, searchText));
    }

    /** AS-IS biz.Biz51_ErpContCorp.selectErpCompany — 계약사 조회창 */
    @GetMapping("/companies")
    public ApiResponse<List<BizErpCompanyRes>> companies(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                         @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.companies(stdDate, searchText));
    }

    /** AS-IS biz.Biz52_ErpFee.selectDefaultData — 설정이 없으면 data null */
    @GetMapping("/default")
    public ApiResponse<BizErpFeeDefaultRes> defaultData(@RequestParam Long erpContCorpId, @RequestParam(required = false) Long companyId,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.defaultData(erpContCorpId, companyId, startDate, closeDate));
    }

    /** AS-IS biz.Biz55_ErpFeeCharge.updateErpCompany → 만든 건수 */
    @PostMapping
    public ApiResponse<Integer> create(@RequestBody BizErpFeeChargeCreateReq req) {
        return ApiResponse.ok(service.create(req));
    }

    /** AS-IS biz.Biz55_ErpFeeCharge.insertUpdate */
    @PutMapping
    public ApiResponse<BizErpFeeChargeRes> save(@RequestBody BizErpFeeChargeSaveReq req) {
        return ApiResponse.ok(service.save(req));
    }

    /** AS-IS biz.Biz55_ErpFeeCharge.confirmUpdate */
    @PutMapping("/confirm")
    public ApiResponse<Integer> confirm(@RequestBody BizErpFeeChargeConfirmReq req) {
        return ApiResponse.ok(service.confirm(req));
    }

    /** AS-IS biz.Biz55_ErpFeeCharge.updateApprId */
    @PutMapping("/appr-id")
    public ApiResponse<Integer> updateApprId(@RequestBody BizErpFeeChargeApprReq req) {
        return ApiResponse.ok(service.updateApprId(req));
    }

    /** AS-IS biz.Biz55_ErpFeeCharge.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> erpFeeChargeIds) {
        return ApiResponse.ok(service.delete(erpFeeChargeIds));
    }
}
