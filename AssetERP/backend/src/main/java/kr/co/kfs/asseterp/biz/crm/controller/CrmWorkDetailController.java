package kr.co.kfs.asseterp.biz.crm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmRelateFundRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmWorkDetailRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmWorkDetailSaveReq;
import kr.co.kfs.asseterp.biz.crm.service.CrmWorkDetailService;
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

/** 업무활동내역 창 (AS-IS Crm12_Lookup_WorkDetail → server/crm/Crm12_WorkDetail · Crm13_RelateFund · Crm15_Share) */
@RestController
@RequestMapping("/api/v1/crm/work-details")
@RequiredArgsConstructor
public class CrmWorkDetailController {

    private final CrmWorkDetailService service;

    /** AS-IS DBUtil.setSeq — 새 건 번호 */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS crm12_work_detail.selectById */
    @GetMapping("/{workDetailId}")
    public ApiResponse<CrmWorkDetailRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long workDetailId) {
        return ApiResponse.ok(service.get(principal, workDetailId));
    }

    /** AS-IS crm13_relate_fund.selectByWorkDetailId */
    @GetMapping("/{workDetailId}/funds")
    public ApiResponse<List<CrmRelateFundRes>> searchFunds(@PathVariable Long workDetailId) {
        return ApiResponse.ok(service.searchFunds(workDetailId));
    }

    /** AS-IS crm.Crm15_Share.insertDefaultShare — 응답은 공유 요약(복사된 것이 없으면 null) */
    @PostMapping("/{workDetailId}/default-share")
    public ApiResponse<String> insertDefaultShare(@PathVariable Long workDetailId, @RequestParam Long contactId) {
        return ApiResponse.ok(service.insertDefaultShare(workDetailId, contactId));
    }

    /** AS-IS crm.Crm15_Share.deleteDefaultShare (등록 취소) */
    @DeleteMapping("/{workDetailId}/default-share")
    public ApiResponse<Void> deleteDefaultShare(@PathVariable Long workDetailId) {
        service.deleteDefaultShare(workDetailId);
        return ApiResponse.ok(null);
    }

    /** AS-IS crm.Crm12_WorkDetail.modelUpdate + crm.Crm13_RelateFund.updateList */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CrmWorkDetailSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS crm.Crm13_RelateFund.delete */
    @DeleteMapping("/funds/{relateFundId}")
    public ApiResponse<Void> deleteFund(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long relateFundId) {
        service.deleteFund(principal, relateFundId);
        return ApiResponse.ok(null);
    }
}
