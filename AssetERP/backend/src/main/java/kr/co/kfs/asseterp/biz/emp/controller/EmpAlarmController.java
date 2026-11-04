package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAlarmSendReq;
import kr.co.kfs.asseterp.biz.push.dto.PersonAlarmRes;
import kr.co.kfs.asseterp.biz.push.service.PushService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 알림발송 (AS-IS Emp00_Lookup_SendMessage.sendMessage → SocketList + sendWebSocketAlarmMessage, EE51) */
@RestController
@RequestMapping("/api/v1/emp/alarms")
@RequiredArgsConstructor
public class EmpAlarmController {

    private final PushService pushService;

    /** 선택한 사원 중 접속 중인 사원에게만 알림을 보낸다(오프라인은 건너뜀). 메시지 앞머리 "['이름'님이 보낸 메세지입니다.]"는 서버가 붙인다 */
    @PostMapping
    public ApiResponse<PersonAlarmRes> send(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EmpAlarmSendReq req) {
        if (req.personIds() == null || req.personIds().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "선택된 사원이 없습니다");
        if (req.message() == null || req.message().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "알림내용을 입력해주세요");
        return ApiResponse.ok(pushService.sendToPersons(principal, req.personIds(), req.message()));
    }
}
