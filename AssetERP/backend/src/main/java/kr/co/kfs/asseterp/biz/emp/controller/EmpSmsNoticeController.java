package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeRes;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpSmsNoticeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 알림설정 — 문자 & 메일 (AS-IS Emp92_Lookup_SmsNotice → server/emp/Emp92_SmsNotice, EE63) — 본인 데이터만 */
@RestController
@RequestMapping("/api/v1/emp/sms-notices")
@RequiredArgsConstructor
public class EmpSmsNoticeController {

    private final EmpSmsNoticeService service;

    /** AS-IS emp.Emp92_SmsNotice.selectByPersonId */
    @GetMapping
    public ApiResponse<List<SmsNoticeRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS emp.Emp92_SmsNotice.updateList */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<SmsNoticeSaveReq> rows) {
        service.save(principal, rows);
        return ApiResponse.ok(null);
    }
}
