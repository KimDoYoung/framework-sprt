package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.ReprAccountInitReq;
import kr.co.kfs.asseterp.biz.act.dto.ReprAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.ReprAccountSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActReprAccountService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 대표계정코드 (AS-IS Act10_Tab_ReprAccount(메뉴 #1156·#1147)·Act10_Lookup_ReprAccount → server/act/Act10_ReprAccount) */
@RestController
@RequestMapping("/api/v1/act/repr-accounts")
@RequiredArgsConstructor
public class ActReprAccountController {

    private final ActReprAccountService service;

    /** AS-IS act.Act10_ReprAccount.selectByCompanyId (로그인 회사) */
    @GetMapping
    public ApiResponse<List<ReprAccountRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) String attributeCode,
                                                    @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, attributeCode, searchText));
    }

    /** AS-IS act.Act10_ReprAccount.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<ReprAccountRes>> update(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestBody List<ReprAccountSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS act.Act10_ReprAccount.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS act.Act10_ReprAccount.insertInitData (기초데이터생성 — 관리자만) → 처리한 고객사 수 */
    @PostMapping("/init-data")
    public ApiResponse<Integer> insertInitData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ReprAccountInitReq req) {
        return ApiResponse.ok(service.insertInitData(principal, req));
    }
}
