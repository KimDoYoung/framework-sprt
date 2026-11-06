package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandApprIdReq;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandCycleReq;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandPublicReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyErrandRes;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpMyErrandService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;

/** 외출등록 (AS-IS Emp54_Tab_Errand, 메뉴 #1358) */
@RestController
@RequestMapping("/api/v1/emp/my-errands")
@RequiredArgsConstructor
public class EmpMyErrandController {

    private final EmpMyErrandService service;

    /** AS-IS emp.Emp54_Errand.selectByDate */
    @GetMapping
    public ApiResponse<List<MyErrandRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate));
    }

    /** AS-IS emp.Emp54_Errand.update (UpdateDataModel) */
    @PutMapping
    public ApiResponse<List<MyErrandRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ErrandSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp54_Errand.modelUpdate (반복등록) → 넣은 행 수 */
    @PostMapping("/cycle")
    public ApiResponse<Integer> createCycle(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ErrandCycleReq req) {
        return ApiResponse.ok(service.createCycle(principal, req));
    }

    /** AS-IS emp.Emp54_Errand.update (결재문서 ID) */
    @PutMapping("/{errandId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long errandId,
                                          @RequestBody ErrandApprIdReq req) {
        service.updateApprId(principal, errandId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp54_Errand.updatePublicYn */
    @PutMapping("/{errandId}/public")
    public ApiResponse<MyErrandRes> updatePublic(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long errandId,
                                               @RequestBody ErrandPublicReq req) {
        return ApiResponse.ok(service.updatePublic(principal, errandId, req.publicYn()));
    }

    /** AS-IS emp.Emp54_Errand.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> ids) {
        service.delete(principal, ids);
        return ApiResponse.ok(null);
    }
}
