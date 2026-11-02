package kr.co.kfs.asseterp.biz.rpt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekBizClassRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekBizClassSaveReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekBoldReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekCodeRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekCopyReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekDaysRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekFixReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekRequestSaveReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekSaveReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekSeqReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekStateRes;
import kr.co.kfs.asseterp.biz.rpt.service.RptWeekService;
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

/** 주간업무보고 (AS-IS server/rpt/Rpt03_Week·Rpt05_WeekBizClass, Z11 Rpt03_Tab_WeekWrite) */
@RestController
@RequestMapping("/api/v1/rpt/weeks")
@RequiredArgsConstructor
public class RptWeekController {

    private final RptWeekService service;

    /** AS-IS rpt.Rpt03_Week.selectByStartDate — 내 주간업무. suggestion=true면 건의사항(업무구분 999)만 */
    @GetMapping
    public ApiResponse<List<WeekRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                             @RequestParam(defaultValue = "false") boolean suggestion) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, suggestion));
    }

    /** AS-IS fixCheck·confirmCheck·confirmRetrieve — 제출·확인 상태 */
    @GetMapping("/state")
    public ApiResponse<WeekStateRes> state(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.getState(principal, startDate, closeDate));
    }

    /** AS-IS rpt.Rpt03_Week.getWeekDays */
    @GetMapping("/week-days")
    public ApiResponse<WeekDaysRes> weekDays(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDay) {
        return ApiResponse.ok(service.getWeekDays(toDay));
    }

    /** AS-IS sys.Sys00_Common.selectWeekListByMonth */
    @GetMapping("/week-list")
    public ApiResponse<List<WeekCodeRes>> weekList(@RequestParam int year, @RequestParam int month) {
        return ApiResponse.ok(service.getWeekList(year, month));
    }

    /** AS-IS sys.Sys00_Common.selectWeekBizClass — 내가 사용으로 정한 업무구분 */
    @GetMapping("/biz-types")
    public ApiResponse<List<WeekCodeRes>> bizTypes(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getBizTypes(principal));
    }

    /** AS-IS rpt.Rpt03_Week.getBeforeWeek — 직전 보고 1건(없으면 data null) */
    @GetMapping("/before")
    public ApiResponse<WeekRes> before(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.getBeforeWeek(principal, startDate));
    }

    /** AS-IS rpt.Rpt03_Week.insertBeforeWeek → 복사한 건수 */
    @PostMapping("/copy-before")
    public ApiResponse<Integer> copyBefore(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekCopyReq req) {
        return ApiResponse.ok(service.copyBeforeWeek(principal, req));
    }

    /** AS-IS rpt.Rpt03_Week.modelUpsert — 저장한 행 */
    @PutMapping
    public ApiResponse<WeekRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS rpt.Rpt03_Week.update (건의사항 그리드) — 저장한 행들(요청과 같은 순서) */
    @PutMapping("/requests")
    public ApiResponse<List<WeekRes>> saveRequests(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekRequestSaveReq req) {
        return ApiResponse.ok(service.saveRequests(principal, req));
    }

    /** AS-IS rpt.Rpt03_Week.inUpdateData — ▲▼ 뒤 순번 */
    @PutMapping("/seq")
    public ApiResponse<Integer> saveSeq(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekSeqReq req) {
        return ApiResponse.ok(service.saveSeq(principal, req));
    }

    /** AS-IS rpt.Rpt03_Week.updateFixYn — 제출(true)·제출취소(false) → 바꾼 건수 */
    @PutMapping("/fix")
    public ApiResponse<Integer> fix(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekFixReq req) {
        return ApiResponse.ok(service.updateFix(principal, req));
    }

    /** AS-IS rpt.Rpt03_Week.boldUpdate */
    @PutMapping("/{weekId}/bold")
    public ApiResponse<Integer> bold(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long weekId, @RequestBody WeekBoldReq req) {
        return ApiResponse.ok(service.updateBold(principal, weekId, req.bold()));
    }

    /** AS-IS rpt.Rpt03_Week.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS rpt.Rpt03_Week.getLastWeek + sys.Sys99_Print.insertRdWeekWrite → 출력 그룹 ID·지난주 기간 */
    @PostMapping("/rd-print")
    public ApiResponse<WeekPrintRes> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekPrintReq req) {
        return ApiResponse.ok(service.insertRdWeekWrite(principal, req));
    }

    // ===== Rpt05 주간업무구분 관리 (Rpt05_Lookup_WeekBizClass) =====

    /** AS-IS rpt.Rpt05_WeekBizClass.selectByPersonId */
    @GetMapping("/biz-classes")
    public ApiResponse<List<WeekBizClassRes>> bizClasses(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getBizClasses(principal));
    }

    /** AS-IS rpt.Rpt05_WeekBizClass.upsert */
    @PutMapping("/biz-classes")
    public ApiResponse<Integer> saveBizClasses(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WeekBizClassSaveReq req) {
        return ApiResponse.ok(service.saveBizClasses(principal, req));
    }
}
