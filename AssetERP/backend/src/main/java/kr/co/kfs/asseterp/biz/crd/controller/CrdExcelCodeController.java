package kr.co.kfs.asseterp.biz.crd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeSaveReq;
import kr.co.kfs.asseterp.biz.crd.service.CrdExcelCodeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법인카드 업로드 구분코드 맵핑 (AS-IS Crd11_Lookup_ExcelCodeAdmin → server/crd/Crd11_ExcelCode) */
@RestController
@RequestMapping("/api/v1/crd/excel-codes")
@RequiredArgsConstructor
public class CrdExcelCodeController {

    private final CrdExcelCodeService service;

    /** AS-IS crd.Crd11_ExcelCode.selectByCompanyId (회사 + 카드사) */
    @GetMapping
    public ApiResponse<List<CrdExcelCodeRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String bankCode) {
        return ApiResponse.ok(service.search(principal, bankCode));
    }

    /** AS-IS crd.Crd11_ExcelCode.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<CrdExcelCodeRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CrdExcelCodeSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS crd.Crd11_ExcelCode.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
