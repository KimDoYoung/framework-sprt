package kr.co.kfs.asseterp.biz.sms.service;

import java.util.List;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.sms.mapper.SmsGroupSendHistoryMapper;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsHistoryMapper;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.notice.NoticeResult;
import kr.co.kfs.asseterp.common.notice.NoticeSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 문자 발송 — AS-IS SendSMSAPIFunction.sendPromoMessage L139-175(한 명) · sendGroupMessage(단체) → SendSMSAPI.smsSender L167-401 · smsGroupSender L32-165.
 * 번호의 '-'를 빼고 보내며, 성공하면 sms02_history(비고 = 번호) 또는 sms04_group_send_history(대상 번호·이름)에 남긴다.
 * 차이: AS-IS는 발송 실패를 로그로 삼키고 계속했지만, TOBE는 BusinessException으로 알린다(보내지 않은 것을 보냈다고 하지 않도록).
 * 기록은 부른 쪽 트랜잭션 안에서 쓴다(AS-IS는 따로 세션을 열어 바로 커밋).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NoticeSmsSender implements SmsSender {

    private final NoticeSender noticeSender;
    private final NoticeProperties props;
    private final SmsHistoryMapper historyMapper;
    private final SmsGroupSendHistoryMapper groupHistoryMapper;

    @Override
    public void send(Long companyId, Long groupSendId, String phone, String content, String targetName) {
        if (!"sim".equals(props.mode())) {
            log.warn("SMS 발송 안 함(mode={}): companyId={}, groupSendId={}, target={}", props.mode(), companyId, groupSendId, targetName);
            throw new BusinessException(ErrorCode.INVALID_INPUT, "SMS 발송 연동이 꺼져 있어 문자를 발송하지 않았습니다");
        }
        if (phone == null || phone.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "휴대폰 번호가 없어 문자를 발송하지 않았습니다");
        }
        String mobile = phone.replace("-", "");
        NoticeResult r = noticeSender.sendSms(List.of(mobile), content);
        if (!r.ok()) {
            log.warn("SMS 발송 실패: companyId={}, target={}, {}", companyId, targetName, r.message());
            throw new BusinessException(ErrorCode.INVALID_INPUT, "문자 발송에 실패했습니다: " + r.message());
        }
        if (groupSendId != null) {
            groupHistoryMapper.insertHistory(companyId, groupSendId, mobile, targetName, content);
        } else {
            historyMapper.insertHistory(companyId, content, mobile);
        }
    }

    @Override
    public boolean companyEnabled(Long companyId) {
        return props.smsEnabled(historyMapper.selectCompanyLoc(companyId));
    }
}
