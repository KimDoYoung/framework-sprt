package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutyDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutySaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskDutyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 관리의무 등록 (AS-IS server/tdm/Tdm13_TaskRelateDuty) */
@RestController
@RequestMapping("/api/v1/tdm/task-duties")
@RequiredArgsConstructor
public class TdmTaskDutyController {

    private final TdmTaskDutyService service;

    /** AS-IS tdm.Tdm12_TaskRelateDetail.selectByText — 위쪽 책무 세부내용 목록 */
    @GetMapping("/details")
    public ApiResponse<List<TaskDutyDetailRes>> searchDetails(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                                              @RequestParam(defaultValue = "%") String taskTypeCode,
                                                              @RequestParam(defaultValue = "true") boolean allYn,
                                                              @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchDetails(principal, baseDate == null ? LocalDate.now() : baseDate, taskTypeCode, allYn, searchText));
    }

    /** AS-IS tdm.Tdm13_TaskRelateDuty.selectByTaskRelateDetailId */
    @GetMapping
    public ApiResponse<List<TaskDutyRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long taskRelateDetailId) {
        return ApiResponse.ok(service.search(principal, taskRelateDetailId));
    }

    /** AS-IS tdm.Tdm13_TaskRelateDuty.countByDutyId */
    @GetMapping("/use-count")
    public ApiResponse<Integer> countUse(@RequestParam List<Long> dutyIds) {
        return ApiResponse.ok(service.countUse(dutyIds));
    }

    /** AS-IS tdm.Tdm13_TaskRelateDuty.update */
    @PutMapping
    public ApiResponse<List<TaskDutyRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TaskDutySaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS tdm.Tdm13_TaskRelateDuty.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TaskDeleteReq req) {
        return ApiResponse.ok(service.delete(principal, req));
    }
}
