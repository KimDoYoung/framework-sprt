package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.CloseCheckRes;
import kr.co.kfs.asseterp.biz.act.dto.CloseCheckSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActCloseCheckService;
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

import java.util.List;

/** 마감검증 체크항목 (AS-IS Act15_Tab_CloseCheck(메뉴 #1368) → server/act/Act15_CloseCheck) */
@RestController
@RequestMapping("/api/v1/act/close-checks")
@RequiredArgsConstructor
public class ActCloseCheckController {

    private final ActCloseCheckService service;

    /** AS-IS act.Act15_CloseCheck.selectByText */
    @GetMapping
    public ApiResponse<List<CloseCheckRes>> search(@RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(searchText));
    }

    /** AS-IS act.Act15_CloseCheck.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<CloseCheckRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestBody List<CloseCheckSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }
}
