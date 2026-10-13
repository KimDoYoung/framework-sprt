package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuHistoryNoteReq;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuHistoryRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuHistorySaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysSpecificMenuHistoryService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 특정매뉴 요청이력 (AS-IS Sys54_Lookup_SpecificMenuHistory·Sys54_Edit_Note → server/sys/Sys54_SpecificMenuHistory) */
@RestController
@RequestMapping("/api/v1/sys/companies/{companyId}/specific-menu-histories")
@RequiredArgsConstructor
public class SysSpecificMenuHistoryController {

    private final SysSpecificMenuHistoryService sysSpecificMenuHistoryService;

    /** AS-IS sys.Sys54_SpecificMenuHistory.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<SpecificMenuHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId) {
        return ApiResponse.ok(sysSpecificMenuHistoryService.search(principal, companyId));
    }

    /** AS-IS sys.Sys54_SpecificMenuHistory.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<SpecificMenuHistoryRes>> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                            @RequestBody List<SpecificMenuHistorySaveReq> rows) {
        return ApiResponse.ok(sysSpecificMenuHistoryService.update(principal, companyId, rows));
    }

    /** AS-IS sys.Sys54_SpecificMenuHistory.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(sysSpecificMenuHistoryService.delete(principal, companyId, ids));
    }

    /** AS-IS sys.Sys54_SpecificMenuHistory.updateByNote (Sys54_Edit_Note 저장) */
    @PutMapping("/{specificMenuHistoryId}/note")
    public ApiResponse<Void> updateByNote(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                          @PathVariable Long specificMenuHistoryId, @RequestBody SpecificMenuHistoryNoteReq req) {
        sysSpecificMenuHistoryService.updateByNote(principal, companyId, specificMenuHistoryId, req.note());
        return ApiResponse.ok(null);
    }
}
