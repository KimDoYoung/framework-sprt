package kr.co.kfs.asseterp.biz.frm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.frm.dto.FrmCalendarEventRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmIcsNoticeRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmInitialScreenRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmMonitorEmpRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmNoticeCntRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmToDoRes;
import kr.co.kfs.asseterp.biz.frm.service.FrmCalendarService;
import kr.co.kfs.asseterp.biz.frm.service.FrmListService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 알림 창 (AS-IS Frm01_Lookup_CheckList · MainFrame.checkActive → server/frm/Frm01_List, EE53), MyPage 법규 박스(Monitoring_Page_IcsNotice) */
@RestController
@RequestMapping("/api/v1/frm/lists")
@RequiredArgsConstructor
public class FrmListController {

    private final FrmListService service;
    private final FrmCalendarService calendarService;

    /** AS-IS MainFrame 생성자 첫 탭 분기 — COMPANY(고객별 시스템정보 관리) / WELCOME(초기화면) / MYPAGE */
    @GetMapping("/initial-screen")
    public ApiResponse<FrmInitialScreenRes> getInitialScreen(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getInitialScreen(principal));
    }

    /** AS-IS frm.Frm01_List.getNoticeCnt */
    @GetMapping("/notice-count")
    public ApiResponse<FrmNoticeCntRes> getNoticeCnt(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getNoticeCnt(principal));
    }

    /** AS-IS frm.Frm01_List.selectIcsNotice — MyPage 법규보고공시 및 내규정보 */
    @GetMapping("/ics-notices")
    public ApiResponse<List<FrmIcsNoticeRes>> searchIcsNotice(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate selectDate) {
        return ApiResponse.ok(service.searchIcsNotice(principal, selectDate));
    }

    /** AS-IS frm.Frm01_List.selectToDoList — MyPage Day List */
    @GetMapping("/todos")
    public ApiResponse<List<FrmToDoRes>> searchToDo(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate selectDate) {
        return ApiResponse.ok(service.searchToDo(principal, selectDate));
    }

    /** AS-IS JsonProvider mode=calendar (JsonCalendar → frm01_list.selectCalendar) — MyPage 달력. startDate~closeDate 'yyyy-MM-dd' */
    @GetMapping("/calendar")
    public ApiResponse<List<FrmCalendarEventRes>> searchCalendar(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(calendarService.searchCalendar(principal, startDate, closeDate));
    }

    /** AS-IS emp.Emp03_Trans.MonitoringByText — MyPage 현황판 */
    @GetMapping("/emps")
    public ApiResponse<List<FrmMonitorEmpRes>> searchMonitorEmp(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchMonitorEmp(principal, searchText));
    }
}
