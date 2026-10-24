package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskTypeRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskTypeRow;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskTypeService;
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

/** 책무유형 (AS-IS server/tdm/Tdm14_TaskType) */
@RestController
@RequestMapping("/api/v1/tdm/task-types")
@RequiredArgsConstructor
public class TdmTaskTypeController {

    private final TdmTaskTypeService service;

    /** AS-IS tdm.Tdm14_TaskType.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<TaskTypeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(defaultValue = "%") String taskClassCode,
                                                 @RequestParam(defaultValue = "false") boolean useYn) {
        return ApiResponse.ok(service.search(principal, taskClassCode, useYn));
    }

    /** AS-IS tdm.Tdm14_TaskType.update */
    @PutMapping
    public ApiResponse<List<TaskTypeRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<TaskTypeRow> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS tdm.Tdm14_TaskType.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> taskTypeIds) {
        return ApiResponse.ok(service.delete(principal, taskTypeIds));
    }
}
