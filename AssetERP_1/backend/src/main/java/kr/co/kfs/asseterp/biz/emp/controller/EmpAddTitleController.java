package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AddTitleRes;
import kr.co.kfs.asseterp.biz.emp.dto.AddTitleSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpAddTitleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 겸직발령 탭·겸직 등록 팝업 (AS-IS Emp04_TabPage_AddTitle, Emp04_Edit_AddTitle → server/emp/Emp04_AddTitle.java) */
@RestController
@RequestMapping("/api/v1/emp/add-titles")
@RequiredArgsConstructor
public class EmpAddTitleController {

    private final EmpAddTitleService empAddTitleService;

    /** selectByPersonId (GET /persons/{id}/add-titles는 C01 건수 API라 쿼리 파라미터로 둔다) */
    @GetMapping
    public ApiResponse<List<AddTitleRes>> getAddTitles(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam Long personId) {
        return ApiResponse.ok(empAddTitleService.getAddTitles(principal, personId));
    }

    /** updateList — 등록 */
    @PostMapping
    public ApiResponse<AddTitleRes> createAddTitle(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestBody AddTitleSaveReq req) {
        return ApiResponse.ok(empAddTitleService.updateList(principal, req));
    }

    /** updateList — 수정 */
    @PutMapping
    public ApiResponse<AddTitleRes> updateAddTitle(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestBody AddTitleSaveReq req) {
        return ApiResponse.ok(empAddTitleService.updateList(principal, req));
    }

    /** deleteList + delete */
    @DeleteMapping("/{addTitleId}")
    public ApiResponse<Integer> deleteAddTitle(@AuthenticationPrincipal UserPrincipal principal,
                                               @PathVariable Long addTitleId) {
        return ApiResponse.ok(empAddTitleService.deleteAddTitle(principal, addTitleId));
    }
}
