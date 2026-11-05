package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailCheckReq;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailCheckRes;
import kr.co.kfs.asseterp.biz.sys.dto.SysMailRes;
import kr.co.kfs.asseterp.biz.sys.dto.SysMailSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysMailService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 회사 메일 등록·수정 창 (AS-IS Sys22_Lookup_Mail → server/sys/Sys22_Mail) */
@RestController
@RequestMapping("/api/v1/sys/mails")
@RequiredArgsConstructor
public class SysMailController {

    private final SysMailService service;

    /** AS-IS sys.Sys22_Mail.modelUpdate (새 메일) */
    @PostMapping
    public ApiResponse<SysMailRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody SysMailSaveReq req) {
        return ApiResponse.ok(service.save(principal, null, req));
    }

    /** AS-IS sys.Sys22_Mail.modelUpdate (고친 메일) */
    @PutMapping("/{mailId}")
    public ApiResponse<SysMailRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long mailId,
                                          @RequestBody SysMailSaveReq req) {
        return ApiResponse.ok(service.save(principal, mailId, req));
    }

    /** AS-IS utils.mail.SendMailSMTP.checkCompanyMail — 시험 메일 발송 */
    @PostMapping("/check")
    public ApiResponse<CmpMailCheckRes> check(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CmpMailCheckReq req) {
        return ApiResponse.ok(service.check(principal, req));
    }
}
