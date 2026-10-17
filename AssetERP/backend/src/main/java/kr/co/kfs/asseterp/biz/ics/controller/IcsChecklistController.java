package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistClassCodeRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 내부통제 체크리스트(관리자) (AS-IS Ics10_Tab_ChecklistAdmin·Ics10_Edit_Checklist → server/ics/Ics10_Checklist) — 메뉴 #1232 */
@RestController
@RequestMapping("/api/v1/ics/checklists")
@RequiredArgsConstructor
public class IcsChecklistController {

    private final IcsChecklistService service;

    /** AS-IS ics.Ics10_Checklist.selectByAdmin */
    @GetMapping
    public ApiResponse<List<IcsChecklistRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam(required = false) Long checklistLClassId,
                                                     @RequestParam(required = false) Long checklistMClassId,
                                                     @RequestParam(defaultValue = "%") String useYn,
                                                     @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, checklistLClassId, checklistMClassId, useYn, searchText));
    }

    /** 새 체크리스트의 id (AS-IS GridInsertRow의 getSeq) */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS ics.Ics10_Checklist.modelUpdate → 저장된 행 */
    @PutMapping
    public ApiResponse<IcsChecklistRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsChecklistSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS ics.Ics10_Checklist.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> checklistIds) {
        return ApiResponse.ok(service.delete(principal, checklistIds));
    }

    /** AS-IS sys.Sys09_Code.selectByIcs21 */
    @GetMapping("/l-codes")
    public ApiResponse<List<IcsChecklistClassCodeRes>> lCodes(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.lCodes(principal));
    }

    /** AS-IS sys.Sys09_Code.selectByIcs23 */
    @GetMapping("/m-codes")
    public ApiResponse<List<IcsChecklistClassCodeRes>> mCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long checklistLClassId) {
        return ApiResponse.ok(service.mCodes(principal, checklistLClassId));
    }
}
