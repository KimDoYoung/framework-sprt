package kr.co.kfs.asseterp.biz.sms;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;

/** DB 시험용 — 회사는 문자발신 서비스를 신청한 것으로 보고, 발송은 늘 실패시킨다(실제·시뮬레이터 발송 없이 "보내지 못하면 상태를 바꾸지 않는다"를 본다) */
@Component
public class RefusingSmsSender implements SmsSender {
    @Override
    public void send(Long companyId, Long groupSendId, String phone, String content, String targetName) {
        throw new BusinessException(ErrorCode.INVALID_INPUT, "시험: 문자 발송 실패");
    }

    @Override
    public boolean companyEnabled(Long companyId) {
        return true;
    }
}
