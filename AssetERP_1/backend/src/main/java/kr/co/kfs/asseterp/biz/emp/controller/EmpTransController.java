package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.kfs.asseterp.biz.emp.dto.TransPersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransService;

import java.util.List;

/** 일반발령 탭 (AS-IS Emp03_TabPage_Trans → server/emp/Emp03_Trans) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpTransController {

    private final EmpTransService empTransService;

    /** AS-IS emp.Emp03_Trans.selectByPersonId (deleteCheck도 이 행 수로) */
    @GetMapping("/persons/{personId}/trans")
    public ApiResponse<List<TransRes>> searchTranses(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable Long personId) {
        return ApiResponse.ok(empTransService.searchTranses(principal, personId));
    }

    /** AS-IS emp.Emp03_Trans.selectByText (사원찾기 Emp01_Lookup_PersonModel) */
    @GetMapping("/trans")
    public ApiResponse<List<TransPersonRes>> searchTransPersons(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(empTransService.searchTransPersons(principal, searchText));
    }

    /** AS-IS emp.Emp03_Trans.update → 저장된 행(요청 순서) */
    @PutMapping("/trans")
    public ApiResponse<List<TransRes>> updateTranses(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestBody List<TransSaveReq> rows) {
        return ApiResponse.ok(empTransService.updateTranses(principal, rows));
    }

    /** AS-IS emp.Emp03_Trans.delete → 지운 건수 */
    @DeleteMapping("/trans")
    public ApiResponse<Integer> deleteTranses(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestBody List<Long> transIds) {
        return ApiResponse.ok(empTransService.deleteTranses(principal, transIds));
    }
}
