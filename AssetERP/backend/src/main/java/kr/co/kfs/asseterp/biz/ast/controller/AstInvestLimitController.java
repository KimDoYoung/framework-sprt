package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitCreateReq;
import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitDateRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstInvestLimitService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 투자한도/StopLoss 설정 조회창 (AS-IS Ast41_Lookup_InvestLimit·Ast41_Lookup_Insert → server/ast/Ast41_InvestLimit) */
@RestController
@RequestMapping("/api/v1/ast/invest-limits")
@RequiredArgsConstructor
public class AstInvestLimitController {

    private final AstInvestLimitService service;

    /** AS-IS ast.Ast41_InvestLimit.selectByCompanyId — 적용일 목록 */
    @GetMapping("/dates")
    public ApiResponse<List<InvestLimitDateRes>> searchDates(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchDates(principal));
    }

    /** AS-IS ast.Ast41_InvestLimit.selectByDate */
    @GetMapping
    public ApiResponse<List<InvestLimitRes>> searchByDate(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.searchByDate(principal, startDate));
    }

    /** AS-IS ast.Ast41_InvestLimit.insert — 적용일 생성(최근 적용일 복사) */
    @PostMapping
    public ApiResponse<Void> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody InvestLimitCreateReq req) {
        service.create(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS ast.Ast41_InvestLimit.deleteByDate → 지운 건수 */
    @DeleteMapping("/by-date")
    public ApiResponse<Integer> deleteByDate(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteByDate(principal, startDate));
    }

    /** AS-IS ast.Ast41_InvestLimit.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<InvestLimitRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestBody List<InvestLimitSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS ast.Ast41_InvestLimit.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
