package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvaluationRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvaluationSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvaluationService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 고과(평가)내역 탭 (AS-IS Emp09_TabPage_Evaluation → server/emp/emp09_evaluation.xml) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpEvaluationController {

    private final EmpEvaluationService empEvaluationService;

    @GetMapping("/persons/{personId}/evaluations")
    public ApiResponse<List<EvaluationRes>> getEvaluations(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable Long personId) {
        return ApiResponse.ok(empEvaluationService.getEvaluations(principal, personId));
    }

    @PutMapping("/evaluations")
    public ApiResponse<List<EvaluationRes>> updateEvaluations(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestBody List<EvaluationSaveReq> rows) {
        return ApiResponse.ok(empEvaluationService.updateEvaluations(principal, rows));
    }

    @DeleteMapping("/evaluations")
    public ApiResponse<Integer> deleteEvaluations(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestBody List<Long> evaluationIds) {
        return ApiResponse.ok(empEvaluationService.deleteEvaluations(principal, evaluationIds));
    }
}
