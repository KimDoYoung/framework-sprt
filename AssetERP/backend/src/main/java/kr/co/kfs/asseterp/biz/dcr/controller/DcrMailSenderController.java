package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailHistorySaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSendReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSendRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSenderInitRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrPublicMailRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrAssetMailReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrAssetMailService;
import kr.co.kfs.asseterp.biz.dcr.service.DcrMailSenderService;
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

/** 메일 발송창 (AS-IS Dcr10_Lookup_MailSender_20261027 → server utils.mail.SendMailSMTP · dcr.Dcr10_MailHistory, EE35) */
@RestController
@RequestMapping("/api/v1/dcr/mail-sender")
@RequiredArgsConstructor
public class DcrMailSenderController {

    private final DcrMailSenderService service;
    private final DcrAssetMailService assetMailService;

    /** 열 때: 본인 메일 · 공용메일 권한 · 첨부 목록(sys.Sys10_File.selectApprRelateDoc) */
    @GetMapping("/init")
    public ApiResponse<DcrMailSenderInitRes> init(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long apprId) {
        return ApiResponse.ok(service.init(principal, apprId));
    }

    /** AS-IS cmp.Cmp10_MailBook.selectByText (공용메일 조회창) */
    @GetMapping("/public-mails")
    public ApiResponse<List<DcrPublicMailRes>> publicMails(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchPublicMails(principal, searchText));
    }

    /** AS-IS utils.mail.SendMailSMTP.sendMailSession(Test) */
    @PostMapping("/send")
    public ApiResponse<DcrMailSendRes> send(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrMailSendReq req) {
        return ApiResponse.ok(service.send(principal, req));
    }

    /** AS-IS client/utils/AssetMailSend (Dcr10_Lookup_MailSender [예]) — 새 메일 시스템 쓰기창 주소(open_url). 개발은 tools/ext-simulator */
    @PostMapping("/asset-mail")
    public ApiResponse<String> assetMail(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrAssetMailReq req) {
        return ApiResponse.ok(assetMailService.openMailWrite(principal, req));
    }

    /** AS-IS dcr.Dcr10_MailHistory.insertMailHistory → 새 기록 ID */
    @PostMapping("/history")
    public ApiResponse<Long> history(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrMailHistorySaveReq req) {
        return ApiResponse.ok(service.saveHistory(principal, req));
    }
}
