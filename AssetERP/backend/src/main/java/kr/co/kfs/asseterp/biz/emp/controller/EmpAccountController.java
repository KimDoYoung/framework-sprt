package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AccountRes;
import kr.co.kfs.asseterp.biz.emp.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpAccountService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 급여계좌관리 탭 (AS-IS Emp14_TabPage_Account → server/emp/Emp14_Account) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpAccountController {

    private final EmpAccountService empAccountService;

    /** AS-IS Emp14_Account.selectByPersonId */
    @GetMapping("/persons/{personId}/accounts")
    public ApiResponse<List<AccountRes>> getAccounts(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable Long personId) {
        return ApiResponse.ok(empAccountService.getAccounts(principal, personId));
    }

    /** AS-IS Emp14_Account.update → UpdateDataModel */
    @PutMapping("/accounts")
    public ApiResponse<List<AccountRes>> updateAccounts(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestBody List<AccountSaveReq> rows) {
        return ApiResponse.ok(empAccountService.updateAccounts(principal, rows));
    }

    /** AS-IS Emp14_Account.delete → UpdateDataModel.deleteModel */
    @DeleteMapping("/accounts")
    public ApiResponse<Integer> deleteAccounts(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestBody List<Long> accountIds) {
        return ApiResponse.ok(empAccountService.deleteAccounts(principal, accountIds));
    }
}
