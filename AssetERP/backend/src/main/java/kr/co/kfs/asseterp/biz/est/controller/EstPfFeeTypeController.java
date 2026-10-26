package kr.co.kfs.asseterp.biz.est.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.dto.PfFeeTypeRes;
import kr.co.kfs.asseterp.biz.est.dto.PfFeeTypeSaveReq;
import kr.co.kfs.asseterp.biz.est.service.EstPfFeeTypeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 부동산PF 수수료 (AS-IS Est01_Tab_PfFeeType → server/est/Est01_PfFeeType) — 메뉴 #1375 */
@RestController
@RequestMapping("/api/v1/est/pf-fee-types")
@RequiredArgsConstructor
public class EstPfFeeTypeController {

    private final EstPfFeeTypeService service;

    /** AS-IS est.Est01_PfFeeType.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<PfFeeTypeRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS est.Est01_PfFeeType.selectByText — 용역(수수료) 조회창(Est01_Lookup_PfFeeType) */
    @GetMapping("/lookup")
    public ApiResponse<List<PfFeeTypeRes>> lookup(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.lookup(principal, startDate, searchText));
    }

    /** AS-IS est.Est01_PfFeeType.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PfFeeTypeRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PfFeeTypeSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS est.Est01_PfFeeType.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> pfFeeTypeIds) {
        service.delete(principal, pfFeeTypeIds);
        return ApiResponse.ok(null);
    }

    /** AS-IS est.Est02_PfContract.checkList — 수정·삭제 전에 이 수수료 항목을 쓰는 용역계약 건수를 본다 */
    @PostMapping("/in-use")
    public ApiResponse<Integer> countInUse(@RequestBody List<Long> pfFeeTypeIds) {
        return ApiResponse.ok(service.countInUse(pfFeeTypeIds));
    }
}
