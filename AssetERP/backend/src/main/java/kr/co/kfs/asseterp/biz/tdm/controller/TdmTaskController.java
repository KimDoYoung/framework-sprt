package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskService;
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

/** 책무 (AS-IS server/tdm/Tdm10_Task) */
@RestController
@RequestMapping("/api/v1/tdm/tasks")
@RequiredArgsConstructor
public class TdmTaskController {

    private final TdmTaskService service;

    /** AS-IS tdm.Tdm10_Task.selectByText */
    @GetMapping
    public ApiResponse<List<TaskRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                             @RequestParam(defaultValue = "%") String taskClassCode,
                                             @RequestParam(defaultValue = "true") boolean allYn,
                                             @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, baseDate, taskClassCode, allYn, searchText));
    }

    /** AS-IS dbConfig.getSeq (DBUtil.setSeq) — 새 책무 ID를 미리 받는다 */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS tdm.Tdm10_Task.selectById */
    @GetMapping("/{taskId}")
    public ApiResponse<TaskRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long taskId) {
        return ApiResponse.ok(service.get(principal, taskId));
    }

    /** AS-IS tdm.Tdm10_Task.countUseByTaskId */
    @GetMapping("/use-count")
    public ApiResponse<Integer> countUse(@RequestParam List<Long> taskIds) {
        return ApiResponse.ok(service.countUse(taskIds));
    }

    /** AS-IS tdm.Tdm10_Task.modelUpdate (INSERT·COPY) */
    @PostMapping
    public ApiResponse<TaskRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TaskSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS tdm.Tdm10_Task.modelUpdate (UPDATE) */
    @PutMapping("/{taskId}")
    public ApiResponse<TaskRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long taskId,
                                       @RequestBody TaskSaveReq req) {
        return ApiResponse.ok(service.update(principal, taskId, req));
    }

    /** AS-IS tdm.Tdm10_Task.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TaskDeleteReq req) {
        return ApiResponse.ok(service.delete(principal, req));
    }
}
