package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationContentReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationSmsReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsApplicationService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 요청서(신청서) — 증명서 신청내역 가져오기 (AS-IS Emp15_Tab_Cert·Emp15_Lookup_GetCert), 기타신청서 확인 (Bbs11_Tab_ApplicationMng) → server/bbs/Bbs11_Application */
@RestController
@RequestMapping("/api/v1/bbs/applications")
@RequiredArgsConstructor
public class BbsApplicationController {

    private final BbsApplicationService service;

    /** AS-IS bbs.Bbs11_Application.selectByAppStatus — 증명서 신청(재직·경력·징계내역) 중 요청상태가 appStatus인 것(10 = 신청) */
    @GetMapping
    public ApiResponse<List<ApplicationRes>> searchByAppStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam(defaultValue = "10") String appStatus) {
        return ApiResponse.ok(service.searchByAppStatus(principal, appStatus));
    }

    /** AS-IS bbs.Bbs11_Application.selectByResultCheck — resultCheck = 미완료건만, appTypeCode 없으면 전체 */
    @GetMapping("/mng")
    public ApiResponse<List<ApplicationMngRes>> searchByResultCheck(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                    @RequestParam(required = false) String appTypeCode,
                                                                    @RequestParam(defaultValue = "true") boolean resultCheck) {
        return ApiResponse.ok(service.searchByResultCheck(principal, startDate, closeDate, appTypeCode, resultCheck));
    }

    /** AS-IS bbs.Bbs11_Application.update — 변경 행 → 다시 읽은 행들(요청 순서) */
    @PutMapping("/mng")
    public ApiResponse<List<ApplicationMngRes>> updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestBody List<ApplicationMngSaveReq> rows) {
        return ApiResponse.ok(service.updateStatus(principal, rows));
    }

    /** AS-IS bbs.Bbs11_Application.modelUpdate — 선택한 신청의 내용(편집기 HTML) */
    @PutMapping("/{applicationId}/content")
    public ApiResponse<Void> updateContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long applicationId,
                                           @RequestBody ApplicationContentReq req) {
        service.updateContent(principal, applicationId, req.content());
        return ApiResponse.ok(null);
    }

    /** AS-IS sms.Sms02_History.sendMessage — [완료문자발송] 아이콘 */
    @PostMapping("/sms")
    public ApiResponse<Void> sendMessage(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ApplicationSmsReq req) {
        service.sendMessage(principal, req.personId(), req.msg());
        return ApiResponse.ok(null);
    }
}
