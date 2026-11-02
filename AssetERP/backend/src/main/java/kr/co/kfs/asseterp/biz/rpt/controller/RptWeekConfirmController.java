package kr.co.kfs.asseterp.biz.rpt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekConfirmReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekConfirmRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekConfirmerRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintRes;
import kr.co.kfs.asseterp.biz.rpt.service.RptWeekConfirmService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 주간업무보고 확인 (AS-IS server/rpt/Rpt04_WeekConfirm·Rpt03_Week.selectByCompanyId, Z12 Rpt04_Tab_WeekConfirm) */
@RestController
@RequestMapping("/api/v1/rpt/week-confirms")
@RequiredArgsConstructor
public class RptWeekConfirmController {

    private final RptWeekConfirmService service;

    /** AS-IS rpt.Rpt03_Week.selectByCompanyId — 제출된 보고. confirmYn=true면 미확인만, orgCodeId가 있으면 그 부서만 */
    @GetMapping
    public ApiResponse<List<WeekConfirmRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                    @RequestParam(required = false) Long orgCodeId,
                                                    @RequestParam(defaultValue = "false") boolean confirmYn) {
        return ApiResponse.ok(service.search(principal, startDate, orgCodeId, confirmYn));
    }

    /** AS-IS 그리드 [주간업무보기] fixCheck(Rpt04_Tab_WeekConfirm L336-365) — 그 사원의 보고가 제출 상태인가 */
    @GetMapping("/fixed")
    public ApiResponse<Boolean> fixed(@AuthenticationPrincipal UserPrincipal principal,
                                      @RequestParam Long personId,
                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.isFixed(principal, personId, startDate, closeDate));
    }

    /** AS-IS rpt.Rpt04_WeekConfirm.selectByConfirmerId — 내가 확인한 기록(없으면 null) */
    @GetMapping("/confirmer")
    public ApiResponse<WeekConfirmerRes> confirmer(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam Long personId,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.getMyConfirm(principal, personId, startDate));
    }

    /** AS-IS rpt.Rpt04_WeekConfirm.updateNote — 확인자 메모 저장 */
    @PutMapping("/note")
    public ApiResponse<Integer> saveNote(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekConfirmReq req) {
        return ApiResponse.ok(service.saveNote(principal, req));
    }

    /** AS-IS rpt.Rpt04_WeekConfirm.confirmUpdate — 확인 처리 */
    @PutMapping("/confirm")
    public ApiResponse<Integer> confirm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekConfirmReq req) {
        return ApiResponse.ok(service.confirm(principal, req));
    }

    /** AS-IS rpt.Rpt04_WeekConfirm.updateByPersonId — 확인 취소(메모는 화면 값으로 저장) */
    @PutMapping("/cancel")
    public ApiResponse<Integer> cancel(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekConfirmReq req) {
        return ApiResponse.ok(service.cancel(principal, req));
    }

    /** AS-IS Rpt04_Tab_WeekConfirm.lookUpRd — getLastWeek + sys.Sys99_Print.insertRdWeekConfirm */
    @PostMapping("/rd-print")
    public ApiResponse<WeekPrintRes> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekConfirmReq req) {
        return ApiResponse.ok(service.insertRdWeekConfirm(principal, req));
    }
}
