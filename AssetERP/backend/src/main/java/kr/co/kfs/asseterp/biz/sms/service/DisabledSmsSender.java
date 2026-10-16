package kr.co.kfs.asseterp.biz.sms.service;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** 발송하지 않는 기본 구현 — 어떤 경우에도 외부로 문자를 보내지 않고, 보내지 않았다고 알린다 */
@Slf4j
@Component
public class DisabledSmsSender implements SmsSender {

    @Override
    public void send(Long companyId, Long groupSendId, String phone, String content, String targetName) {
        log.warn("SMS 발송 연동이 없어 발송하지 않음: companyId={}, groupSendId={}, target={}", companyId, groupSendId, targetName);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "SMS 발송 연동이 아직 없어 문자를 발송하지 않았습니다");
    }
}
