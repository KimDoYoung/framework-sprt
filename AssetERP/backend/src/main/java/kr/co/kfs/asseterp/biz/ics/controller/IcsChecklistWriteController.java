package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteAnswerReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteCreateReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteFixReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteItem;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteReasonReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistWriteService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 내부통제 체크리스트 작성 (AS-IS Ics15_Tab_ChecklistWrite·Ics15_Edit_Reason → server/ics/Ics15_ChecklistWrite) — 메뉴 #1229 */
@RestController
@RequestMapping("/api/v1/ics/checklist-writes")
@RequiredArgsConstructor
public class IcsChecklistWriteController {

    private final IcsChecklistWriteService service;

    /** AS-IS settings()의 sys.Sys01_Company.selectById — 체크주기(M 월 / Q 분기), 설정이 없으면 null */
    @GetMapping("/cycle-type")
    public ApiResponse<String> cycleType(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.cycleType(principal));
    }

    /** AS-IS ics.Ics10_Checklist.selectByPersonId — stdDate = 기준 분기(월)의 말일 */
    @GetMapping
    public ApiResponse<List<IcsChecklistWriteRes>> list(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                        @RequestParam String cycleType,
                                                        @RequestParam(required = false) Long checklistLClassId,
                                                        @RequestParam(required = false) Long checklistMClassId,
                                                        @RequestParam(required = false, defaultValue = "") String searchText,
                                                        @RequestParam boolean checkBox) {
        return ApiResponse.ok(service.list(principal, stdDate, cycleType, checklistLClassId, checklistMClassId, searchText, checkBox));
    }

    /** AS-IS ics.Ics15_ChecklistWrite.updateAnswerCode — 예·아니오·해당없음 */
    @PutMapping("/answers")
    public ApiResponse<IcsChecklistWriteItem> updateAnswerCode(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestBody IcsChecklistWriteAnswerReq req) {
        return ApiResponse.ok(service.updateAnswerCode(principal, req));
    }

    /** AS-IS ics.Ics15_ChecklistWrite.modelUpdate(새 행) — 사유 창을 처음 열 때 */
    @PostMapping
    public ApiResponse<IcsChecklistWriteItem> create(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestBody IcsChecklistWriteCreateReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS ics.Ics15_ChecklistWrite.selectById */
    @GetMapping("/{checklistWriteId}")
    public ApiResponse<IcsChecklistWriteItem> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long checklistWriteId) {
        return ApiResponse.ok(service.get(principal, checklistWriteId));
    }

    /** AS-IS ics.Ics15_ChecklistWrite.modelUpdate — 사유 저장 */
    @PutMapping("/{checklistWriteId}/reason")
    public ApiResponse<IcsChecklistWriteItem> updateReason(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long checklistWriteId,
                                                           @RequestBody IcsChecklistWriteReasonReq req) {
        return ApiResponse.ok(service.updateReason(principal, checklistWriteId, req.reason()));
    }

    /** AS-IS ics.Ics15_ChecklistWrite.updateFixYn — 제출·제출취소 */
    @PutMapping("/fix")
    public ApiResponse<Integer> updateFixYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsChecklistWriteFixReq req) {
        return ApiResponse.ok(service.updateFixYn(principal, req));
    }

    /** AS-IS ics.Ics15_ChecklistWrite.deleteByPersonId — 새로작성(내 작성 내역 삭제) */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate, @RequestParam String cycleType) {
        return ApiResponse.ok(service.deleteByPersonId(principal, stdDate, cycleType));
    }
}
