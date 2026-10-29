package kr.co.kfs.asseterp.biz.act.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.act.dto.DepositIoPrintReq;
import kr.co.kfs.asseterp.biz.act.service.ActDepositIoService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 일일자금관리 Act02_Tab_DepositIoList (U01) — RD 출력 자료 */
@RestController
@RequestMapping("/api/v1/act/deposit-ios")
@RequiredArgsConstructor
public class ActDepositIoController {

    private final ActDepositIoService service;

    /** AS-IS sys.Sys99_Print.insertRdDepositIoList → 출력 그룹 ID */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody DepositIoPrintReq req) {
        return ApiResponse.ok(service.insertRdDepositIoList(principal, req));
    }
}
