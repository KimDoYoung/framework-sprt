package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskDetailService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무 세부내용 (AS-IS server/tdm/Tdm12_TaskRelateDetail) */
@RestController
@RequestMapping("/api/v1/tdm/task-details")
@RequiredArgsConstructor
public class TdmTaskDetailController {

    private final TdmTaskDetailService service;

    /** AS-IS tdm.Tdm12_TaskRelateDetail.selectByTaskId */
    @GetMapping
    public ApiResponse<List<TaskDetailRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long taskId) {
        return ApiResponse.ok(service.search(principal, taskId));
    }

    /** AS-IS tdm.Tdm12_TaskRelateDetail.countByTaskDetailId */
    @GetMapping("/use-count")
    public ApiResponse<Integer> countUse(@RequestParam List<Long> detailIds) {
        return ApiResponse.ok(service.countUse(detailIds));
    }

    /** AS-IS tdm.Tdm12_TaskRelateDetail.update */
    @PutMapping
    public ApiResponse<List<TaskDetailRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TaskDetailSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS tdm.Tdm12_TaskRelateDetail.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TaskDeleteReq req) {
        return ApiResponse.ok(service.delete(principal, req));
    }
}
