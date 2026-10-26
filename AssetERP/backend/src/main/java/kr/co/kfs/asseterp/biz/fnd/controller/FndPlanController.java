package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanDeleteReq;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanRes;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndPlanService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 기획일정 (AS-IS server/fnd/Fnd20_Plan) */
@RestController
@RequestMapping("/api/v1/fnd/plans")
@RequiredArgsConstructor
public class FndPlanController {

    private final FndPlanService service;

    /** AS-IS fnd.Fnd20_Plan.selectByFundId (Fnd20_TabPage_Plan.retrieve) */
    @GetMapping
    public ApiResponse<List<PlanRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long fundId) {
        return ApiResponse.ok(service.search(principal, fundId));
    }

    /** AS-IS fnd.Fnd20_Plan.update (Fnd20_TabPage_Plan.update) — 저장된 행을 요청 순서대로 돌려준다 */
    @PutMapping
    public ApiResponse<List<PlanRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PlanSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS fnd.Fnd20_Plan.delete (Fnd20_TabPage_Plan.deleteRow) */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PlanDeleteReq> rows) {
        service.delete(principal, rows);
        return ApiResponse.ok(null);
    }
}
