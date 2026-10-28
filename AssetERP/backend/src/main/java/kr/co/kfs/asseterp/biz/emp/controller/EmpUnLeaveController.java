package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpUnLeaveService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 연차휴가 사용촉진 (AS-IS Emp21_Tab_UnLeaveList) — 연차 탭은 `/un-leaves`, 월차 탭은 `/un-leaves/month` */
@RestController
@RequestMapping("/api/v1/emp/un-leaves")
@RequiredArgsConstructor
public class EmpUnLeaveController {

    private final EmpUnLeaveService service;

    /** AS-IS emp.Emp21_UnLeave.selectByUnLeaveCode (연차 탭) */
    @GetMapping
    public ApiResponse<List<UnLeaveRes>> searchYearList(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam String stdYear, @RequestParam String unLeaveCode) {
        return ApiResponse.ok(service.searchYearList(principal, stdYear, unLeaveCode));
    }

    /** AS-IS emp.Emp21_UnLeave.selectByUnLeaveCode2 (월차 탭) — unLeaveCode 는 `%`(전체) 가능 */
    @GetMapping("/month")
    public ApiResponse<List<UnLeaveRes>> searchMonthList(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam String stdYear, @RequestParam String unLeaveCode) {
        return ApiResponse.ok(service.searchMonthList(principal, stdYear, unLeaveCode));
    }

    /** AS-IS emp.Emp21_UnLeave.insert ([생성] 창, 연차 탭) → 만든 건수 */
    @PostMapping
    public ApiResponse<Integer> createYear(@AuthenticationPrincipal UserPrincipal principal, @RequestBody UnLeaveCreateReq req) {
        return ApiResponse.ok(service.createYear(principal, req));
    }

    /** AS-IS emp.Emp21_UnLeave.insert2 ([생성], 월차 탭) → 만든 건수 */
    @PostMapping("/month")
    public ApiResponse<Integer> createMonth(@AuthenticationPrincipal UserPrincipal principal, @RequestBody UnLeaveCreateReq req) {
        return ApiResponse.ok(service.createMonth(principal, req));
    }

    /** AS-IS emp.Emp21_UnLeave.update → 저장한 건수 */
    @PutMapping
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<UnLeaveSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp21_UnLeave.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
