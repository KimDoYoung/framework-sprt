package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalWriteGradeReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalWriteRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalWriteService;
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

/** 인사평가표 작성 (AS-IS Emp44_Lookup_Write → server/emp/Emp44_EvalWrite) — 인사평가수행 메뉴 #1393에서 연다 */
@RestController
@RequestMapping("/api/v1/emp/eval-writes")
@RequiredArgsConstructor
public class EmpEvalWriteController {

    private final EmpEvalWriteService service;

    /** AS-IS emp.Emp44_EvalWrite.getEvalTargetList */
    @GetMapping
    public ApiResponse<List<EvalWriteRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam Long evalListStdId, @RequestParam Long evalTargetId) {
        return ApiResponse.ok(service.search(principal, evalListStdId, evalTargetId));
    }

    /** AS-IS emp.Emp44_EvalWrite.getEmpEvalGrade — 현재 평가등급(없으면 null) */
    @GetMapping("/grade")
    public ApiResponse<String> grade(@AuthenticationPrincipal UserPrincipal principal,
                                     @RequestParam Long evalListStdId, @RequestParam Long evalTargetId) {
        return ApiResponse.ok(service.getGrade(principal, evalListStdId, evalTargetId));
    }

    /** AS-IS emp.Emp44_EvalWrite.updateEvalGradeId */
    @PutMapping("/grade")
    public ApiResponse<Void> updateGrade(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EvalWriteGradeReq req) {
        service.updateGrade(principal, req);
        return ApiResponse.ok(null);
    }
}
