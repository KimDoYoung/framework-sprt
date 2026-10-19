package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalGradeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 평가등급 (AS-IS Emp42_Lookup_EvalGrade → server/emp/Emp42_EvalGrade) — 메뉴 #1398·#1391의 평가등급 아이콘 */
@RestController
@RequestMapping("/api/v1/emp/eval-grades")
@RequiredArgsConstructor
public class EmpEvalGradeController {

    private final EmpEvalGradeService service;

    /** AS-IS emp.Emp42_EvalGrade.selectByEvalListStdId */
    @GetMapping
    public ApiResponse<List<EvalGradeRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long evalListStdId) {
        return ApiResponse.ok(service.search(principal, evalListStdId));
    }

    /** AS-IS emp.Emp42_EvalGrade.updateList → 저장한 행 수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EvalGradeSaveReq req) {
        return ApiResponse.ok(service.update(principal, req));
    }
}
