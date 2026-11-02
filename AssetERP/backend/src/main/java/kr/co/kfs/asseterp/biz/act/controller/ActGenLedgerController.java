package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCloseProcessRes;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCloseReq;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCloseStatusRes;
import kr.co.kfs.asseterp.biz.act.service.ActGenLedgerService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 회계마감 Act04_Tab_Close (X14) — AS-IS Act04_GenLedger.selectCloseStatus · insertClose */
@RestController
@RequestMapping("/api/v1/act/gen-ledger-closes")
@RequiredArgsConstructor
public class ActGenLedgerController {

    private final ActGenLedgerService service;

    /** 연도별 월 마감현황 */
    @GetMapping
    public ApiResponse<List<GenLedgerCloseStatusRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam String year) {
        return ApiResponse.ok(service.searchCloseStatus(principal, year));
    }

    /** 회계마감(P)·마감취소(C)·마감검증(A). 검증 실패도 200으로 status -1 + 마감현황을 돌려준다 */
    @PostMapping("/process")
    public ApiResponse<GenLedgerCloseProcessRes> process(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestBody GenLedgerCloseReq req) {
        return ApiResponse.ok(service.close(principal, req));
    }
}
