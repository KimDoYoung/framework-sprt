package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceConfirmService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/** 내부통제 준수점검(준감인) (AS-IS Ics31_Tab_ComplianceConfirm → server/ics/Ics30_Compliance·Ics31_ComplianceWrite) — 메뉴 #1311 */
@RestController
@RequestMapping("/api/v1/ics/compliance-confirms")
@RequiredArgsConstructor
public class IcsComplianceConfirmController {

    private final IcsComplianceConfirmService service;

    /** AS-IS ics.Ics30_Compliance.selectByPaging — stdDate = 기준 분기(월)의 말일 */
    @GetMapping
    public ApiResponse<PageRes<IcsComplianceConfirmRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                                @RequestParam(defaultValue = "") String searchText, @RequestParam boolean checkBox,
                                                                @RequestParam String cycleType, @RequestParam int offset, @RequestParam int limit) {
        return ApiResponse.ok(service.search(principal, stdDate, searchText, checkBox, cycleType, offset, limit));
    }

    /** AS-IS ics.Ics31_ComplianceWrite.updateConfirmYn — 확인·확인취소 */
    @PutMapping("/confirm")
    public ApiResponse<Integer> updateConfirmYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceConfirmReq req) {
        return ApiResponse.ok(service.updateConfirmYn(principal, req));
    }
}
