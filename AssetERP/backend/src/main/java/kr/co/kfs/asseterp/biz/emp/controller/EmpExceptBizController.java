package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ExceptBizRes;
import kr.co.kfs.asseterp.biz.emp.dto.ExceptBizSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpExceptBizService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 사원별 예외업무 (AS-IS Emp33_Lookup_ExceptBiz → server/emp/Emp33_ExceptBiz) — Ics30_Tab_Compliance [예외사원 등록](코드 10)이 연다 */
@RestController
@RequestMapping("/api/v1/emp/except-biz")
@RequiredArgsConstructor
public class EmpExceptBizController {

    private final EmpExceptBizService service;

    /** AS-IS emp.Emp33_ExceptBiz.selectByExceptBizCode */
    @GetMapping
    public ApiResponse<List<ExceptBizRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String exceptBizCode) {
        return ApiResponse.ok(service.search(principal, exceptBizCode));
    }

    /** AS-IS emp.Emp33_ExceptBiz.update → 저장된 행 */
    @PutMapping
    public ApiResponse<List<ExceptBizRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ExceptBizSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp33_ExceptBiz.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
