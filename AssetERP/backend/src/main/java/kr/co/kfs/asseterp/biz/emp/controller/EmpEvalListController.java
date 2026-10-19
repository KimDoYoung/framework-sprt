package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalListService;
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

/** 인사평가 항목 (AS-IS Emp41_Tab_EvalList → server/emp/Emp41_EvalList) — 메뉴 #1398·#1391 */
@RestController
@RequestMapping("/api/v1/emp/eval-lists")
@RequiredArgsConstructor
public class EmpEvalListController {

    private final EmpEvalListService service;

    /** AS-IS emp.Emp41_EvalList.selectByEvalListStdId */
    @GetMapping
    public ApiResponse<List<EvalListRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long evalListStdId) {
        return ApiResponse.ok(service.search(principal, evalListStdId));
    }

    /** AS-IS emp.Emp41_EvalList.updateList → 저장한 행 수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EvalListSaveReq req) {
        return ApiResponse.ok(service.update(principal, req));
    }
}
