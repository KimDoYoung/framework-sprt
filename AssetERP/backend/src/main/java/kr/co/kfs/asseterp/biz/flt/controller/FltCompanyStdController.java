package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdLockupReq;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdRes;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltCompanyStdService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 기준관리 (AS-IS Flt01_Tab_CompanyStd → server/flt/Flt01_CompanyStd) — 준감인 */
@RestController
@RequestMapping("/api/v1/flt/company-stds")
@RequiredArgsConstructor
public class FltCompanyStdController {

    private final FltCompanyStdService service;

    /** AS-IS flt.Flt01_CompanyStd.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<CompanyStdRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS flt.Flt01_CompanyStd.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<CompanyStdRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CompanyStdSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS flt.Flt01_CompanyStd.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS flt.Flt01_CompanyStd.updateOne (의무보유기간 위반 체크 방식 조회창) → 저장된 행 */
    @PutMapping("/{companyStdId}/lockup")
    public ApiResponse<CompanyStdRes> updateLockup(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyStdId,
                                                   @RequestBody CompanyStdLockupReq req) {
        return ApiResponse.ok(service.updateLockup(principal, companyStdId, req));
    }
}
