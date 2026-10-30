package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitNoteReq;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitPayRequestApprReq;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitPayRequestCheckReq;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitPayRequestRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitPayRequestYmReq;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitTypeRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitYnReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpBenefitService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

/** 복리후생비 관리 (AS-IS Emp17_Tab_BenefitManager → server/emp/Emp17_Benefit) — 메뉴 #1222 */
@RestController
@RequestMapping("/api/v1/emp/benefits")
@RequiredArgsConstructor
public class EmpBenefitController {

    private final EmpBenefitService service;

    /** AS-IS emp.Emp17_Benefit.selectByText (위 그리드 — 지출결의에 안 들어간 신청) */
    @GetMapping
    public ApiResponse<List<BenefitRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                @RequestParam(required = false) String benefitCode,
                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, benefitCode, searchText));
    }

    /** AS-IS emp.Emp17_Benefit.selectByBenefitCode (아래 그리드 — 기준년월 지출결의내역) */
    @GetMapping("/pay-requests")
    public ApiResponse<List<BenefitRes>> searchPayRequests(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam String yyyymm,
                                                           @RequestParam(required = false) String benefitCode,
                                                           @RequestParam(required = false) String benefitYn,
                                                           @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchPayRequests(principal, yyyymm, benefitCode, benefitYn, searchText));
    }

    /** AS-IS emp.Emp17_Benefit.selectByYyyymm (apprChk) → 지출결의서 상신 상태, 없으면 null */
    @GetMapping("/pay-requests/appr")
    public ApiResponse<BenefitPayRequestRes> getPayRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam String yyyymm,
                                                           @RequestParam(required = false) String benefitCode) {
        return ApiResponse.ok(service.getPayRequest(principal, yyyymm, benefitCode));
    }

    /** AS-IS emp.Emp17_Benefit.selectApprId → 지출결의서 상신ID */
    @GetMapping("/pay-requests/appr-id")
    public ApiResponse<Long> getPayRequestApprId(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam String yyyymm,
                                                 @RequestParam(required = false) String benefitCode) {
        return ApiResponse.ok(service.getPayRequestApprId(principal, yyyymm, benefitCode));
    }

    /** AS-IS sys.Sys00_Common.selectBenefit (신청구분 콤보) */
    @GetMapping("/types")
    public ApiResponse<List<BenefitTypeRes>> searchTypes(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchTypes(principal));
    }

    /** AS-IS emp.Emp17_Benefit.payRequestApprCheck → 막는 메시지, 없으면 null */
    @PostMapping("/pay-requests/check")
    public ApiResponse<String> checkPayRequest(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BenefitPayRequestCheckReq req) {
        return ApiResponse.ok(service.checkPayRequest(principal, req.year(), req.month(), req.benefitIds()));
    }

    /** AS-IS emp.Emp17_Benefit.updatePayRequestYm ([지출결의등록]·[지출결의제거]) → 바뀐 건수 */
    @PutMapping("/pay-requests/ym")
    public ApiResponse<Integer> updatePayRequestYm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BenefitPayRequestYmReq req) {
        return ApiResponse.ok(service.updatePayRequestYm(principal, req.benefitIds(), req.payRequestYyyymm()));
    }

    /** AS-IS emp.Emp17_Benefit.updatePayRequestApprId (지출결의서 상신 뒤) → 바뀐 건수 */
    @PutMapping("/pay-requests/appr-id")
    public ApiResponse<Integer> updatePayRequestApprId(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BenefitPayRequestApprReq req) {
        return ApiResponse.ok(service.updatePayRequestApprId(principal, req.benefitIds(), req.apprId()));
    }

    /** AS-IS emp.Emp17_Benefit.update ([지급확인]·[지급취소]) → 바뀐 건수 */
    @PutMapping("/benefit-yn")
    public ApiResponse<Integer> updateBenefitYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BenefitYnReq req) {
        return ApiResponse.ok(service.updateBenefitYn(principal, req.benefitIds(), req.benefitYn()));
    }

    /** AS-IS emp.Emp17_Benefit.deleteApprId (문서폐기) */
    @PostMapping("/{benefitId}/discard-appr")
    public ApiResponse<Void> discardAppr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long benefitId) {
        service.discardAppr(principal, benefitId);
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp17_Benefit.modelUpdate (알림 등록 창 [저장]) */
    @PutMapping("/{benefitId}/note")
    public ApiResponse<Void> updateNote(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long benefitId, @RequestBody BenefitNoteReq req) {
        service.updateNote(principal, benefitId, req.note());
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp17_Benefit.sendMessage (알림 등록 창 [문자발송]) */
    @PostMapping("/{benefitId}/send-message")
    public ApiResponse<Void> sendMessage(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long benefitId, @RequestBody BenefitNoteReq req) {
        service.sendMessage(principal, benefitId, req.note());
        return ApiResponse.ok(null);
    }
}
