package kr.co.kfs.asseterp.biz.att.controller;

import kr.co.kfs.asseterp.biz.att.dto.AttPmWorkRes;
import kr.co.kfs.asseterp.biz.att.dto.AttPmWorkSaveReq;
import kr.co.kfs.asseterp.biz.att.service.AttPmWorkService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 오후근무신청 창 (AS-IS Att05_Lookup_PmWork → server/att/Att05_PmWork). 내 신청만 다룬다 */
@RestController
@RequestMapping("/api/v1/att/pm-works")
@RequiredArgsConstructor
public class AttPmWorkController {

    private final AttPmWorkService service;

    /** AS-IS att.Att05_PmWork.selectByWorkDate */
    @GetMapping
    public ApiResponse<List<AttPmWorkRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate) {
        return ApiResponse.ok(service.search(principal, workDate));
    }

    /** AS-IS att.Att05_PmWork.update (+ 창의 저장 전 검사 updateChk01~03) */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AttPmWorkSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS att.Att05_PmWork.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS Att05_Lookup_PmWork.updateApprId — 상신 문서 ID 기록 */
    @PutMapping("/{pmWorkId}/appr")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long pmWorkId, @RequestParam Long apprId) {
        service.updateApprId(principal, pmWorkId, apprId);
        return ApiResponse.ok(null);
    }
}
