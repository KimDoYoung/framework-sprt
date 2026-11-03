package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.AccountNumRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountNumSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActAccountNumService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 결산회기관리 (AS-IS Act09_Tab_AccountNum(메뉴 #1206) → server/act/Act09_AccountNum) */
@RestController
@RequestMapping("/api/v1/act/account-nums")
@RequiredArgsConstructor
public class ActAccountNumController {

    private final ActAccountNumService service;

    /** AS-IS act.Act09_AccountNum.selectByRetrieve */
    @GetMapping
    public ApiResponse<List<AccountNumRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS act.Act09_AccountNum.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<AccountNumRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestBody List<AccountNumSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS act.Act09_AccountNum.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
