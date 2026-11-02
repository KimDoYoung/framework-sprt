package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.FundTransRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundTransSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstFundTransService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 이관펀드 등록(사무관리) Ast33_Tab_OfficeMngFundTrans (AS-IS server/ast/Ast33_FundTrans) — 메뉴 #1251. X34(운용보수 이관펀드 등록)가 같은 API를 쓸 수 있다 */
@RestController
@RequestMapping("/api/v1/ast/fund-trans")
@RequiredArgsConstructor
public class AstFundTransController {

    private final AstFundTransService service;

    /** AS-IS ast.Ast33_FundTrans.selectByDate */
    @GetMapping
    public ApiResponse<List<FundTransRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                  @RequestParam(defaultValue = "%") String fundTransCode,
                                                  @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, fundTransCode, searchText));
    }

    /** AS-IS ast.Ast33_FundTrans.update — 저장한 행 목록을 돌려준다 */
    @PutMapping
    public ApiResponse<List<FundTransRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundTransSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS ast.Ast33_FundTrans.delete */
    @DeleteMapping("/{fundTransId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long fundTransId) {
        service.delete(principal, fundTransId);
        return ApiResponse.ok(null);
    }
}
