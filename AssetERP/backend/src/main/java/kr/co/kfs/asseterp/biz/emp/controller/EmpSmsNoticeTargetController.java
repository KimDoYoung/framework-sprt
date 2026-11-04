package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeTargetRes;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeTargetSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpSmsNoticeTargetService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 알림수신인 설정 (AS-IS Emp93_Lookup_SmsNoticeTarget → server/emp/Emp93_SmsNoticeTarget) */
@RestController
@RequestMapping("/api/v1/emp/sms-notice-targets")
@RequiredArgsConstructor
public class EmpSmsNoticeTargetController {

    private final EmpSmsNoticeTargetService service;

    /** AS-IS emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode */
    @GetMapping
    public ApiResponse<List<SmsNoticeTargetRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String smsNoticeCd) {
        return ApiResponse.ok(service.search(principal, smsNoticeCd));
    }

    /** AS-IS emp.Emp93_SmsNoticeTarget.update → 저장된 행(요청과 같은 순서) */
    @PutMapping
    public ApiResponse<List<SmsNoticeTargetRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<SmsNoticeTargetSaveReq> list) {
        return ApiResponse.ok(service.save(principal, list));
    }

    /** AS-IS emp.Emp93_SmsNoticeTarget.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
