package kr.co.kfs.asseterp.biz.sms.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.SmsSendListReq;
import kr.co.kfs.asseterp.biz.sms.dto.SmsSendTargetRes;
import kr.co.kfs.asseterp.biz.sms.service.SmsSendListService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 문자 발송 창 (AS-IS client/vi/sms/Sms03_Lookup_SendList, V04) */
@RestController
@RequestMapping("/api/v1/sms/send-list")
@RequiredArgsConstructor
public class SmsSendListController {

    private final SmsSendListService service;

    /** AS-IS emp.Emp00_TransInfo.selectByList */
    @GetMapping("/targets")
    public ApiResponse<List<SmsSendTargetRes>> search(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) List<Long> personIds) {
        return ApiResponse.ok(service.search(principal, personIds));
    }

    /** AS-IS sms.Sms03_GroupSend.sendMessageList */
    @PostMapping
    public ApiResponse<Void> send(@AuthenticationPrincipal UserPrincipal principal, @RequestBody SmsSendListReq req) {
        service.send(principal, req.personIds(), req.message());
        return ApiResponse.ok(null);
    }
}
