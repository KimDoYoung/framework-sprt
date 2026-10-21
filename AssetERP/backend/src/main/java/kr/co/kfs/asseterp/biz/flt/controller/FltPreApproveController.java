package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveConfirmerReq;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveReasonReq;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveRes;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveSettingRes;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveStatusReq;
import kr.co.kfs.asseterp.biz.flt.service.FltPreApproveService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 준법감시 사전승인 (AS-IS Flt10_Tab_PreApprove, Flt10_Lookup_RejectReasonWrite → server/flt/Flt10_Tr) */
@RestController
@RequestMapping("/api/v1/flt/trs/approvals")
@RequiredArgsConstructor
public class FltPreApproveController {

    private final FltPreApproveService service;

    /** AS-IS flt.Flt10_Tr.selectByCompanyId — trType '10I' 매수 / '20O' 매도, apprYn `%`·true·false */
    @GetMapping
    public ApiResponse<List<PreApproveRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam String trType,
                                                   @RequestParam(required = false) Long personId,
                                                   @RequestParam(defaultValue = "%") String apprYn,
                                                   @RequestParam(required = false) String startDate,
                                                   @RequestParam(required = false) String closeDate,
                                                   @RequestParam(required = false) String searchText,
                                                   @RequestParam(defaultValue = "false") boolean noLimitYn) {
        return ApiResponse.ok(service.search(principal, personId, apprYn, trType, startDate, closeDate, searchText, noLimitYn));
    }

    /** setInitData() — 투자한도 열 숨김·협의승인 회사 여부 */
    @GetMapping("/setting")
    public ApiResponse<PreApproveSettingRes> setting(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String toDay) {
        return ApiResponse.ok(service.setting(principal, toDay));
    }

    /** AS-IS flt.Flt10_Tr.updateStatusCode */
    @PutMapping("/status")
    public ApiResponse<Integer> updateStatus(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PreApproveStatusReq req) {
        return ApiResponse.ok(service.updateStatus(principal, req));
    }

    /** AS-IS flt.Flt10_Tr.updateAddConfirmer */
    @PutMapping("/add-confirmer")
    public ApiResponse<Integer> updateAddConfirmer(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PreApproveConfirmerReq req) {
        return ApiResponse.ok(service.updateAddConfirmer(principal, req));
    }

    /** Flt10_Lookup_RejectReasonWrite.update() — 승인·반려 사유 수정 */
    @PutMapping("/{trId}/reason")
    public ApiResponse<Integer> updateReason(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long trId,
                                             @RequestBody PreApproveReasonReq req) {
        return ApiResponse.ok(service.updateReason(principal, trId, req));
    }

    /** AS-IS flt.Flt10_Tr.sendMessage (일괄 알림발송) */
    @PostMapping("/send-message")
    public ApiResponse<String> sendMessage(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.sendMessage(principal));
    }
}
