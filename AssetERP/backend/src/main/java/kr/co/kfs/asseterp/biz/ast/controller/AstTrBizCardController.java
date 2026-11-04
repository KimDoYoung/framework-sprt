package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.TrBizCardRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrBizCardSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstTrBizCardService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 법인카드 사용내역의 비품대장 등록 (AS-IS client/vi/ast/Ast06_Lookup_TrBizCard, EE41) */
@RestController
@RequestMapping("/api/v1/ast/trs/biz-card")
@RequiredArgsConstructor
public class AstTrBizCardController {

    private final AstTrBizCardService service;

    /** AS-IS ast.Ast06_Tr.selectByCardApprovalNo (없으면 새 거래의 기본값) */
    @GetMapping
    public ApiResponse<TrBizCardRes> open(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long promoId,
                                          @RequestParam(required = false) String note) {
        return ApiResponse.ok(service.open(principal, promoId, note));
    }

    /** AS-IS ast.Ast06_Tr.updateDepn → 저장한 거래ID */
    @PutMapping
    public ApiResponse<Long> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TrBizCardSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }
}
