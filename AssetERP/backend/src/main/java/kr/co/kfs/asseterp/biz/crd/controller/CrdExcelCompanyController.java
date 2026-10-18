package kr.co.kfs.asseterp.biz.crd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCompanyRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCompanySaveReq;
import kr.co.kfs.asseterp.biz.crd.service.CrdExcelCompanyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법인카드 업로드 기초자료(관리자) (AS-IS Crd10_Tab_ExcelCompanyAdmin → server/crd/Crd10_ExcelCompany) — 메뉴 #1352 */
@RestController
@RequestMapping("/api/v1/crd/excel-companies")
@RequiredArgsConstructor
public class CrdExcelCompanyController {

    private final CrdExcelCompanyService service;

    /** AS-IS crd.Crd10_ExcelCompany.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<CrdExcelCompanyRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS crd.Crd10_ExcelCompany.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<CrdExcelCompanyRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CrdExcelCompanySaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS crd.Crd10_ExcelCompany.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
