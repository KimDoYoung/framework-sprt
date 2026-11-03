package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizErpFeeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** AssetERP 계약사별 사용료 (AS-IS server/biz/Biz52_ErpFee — 화면 Biz52_Lookup_ErpFee, EE22) */
@RestController
@RequestMapping("/api/v1/biz/erp-fees")
@RequiredArgsConstructor
public class BizErpFeeController {

    private final BizErpFeeService service;

    /** AS-IS biz.Biz52_ErpFee.selectByErpContCorpId */
    @GetMapping
    public ApiResponse<List<BizErpFeeRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long erpContCorpId) {
        return ApiResponse.ok(service.search(principal, erpContCorpId));
    }

    /** AS-IS biz.Biz52_ErpFee.selectByStartDate — 기준일 현재 사용료(없으면 data null) */
    @GetMapping("/current")
    public ApiResponse<BizErpFeeRes> current(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long erpContCorpId,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.current(principal, erpContCorpId, stdDate));
    }

    /** AS-IS biz.Biz52_ErpFee.update */
    @PutMapping
    public ApiResponse<List<BizErpFeeRes>> save(@RequestBody List<BizErpFeeSaveReq> rows) {
        return ApiResponse.ok(service.save(rows));
    }

    /** AS-IS biz.Biz52_ErpFee.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> erpFeeIds) {
        return ApiResponse.ok(service.delete(erpFeeIds));
    }
}
