package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepChildRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepSeqReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmApprStepService;
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

/** 직책별 부서승인선 등록 (AS-IS server/tdm/Tdm09_ApprStep) */
@RestController
@RequestMapping("/api/v1/tdm/appr-steps")
@RequiredArgsConstructor
public class TdmApprStepController {

    private final TdmApprStepService service;

    /** AS-IS tdm.Tdm09_ApprStep.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<ApprStepRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS tdm.Tdm09_ApprStep.update */
    @PutMapping
    public ApiResponse<List<ApprStepRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ApprStepSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS tdm.Tdm09_ApprStep.deleteByParentId */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> apprStepIds) {
        return ApiResponse.ok(service.delete(principal, apprStepIds));
    }

    /** AS-IS tdm.Tdm09_ApprStep.selectByParentId */
    @GetMapping("/{apprStepId}/steps")
    public ApiResponse<List<ApprStepChildRes>> searchChildren(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprStepId) {
        return ApiResponse.ok(service.searchChildren(principal, apprStepId));
    }

    /** AS-IS tdm.Tdm09_ApprStep.modelUpdate (body = 고른 사원 ID 목록) */
    @PostMapping("/{apprStepId}/steps")
    public ApiResponse<Integer> addChildren(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprStepId,
                                            @RequestBody List<Long> personIds) {
        return ApiResponse.ok(service.addChildren(principal, apprStepId, personIds));
    }

    /** AS-IS tdm.Tdm09_ApprStep.inUpdateData */
    @PutMapping("/steps/order")
    public ApiResponse<Integer> saveChildOrder(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ApprStepSeqReq> rows) {
        return ApiResponse.ok(service.saveChildOrder(principal, rows));
    }

    /** AS-IS tdm.Tdm09_ApprStep.delete */
    @DeleteMapping("/steps")
    public ApiResponse<Integer> deleteChildren(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> apprStepIds) {
        return ApiResponse.ok(service.deleteChildren(principal, apprStepIds));
    }
}
