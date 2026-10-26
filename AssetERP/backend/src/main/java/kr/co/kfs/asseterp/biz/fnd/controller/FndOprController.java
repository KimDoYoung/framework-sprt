package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndOprService;
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

/** 운용지시 (AS-IS server/fnd/Fnd30_Opr) — 수요예측(Q05). 공모주청약(oprCode "01")은 Q06에서 더한다 */
@RestController
@RequestMapping("/api/v1/fnd/oprs")
@RequiredArgsConstructor
public class FndOprController {

    private final FndOprService service;

    /** AS-IS fnd.Fnd30_Opr.selectByDemandDate (Fnd30_Tab_DemandOpr.retrieve) */
    @GetMapping("/demand")
    public ApiResponse<List<OprDemandRes>> searchDemand(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                        @RequestParam(defaultValue = "02") String oprCode,
                                                        @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchDemand(principal, startDate, closeDate, oprCode, searchText));
    }

    /** AS-IS fnd.Fnd30_Opr.selectById */
    @GetMapping("/{oprId}")
    public ApiResponse<OprDemandRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long oprId) {
        return ApiResponse.ok(service.get(principal, oprId));
    }

    /** AS-IS fnd.Fnd30_Opr.modelUpdate·multiUpdate (Fnd30_Edit_DemandOpr.update, 신규) → 새 ID 목록 */
    @PostMapping
    public ApiResponse<List<Long>> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OprDemandSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS fnd.Fnd30_Opr.modelUpdate (Fnd30_Edit_DemandOpr.update, 수정) */
    @PutMapping("/{oprId}")
    public ApiResponse<OprDemandRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long oprId,
                                            @RequestBody OprDemandSaveReq req) {
        return ApiResponse.ok(service.update(principal, oprId, req));
    }

    /** AS-IS fnd.Fnd30_Opr.deleteApprId → deleteOprFund → delete (Fnd30_Tab_DemandOpr.delete) */
    @DeleteMapping("/{oprId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long oprId) {
        service.delete(principal, oprId);
        return ApiResponse.ok(null);
    }
}
