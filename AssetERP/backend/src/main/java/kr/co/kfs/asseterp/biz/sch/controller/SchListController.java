package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04CheckStatusRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04CheckStatusSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04DailyCheckRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04DailyCheckStatusReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListResultReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04TodoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04TodoSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchListService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 법규보고 점검 (AS-IS Sch04_Tab_IcsList → server/sch/Sch04_List) */
@RestController
@RequestMapping("/api/v1/sch/lists")
@RequiredArgsConstructor
public class SchListController {

    private final SchListService service;

    /** AS-IS sch.Sch04_List.selectByIcs (managerYn=false). 발생구분·주기구분은 비면 전체('%') */
    @GetMapping("/ics")
    public ApiResponse<List<Sch04ListRes>> searchIcs(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                     @RequestParam(defaultValue = "false") boolean doneExceptYn,
                                                     @RequestParam(required = false) String scheduleCode,
                                                     @RequestParam(required = false) String cycleCode,
                                                     @RequestParam(defaultValue = "") String searchText,
                                                     @RequestParam(defaultValue = "false") boolean advisYn) {
        return ApiResponse.ok(service.searchIcs(principal, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, searchText, advisYn));
    }

    /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdIcsList + RD 리포트 Sch04_Rd_IcsList → 조회 결과 xlsx) */
    @GetMapping("/ics/excel")
    public ResponseEntity<byte[]> downloadIcs(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                              @RequestParam(defaultValue = "false") boolean doneExceptYn,
                                              @RequestParam(required = false) String scheduleCode,
                                              @RequestParam(required = false) String cycleCode,
                                              @RequestParam(defaultValue = "") String searchText,
                                              @RequestParam(defaultValue = "false") boolean advisYn) {
        byte[] body = service.downloadIcs(principal, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, searchText, advisYn);
        String fileName = "법규보고 점검(" + startDate + " ~ " + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS sch.Sch04_List.selectByIcs (managerYn=true, 관리자 화면 Sch04_Tab_IcsListManager). orgId가 없으면 전체 담당부서 */
    @GetMapping("/ics/manager")
    public ApiResponse<List<Sch04ListRes>> searchIcsManager(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(required = false) Long orgId,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                            @RequestParam(defaultValue = "false") boolean doneExceptYn,
                                                            @RequestParam(required = false) String scheduleCode,
                                                            @RequestParam(required = false) String cycleCode,
                                                            @RequestParam(defaultValue = "") String searchText,
                                                            @RequestParam(defaultValue = "false") boolean advisYn) {
        return ApiResponse.ok(service.searchIcsManager(principal, orgId, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, searchText, advisYn));
    }

    /** 관리자 출력/다운로드 (AS-IS rdButton managerYn=true → xlsx) */
    @GetMapping("/ics/manager/excel")
    public ResponseEntity<byte[]> downloadIcsManager(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam(required = false) Long orgId,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                     @RequestParam(defaultValue = "false") boolean doneExceptYn,
                                                     @RequestParam(required = false) String scheduleCode,
                                                     @RequestParam(required = false) String cycleCode,
                                                     @RequestParam(defaultValue = "") String searchText,
                                                     @RequestParam(defaultValue = "false") boolean advisYn) {
        byte[] body = service.downloadIcsManager(principal, orgId, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, searchText, advisYn);
        String fileName = "법규보고 점검(관리자)(" + startDate + " ~ " + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS sch.Sch04_List.selectByManagerId — 업무일정 처리(O04). manageCheck: 처리일 기준(false면 마감일), statusCode 전체는 '%', classId 없으면 전체 */
    @GetMapping("/todo")
    public ApiResponse<List<Sch04TodoRes>> searchTodo(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam(defaultValue = "false") boolean manageCheck,
                                                      @RequestParam(defaultValue = "false") boolean exceptYn,
                                                      @RequestParam(defaultValue = "true") boolean cancelYn,
                                                      @RequestParam(required = false) String statusCode,
                                                      @RequestParam(required = false) Long classId) {
        return ApiResponse.ok(service.searchTodo(principal, manageCheck, startDate, exceptYn, cancelYn, statusCode, classId));
    }

    /** AS-IS sch.Sch04_List.insertCheck — 고친 행(처리여부·처리일·담당자·비고)을 저장한다 */
    @PutMapping("/todo")
    public ApiResponse<Integer> saveTodo(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch04TodoSaveReq> rows) {
        service.saveTodo(principal, rows);
        return ApiResponse.ok(rows.size());
    }

    /** AS-IS sch.Sch04_List.selectByManagerId — 데일리 체크리스트(O05). 분류 없으면 전체, 검색어 없으면 전체 */
    @GetMapping("/daily-check")
    public ApiResponse<List<Sch04DailyCheckRes>> searchDailyCheck(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                  @RequestParam(required = false) Long classId,
                                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchDailyCheck(principal, startDate, classId, searchText));
    }

    /** AS-IS sch.Sch04_List.selectCheckListStatus — 업무일정 체크내역(O06). 처리여부 없으면 전체, 분류 없으면 전체 */
    @GetMapping("/check-status")
    public ApiResponse<List<Sch04CheckStatusRes>> searchCheckStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                                    @RequestParam(required = false) String statusCode,
                                                                    @RequestParam(required = false) Long classId,
                                                                    @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchCheckStatus(principal, startDate, endDate, statusCode, classId, searchText));
    }

    /** AS-IS sch.Sch04_List.statusUpdateCheck — 체크(처리완료·해당없음) 한 건을 저장하고 그 행의 listId를 돌려준다 */
    @PutMapping("/daily-check/status")
    public ApiResponse<Long> updateDailyCheckStatus(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Sch04DailyCheckStatusReq req) {
        return ApiResponse.ok(service.updateStatus(principal, req));
    }

    /** AS-IS sch.Sch04_List.upsert — 고친 행(처리구분·처리일)을 저장한다 */
    @PutMapping
    public ApiResponse<Integer> upsert(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch04ListSaveReq> rows) {
        service.upsert(principal, rows);
        return ApiResponse.ok(rows.size());
    }

    /** AS-IS sch.Sch04_List.updateConfirm — type U 처리결과 저장 / P 확인 / C 확인취소 → 바뀐 한 행 */
    @PutMapping("/{listId}/result")
    public ApiResponse<Sch04ListRes> updateResult(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long listId, @RequestBody Sch04ListResultReq req) {
        return ApiResponse.ok(service.updateResult(principal, listId, req));
    }
}
