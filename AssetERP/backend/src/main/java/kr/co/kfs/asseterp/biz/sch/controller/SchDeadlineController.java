package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineCopyReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineTemplateRes;
import kr.co.kfs.asseterp.biz.sch.service.SchDeadlineService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법규 기한 (AS-IS Sch03_Lookup_Ics·Sch03_Lookup_Cycle·Sch03_Lookup_Short → server/sch/Sch03_Deadline) */
@RestController
@RequestMapping("/api/v1/sch/deadlines")
@RequiredArgsConstructor
public class SchDeadlineController {

    private final SchDeadlineService service;

    /** AS-IS sch.Sch03_Deadline.selectByClassTreeId */
    @GetMapping
    public ApiResponse<List<Sch03DeadlineRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long infoId) {
        return ApiResponse.ok(service.search(principal, infoId));
    }

    /** AS-IS sch.Sch03_Deadline.selectById */
    @GetMapping("/{deadlineId}")
    public ApiResponse<Sch03DeadlineRes> get(@PathVariable Long deadlineId) {
        return ApiResponse.ok(service.get(deadlineId));
    }

    /** AS-IS sys.Sys00_Common.selectDeadLine */
    @GetMapping("/templates")
    public ApiResponse<List<Sch03DeadlineTemplateRes>> templates() {
        return ApiResponse.ok(service.templates());
    }

    /** AS-IS sch.Sch03_Deadline.selectDeadlineName */
    @GetMapping("/name")
    public ApiResponse<String> deadlineName(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long infoId) {
        return ApiResponse.ok(service.deadlineName(principal, infoId));
    }

    /** AS-IS sch.Sch03_Deadline.insertModel → 저장된 행 */
    @PutMapping
    public ApiResponse<Sch03DeadlineRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Sch03DeadlineSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS sch.Sch03_Deadline.updateModel → 복사한 새 행 */
    @PostMapping("/copy")
    public ApiResponse<Sch03DeadlineRes> copy(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Sch03DeadlineCopyReq req) {
        return ApiResponse.ok(service.copy(principal, req));
    }

    /** AS-IS sch.Sch03_Deadline.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> deadlineIds) {
        return ApiResponse.ok(service.delete(principal, deadlineIds));
    }
}
