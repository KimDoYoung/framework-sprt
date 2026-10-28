package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AddDeductRes;
import kr.co.kfs.asseterp.biz.emp.dto.AddDeductSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.DeductCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.DeductPersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.DeductRes;
import kr.co.kfs.asseterp.biz.emp.dto.DeductSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpDeductService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
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

import java.util.List;

/** 급여공제 탭 (AS-IS Emp35/36_TabPage → server/emp/Emp35_Deduct, Emp36_AddDeduct) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpDeductController {

    private final EmpDeductService empDeductService;

    /** AS-IS emp.Emp35_Deduct.selectByStdDate (S28 Emp35_Tab_DeductPerson) */
    @GetMapping("/deducts/persons")
    public ApiResponse<List<DeductPersonRes>> getDeductPersons(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam(required = false) Long personId,
                                                               @RequestParam(defaultValue = "000") String transCode) {
        return ApiResponse.ok(empDeductService.getDeductPersons(principal, personId, transCode));
    }

    /** AS-IS emp.Emp35_Deduct.selectByPersonId */
    @GetMapping("/persons/{personId}/deducts")
    public ApiResponse<List<DeductRes>> getDeducts(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable Long personId) {
        return ApiResponse.ok(empDeductService.getDeducts(principal, personId));
    }

    /** AS-IS Emp35_Deduct.insert */
    @PostMapping("/deducts")
    public ApiResponse<Void> createDeduct(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestBody DeductCreateReq req) {
        empDeductService.createDeduct(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS Emp35_Deduct.update → UpdateDataModel */
    @PutMapping("/deducts/{deductId}")
    public ApiResponse<DeductRes> updateDeduct(@AuthenticationPrincipal UserPrincipal principal,
                                               @PathVariable Long deductId,
                                               @RequestBody DeductSaveReq req) {
        return ApiResponse.ok(empDeductService.updateDeduct(principal, deductId, req));
    }

    /** AS-IS Emp35_Deduct.deleteAll */
    @DeleteMapping("/deducts/{deductId}")
    public ApiResponse<Integer> deleteDeduct(@AuthenticationPrincipal UserPrincipal principal,
                                             @PathVariable Long deductId) {
        return ApiResponse.ok(empDeductService.deleteDeduct(principal, deductId));
    }

    /** AS-IS Emp36_AddDeduct.selectByDeductId */
    @GetMapping("/deducts/{deductId}/add-deducts")
    public ApiResponse<List<AddDeductRes>> getAddDeducts(@PathVariable Long deductId) {
        return ApiResponse.ok(empDeductService.getAddDeducts(deductId));
    }

    /** AS-IS Emp36_AddDeduct.updateDeductCnt */
    @PutMapping("/deducts/{deductId}/add-deducts")
    public ApiResponse<List<AddDeductRes>> updateAddDeducts(@PathVariable Long deductId,
                                                            @RequestBody List<AddDeductSaveReq> rows) {
        return ApiResponse.ok(empDeductService.updateAddDeducts(deductId, rows));
    }
}
