package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriterRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceConfirmService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

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
                                                                @RequestParam String cycleType, @RequestParam(required = false) Long writerId,
                                                                @RequestParam int offset, @RequestParam int limit) {
        return ApiResponse.ok(service.search(principal, stdDate, searchText, checkBox, cycleType, writerId, offset, limit));
    }

    /** AS-IS ics.Ics30_Compliance.getConfirmYn — 내가 확인할 미확인 건수 (V28) */
    @GetMapping("/unconfirmed-count")
    public ApiResponse<Long> unconfirmedCount(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate, @RequestParam String cycleType) {
        return ApiResponse.ok(service.unconfirmedCount(principal, stdDate, cycleType));
    }

    /** AS-IS ics.Ics30_Compliance.selectWriterId — 사원명 조회창 Ics31_Lookup_SelectPerson (V28) */
    @GetMapping("/writers")
    public ApiResponse<List<IcsComplianceWriterRes>> writers(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                             @RequestParam(defaultValue = "") String searchText, @RequestParam String cycleType) {
        return ApiResponse.ok(service.writers(principal, stdDate, searchText, cycleType));
    }

    /** AS-IS ics.Ics31_ComplianceWrite.updateConfirmYn — 확인·확인취소 */
    @PutMapping("/confirm")
    public ApiResponse<Integer> updateConfirmYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceConfirmReq req) {
        return ApiResponse.ok(service.updateConfirmYn(principal, req));
    }
}
