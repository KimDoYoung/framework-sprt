package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.InitLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.InitLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpInitLeaveService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 초기설정 휴가일수 (AS-IS Emp26_Lookup_InitLeave → server/emp/Emp26_InitLeave) */
@RestController
@RequestMapping("/api/v1/emp/init-leaves")
@RequiredArgsConstructor
public class EmpInitLeaveController {

    private final EmpInitLeaveService service;

    /** AS-IS emp.Emp26_InitLeave.selectByYear */
    @GetMapping
    public ApiResponse<List<InitLeaveRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam String year, @RequestParam(required = false) Long personId) {
        return ApiResponse.ok(service.search(principal, year, personId));
    }

    /** AS-IS emp.Emp26_InitLeave.update — 저장한 행(요청과 같은 순서) */
    @PutMapping
    public ApiResponse<List<InitLeaveRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestBody List<InitLeaveSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp26_InitLeave.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
