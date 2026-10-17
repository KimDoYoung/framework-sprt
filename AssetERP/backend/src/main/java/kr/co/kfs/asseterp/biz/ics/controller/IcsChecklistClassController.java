package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistLClassRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistLClassSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistMClassRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistMClassSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistClassService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 체크리스트 분류관리 (AS-IS Ics21_Lookup_CheckList·Ics23_TabPage_CheckList → server/ics/Ics21_ChecklistLClass·Ics23_ChecklistMClass) */
@RestController
@RequestMapping("/api/v1/ics/checklist-classes")
@RequiredArgsConstructor
public class IcsChecklistClassController {

    private final IcsChecklistClassService service;

    /** AS-IS ics.Ics21_ChecklistLClass.selectByCompanyId */
    @GetMapping("/l")
    public ApiResponse<List<IcsChecklistLClassRes>> searchL(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchL(principal));
    }

    /** AS-IS ics.Ics21_ChecklistLClass.update → 저장 뒤 대분류 목록 */
    @PutMapping("/l")
    public ApiResponse<List<IcsChecklistLClassRes>> saveL(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcsChecklistLClassSaveReq> rows) {
        return ApiResponse.ok(service.saveL(principal, rows));
    }

    /** AS-IS ics.Ics21_ChecklistLClass.deleteCheck → 작성 기록이 있어 못 지우는 분류 수 */
    @PostMapping("/l/check-delete")
    public ApiResponse<Integer> checkDeleteL(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.countLInUse(principal, ids));
    }

    /** AS-IS ics.Ics21_ChecklistLClass.delete → 지운 건수 */
    @DeleteMapping("/l")
    public ApiResponse<Integer> deleteL(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteL(principal, ids));
    }

    /** AS-IS ics.Ics23_ChecklistMClass.selectByCompanyId */
    @GetMapping("/m")
    public ApiResponse<List<IcsChecklistMClassRes>> searchM(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long checklistLClassId) {
        return ApiResponse.ok(service.searchM(principal, checklistLClassId));
    }

    /** AS-IS ics.Ics23_ChecklistMClass.update → 저장 뒤 그 대분류의 중분류 목록 */
    @PutMapping("/m")
    public ApiResponse<List<IcsChecklistMClassRes>> saveM(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcsChecklistMClassSaveReq> rows) {
        return ApiResponse.ok(service.saveM(principal, rows));
    }

    /** AS-IS ics.Ics23_ChecklistMClass.deleteCheck */
    @PostMapping("/m/check-delete")
    public ApiResponse<Integer> checkDeleteM(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.countMInUse(principal, ids));
    }

    /** AS-IS ics.Ics23_ChecklistMClass.delete */
    @DeleteMapping("/m")
    public ApiResponse<Integer> deleteM(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteM(principal, ids));
    }
}
