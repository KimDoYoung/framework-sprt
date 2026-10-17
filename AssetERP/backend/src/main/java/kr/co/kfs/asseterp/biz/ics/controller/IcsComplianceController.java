package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceAnswerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceAnswerSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceDateReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceDateRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 임직원 내부통제 준수리스트 (AS-IS Ics30_Tab_Compliance·Ics30_Lookup_Insert·Ics33_TabPage_ComplianceAnswer → server/ics/Ics30_Compliance·Ics33_ComplianceAnswer) — 메뉴 #1313·#1309 */
@RestController
@RequestMapping("/api/v1/ics")
@RequiredArgsConstructor
public class IcsComplianceController {

    private final IcsComplianceService service;

    /** AS-IS ics.Ics30_Compliance.groupByStartDate */
    @GetMapping("/compliances/dates")
    public ApiResponse<List<IcsComplianceDateRes>> dates(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.dates(principal));
    }

    /** AS-IS ics.Ics30_Compliance.insert (Ics30_Lookup_Insert) */
    @PostMapping("/compliances/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceDateReq req) {
        service.createDate(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS ics.Ics30_Compliance.deleteByDate — 작성 기록이 있으면 거절 */
    @DeleteMapping("/compliances/dates")
    public ApiResponse<Void> deleteDate(@AuthenticationPrincipal UserPrincipal principal,
                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        service.deleteDate(principal, startDate);
        return ApiResponse.ok(null);
    }

    /** AS-IS ics.Ics30_Compliance.updateDateFixYn — 확정('true')·확정취소('false') */
    @PutMapping("/compliances/dates/fix")
    public ApiResponse<Void> updateDateFixYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceDateReq req) {
        service.updateDateFixYn(principal, req.startDate(), req.dateFixYn());
        return ApiResponse.ok(null);
    }

    /** AS-IS ics.Ics31_ComplianceWrite.selectByStartDate — 기준 적용일 이후 작성 기록이 있으면 true */
    @GetMapping("/compliances/dates/has-write-after")
    public ApiResponse<Boolean> hasWriteAfter(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.hasWriteAfter(principal, startDate));
    }

    /** AS-IS ics.Ics30_Compliance.checkDate — 그 기준 적용일의 준수항목에 작성 기록이 있으면 true */
    @GetMapping("/compliances/dates/has-write")
    public ApiResponse<Boolean> hasWrite(@AuthenticationPrincipal UserPrincipal principal,
                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.hasWrite(principal, startDate));
    }

    /** AS-IS ics.Ics30_Compliance.selectByStartDate */
    @GetMapping("/compliances")
    public ApiResponse<List<IcsComplianceRes>> list(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.list(principal, startDate));
    }

    /** AS-IS ics.Ics30_Compliance.updateList(actionCode "check") → 1 그대로 / 1 초과 확인 창 / 1 미만 거절 */
    @PostMapping("/compliances/save-check")
    public ApiResponse<Integer> saveCheck(@RequestBody IcsComplianceSaveReq req) {
        return ApiResponse.ok(service.saveCheck(req));
    }

    /** AS-IS ics.Ics30_Compliance.updateList(actionCode "yes") → 저장·삭제한 건수 */
    @PutMapping("/compliances")
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS ics.Ics33_ComplianceAnswer.selectByCompanyId */
    @GetMapping("/compliance-answers")
    public ApiResponse<List<IcsComplianceAnswerRes>> answers(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                             @RequestParam String complianceType) {
        return ApiResponse.ok(service.answers(principal, startDate, complianceType));
    }

    /** AS-IS ics.Ics33_ComplianceAnswer.update */
    @PutMapping("/compliance-answers")
    public ApiResponse<Integer> saveAnswers(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcsComplianceAnswerSaveReq> rows) {
        return ApiResponse.ok(service.saveAnswers(principal, rows));
    }

    /** AS-IS ics.Ics33_ComplianceAnswer.delete → 지운 건수 */
    @DeleteMapping("/compliance-answers")
    public ApiResponse<Integer> deleteAnswers(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteAnswers(principal, ids));
    }
}
