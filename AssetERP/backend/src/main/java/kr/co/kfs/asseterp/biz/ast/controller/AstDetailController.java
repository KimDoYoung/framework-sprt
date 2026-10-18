package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.AstDetailRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstDetailSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstDetailService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 자산상세 항목관리 (AS-IS Ast01_Tab_InfoManager → server/ast/Ast02_Detail) — 메뉴 #1089 */
@RestController
@RequestMapping("/api/v1/ast/details")
@RequiredArgsConstructor
public class AstDetailController {

    private final AstDetailService service;

    /** AS-IS ast.Ast02_Detail.selectByCompanyId0 */
    @GetMapping
    public ApiResponse<List<AstDetailRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(defaultValue = "") String searchText,
                                                  @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.search(principal, searchText, useYn));
    }

    /** AS-IS ast.Ast02_Detail.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<AstDetailRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AstDetailSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS ast.Ast02_Detail.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
