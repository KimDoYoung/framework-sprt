package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskRelateRuleAddReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskRelateRuleRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskRelateRuleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 직무 연관규정 매핑 창 (AS-IS client/vi/tdm/Tdm11_Lookup_TaskRelateRule, EE43) */
@RestController
@RequestMapping("/api/v1/tdm/task-relate-rules")
@RequiredArgsConstructor
public class TdmTaskRelateRuleController {

    private final TdmTaskRelateRuleService service;

    /** AS-IS tdm.Tdm11_TaskRelateRule.selectBySearchText */
    @GetMapping
    public ApiResponse<List<TaskRelateRuleRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long taskId,
                                                       @RequestParam(required = false) String relateType,
                                                       @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, taskId, relateType, searchText));
    }

    /** AS-IS tdm.Tdm11_TaskRelateRule.update (새 행) → 넣은 건수 */
    @PostMapping
    public ApiResponse<Integer> add(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<TaskRelateRuleAddReq> rows) {
        return ApiResponse.ok(service.add(principal, rows));
    }

    /** AS-IS tdm.Tdm11_TaskRelateRule.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
