package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListStdCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListStdFixReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListStdRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalListStdService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 인사평가 항목 기준 적용일 (AS-IS Emp41_Tab_EvalList·Emp40_Lookup_Insert → server/emp/Emp40_EvalListStd) — 메뉴 #1398·#1391 */
@RestController
@RequestMapping("/api/v1/emp/eval-list-stds")
@RequiredArgsConstructor
public class EmpEvalListStdController {

    private final EmpEvalListStdService service;

    /** AS-IS emp.Emp40_EvalListStd.selectByCompanyId (로그인 회사, 적용일 최근 순) */
    @GetMapping
    public ApiResponse<List<EvalListStdRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS emp.Emp40_EvalListStd.insert → 새 적용기준 ID */
    @PostMapping
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EvalListStdCreateReq req) {
        return ApiResponse.ok(service.create(principal, req.startDate()));
    }

    /** AS-IS emp.Emp40_EvalListStd.updateFixYn (확정·확정취소) */
    @PutMapping("/fix")
    public ApiResponse<Void> updateFixYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EvalListStdFixReq req) {
        service.updateFixYn(principal, req.startDate(), Boolean.TRUE.equals(req.fixYn()));
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp40_EvalListStd.deleteByEvalListStdId */
    @DeleteMapping("/{evalListStdId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long evalListStdId) {
        service.delete(principal, evalListStdId);
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp43_EvalTarget.getEventChk — 이 적용일로 작성중·완료된 평가 대상자가 있으면 true */
    @GetMapping("/{evalListStdId}/in-use")
    public ApiResponse<Boolean> inUse(@PathVariable Long evalListStdId) {
        return ApiResponse.ok(service.inUse(evalListStdId));
    }
}
