package kr.co.kfs.asseterp.biz.sms.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.SmsAlarmHistoryRes;
import kr.co.kfs.asseterp.biz.sms.service.SmsAlarmHistoryService;
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

/** 알림함 창 (AS-IS Sms10_Lookup_AlarmList, EE57) */
@RestController
@RequestMapping("/api/v1/sms/alarm-histories")
@RequiredArgsConstructor
public class SmsAlarmHistoryController {

    private final SmsAlarmHistoryService service;

    /** AS-IS sms.Sms10_AlarmHistory.selectByText */
    @GetMapping
    public ApiResponse<List<SmsAlarmHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(defaultValue = "in") String inOutYn,
                                                        @RequestParam(required = false) String searchText,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.search(principal, inOutYn, searchText, startDate, closeDate));
    }
}
