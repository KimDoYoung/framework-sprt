package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandOfferRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.OprSubRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprSubSaveReq;
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

/** 운용지시 (AS-IS server/fnd/Fnd30_Opr) — 수요예측(oprCode "02", Q05)과 공모주청약(oprCode "01", Q06) */
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

    /** AS-IS fnd.Fnd30_Opr.selectByDate (Fnd30_Tab_Opr.retrieve, oprCode "01") */
    @GetMapping("/subscription")
    public ApiResponse<List<OprSubRes>> searchSubscription(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                           @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchSubscription(principal, startDate, closeDate, searchText));
    }

    /** AS-IS fnd.Fnd30_Opr.selectById (공모주청약 — 펀드별 배정 창의 발행가·수수료율·총배정수량) */
    @GetMapping("/{oprId}/subscription")
    public ApiResponse<OprSubRes> getSubscription(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long oprId) {
        return ApiResponse.ok(service.getSubscription(principal, oprId));
    }

    /** AS-IS fnd.Fnd30_Opr.selectByDemandOprCode (Fnd30_Lookup_DemandOprList.retrieve, oprCode "02") */
    @GetMapping("/demand-offers")
    public ApiResponse<List<OprDemandOfferRes>> searchDemandOffers(@AuthenticationPrincipal UserPrincipal principal,
                                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                   @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchDemandOffers(principal, startDate, closeDate, searchText));
    }

    /** AS-IS fnd.Fnd30_Opr.modelUpdate·multiUpdate (Fnd30_Edit_Opr.update, 신규) → 새 ID 목록. demandId가 있으면 수요예측 비율로 펀드별 배정도 함께 */
    @PostMapping("/subscription")
    public ApiResponse<List<Long>> createSubscription(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OprSubSaveReq req) {
        return ApiResponse.ok(service.createSubscription(principal, req));
    }

    /** AS-IS fnd.Fnd30_Opr.modelUpdate (Fnd30_Edit_Opr.update, 수정) */
    @PutMapping("/{oprId}/subscription")
    public ApiResponse<OprSubRes> updateSubscription(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long oprId,
                                                     @RequestBody OprSubSaveReq req) {
        return ApiResponse.ok(service.updateSubscription(principal, oprId, req));
    }
}
