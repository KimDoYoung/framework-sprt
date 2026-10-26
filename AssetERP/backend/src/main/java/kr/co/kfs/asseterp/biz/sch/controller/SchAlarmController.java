package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch06AlarmRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch06AlarmSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchAlarmService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 알람설정 (AS-IS Sch06_Lookup_AlarmSetup → server/sch/Sch06_Alarm) */
@RestController
@RequestMapping("/api/v1/sch/alarms")
@RequiredArgsConstructor
public class SchAlarmController {

    private final SchAlarmService service;

    /** AS-IS sch.Sch06_Alarm.selectByTargetId */
    @GetMapping
    public ApiResponse<List<Sch06AlarmRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long targetId) {
        return ApiResponse.ok(service.search(principal, targetId));
    }

    /** AS-IS sch.Sch06_Alarm.update → 저장한 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Sch06AlarmRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch06AlarmSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS sch.Sch06_Alarm.delete → 지운 수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> alarmIds) {
        return ApiResponse.ok(service.delete(principal, alarmIds));
    }
}
