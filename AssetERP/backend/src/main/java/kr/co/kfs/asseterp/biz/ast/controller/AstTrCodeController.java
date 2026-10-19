package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.TrCodeInitReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstTrCodeService;
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

/** 거래유형 등록(관리자) (AS-IS Ast05_Tab_TrCodeAdmin(메뉴 #1165) → server/ast/Ast05_TrCode) */
@RestController
@RequestMapping("/api/v1/ast/tr-codes")
@RequiredArgsConstructor
public class AstTrCodeController {

    private final AstTrCodeService service;

    /** AS-IS ast.Ast05_TrCode.selectByCompanyId (로그인 회사) */
    @GetMapping
    public ApiResponse<List<TrCodeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam(required = false) String searchText,
                                               @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.search(principal, searchText, useYn));
    }

    /** AS-IS ast.Ast05_TrCode.selectBySearchText (Ast05_Lookup_TrCode 조회창, 로그인 회사) */
    @GetMapping("/lookup")
    public ApiResponse<List<TrCodeRes>> lookup(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam(required = false) String searchText,
                                               @RequestParam(required = false) String rcvPayCode,
                                               @RequestParam(defaultValue = "1") String assetType,
                                               @RequestParam(required = false) Boolean financeYn) {
        return ApiResponse.ok(service.lookup(principal, searchText, rcvPayCode, assetType, financeYn));
    }

    /** AS-IS ast.Ast05_TrCode.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<TrCodeRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<TrCodeSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS ast.Ast05_TrCode.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS ast.Ast05_TrCode.insertInitData (기초데이터생성 — 관리자만) → 처리한 고객사 수 */
    @PostMapping("/init-data")
    public ApiResponse<Integer> insertInitData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TrCodeInitReq req) {
        return ApiResponse.ok(service.insertInitData(principal, req));
    }
}
