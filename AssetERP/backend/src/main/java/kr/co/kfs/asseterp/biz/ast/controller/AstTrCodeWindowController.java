package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowAddReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstTrCodeWindowService;
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

/** 화면별 거래유형 등록 (AS-IS Ast15_Lookup_TrCodeWindow·Ast15_Page_TrCodeWindow → server/ast/Ast15_TrCodeWindow) */
@RestController
@RequestMapping("/api/v1/ast/tr-code-windows")
@RequiredArgsConstructor
public class AstTrCodeWindowController {

    private final AstTrCodeWindowService service;

    /** AS-IS ast.Ast15_TrCodeWindow.selectByAll (companyId는 관리자 회사만 지정) */
    @GetMapping
    public ApiResponse<List<TrCodeWindowRes>> searchAll(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(service.searchAll(principal, companyId));
    }

    /** AS-IS ast.Ast15_TrCodeWindow.selectByClassName */
    @GetMapping("/assigned")
    public ApiResponse<List<TrCodeWindowRes>> searchAssigned(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long companyId,
                                                             @RequestParam String className) {
        return ApiResponse.ok(service.searchAssigned(principal, companyId, className));
    }

    /** AS-IS ast.Ast15_TrCodeWindow.getTrCode */
    @GetMapping("/unassigned")
    public ApiResponse<List<TrCodeWindowRes>> searchUnassigned(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long companyId,
                                                               @RequestParam String className) {
        return ApiResponse.ok(service.searchUnassigned(principal, companyId, className));
    }

    /** AS-IS ast.Ast15_TrCodeWindow.modelUpdate → 등록한 화면 행 */
    @PostMapping
    public ApiResponse<TrCodeWindowRes> add(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TrCodeWindowAddReq req) {
        return ApiResponse.ok(service.add(principal, req));
    }

    /** AS-IS ast.Ast15_TrCodeWindow.insert → 넣은 건수 */
    @PutMapping
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TrCodeWindowSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS ast.Ast15_TrCodeWindow.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long companyId,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, companyId, ids));
    }
}
