package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorPrintReq;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorRes;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpDirectorService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 임원정보 관리 (AS-IS Emp31_Tab_Director → server/emp/Emp31_Director) */
@RestController
@RequestMapping("/api/v1/emp/directors")
@RequiredArgsConstructor
public class EmpDirectorController {

    private final EmpDirectorService service;

    /** AS-IS emp.Emp31_Director.selectByText */
    @GetMapping
    public ApiResponse<List<DirectorRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false, defaultValue = "") String searchText,
                                                 @RequestParam(required = false, defaultValue = "false") boolean endCheck) {
        return ApiResponse.ok(service.search(principal, searchText, endCheck));
    }

    /** AS-IS emp.Emp31_Director.updateList → 저장한 건수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<DirectorSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys99_Print.insertRdDirector01 → 선임/해임 보고 출력 그룹 ID(seniorGroupId) */
    @PostMapping("/rd-print-senior")
    public ApiResponse<String> rdPrintSenior(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DirectorPrintReq req) {
        return ApiResponse.ok(service.insertRdSenior(principal, req));
    }

    /** AS-IS sys.Sys99_Print.insertRdDirector02 → 전체 현황 출력 그룹 ID(totalGroupId) */
    @PostMapping("/rd-print-total")
    public ApiResponse<String> rdPrintTotal(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DirectorPrintReq req) {
        return ApiResponse.ok(service.insertRdTotal(principal, req));
    }
}
