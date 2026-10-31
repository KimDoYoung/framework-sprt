package kr.co.kfs.asseterp.biz.sms.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.SmsSendTargetRes;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsSendListMapper;
import kr.co.kfs.asseterp.common.notice.NoticeResult;
import kr.co.kfs.asseterp.common.notice.NoticeSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 문자 발송 창 (AS-IS client/vi/sms/Sms03_Lookup_SendList · server/sms/Sms03_GroupSend.sendMessageList, V04) */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SmsSendListService {

    private final SmsSendListMapper mapper;
    private final NoticeSender sender;

    /** AS-IS emp.Emp00_TransInfo.selectByList — 목록이 비면 아무도 없다(AS-IS는 IN (NULL)) */
    public List<SmsSendTargetRes> search(UserPrincipal user, List<Long> personIds) {
        if (personIds == null || personIds.isEmpty()) {
            return List.of();
        }
        return mapper.selectByList(user.getCompanyId(), personIds);
    }

    /**
     * AS-IS sendMessageList L129-152: 목록의 행마다 "[Asset-ERP] " + 글을 그 사원의 휴대폰으로 보낸다(같은 사원이 두 행이면 두 번).
     * 휴대폰 번호가 없는 사원은 건너뛴다(AS-IS는 NullPointerException으로 서버 오류) — 원본 이상한점 #26. 실제 발송은 {@link NoticeSender}가 한다
     */
    public void send(UserPrincipal user, List<Long> personIds, String message) {
        if (personIds == null) {
            return;
        }
        for (Long personId : personIds) {
            String mobile = mapper.selectMobile(user.getCompanyId(), personId);
            if (mobile == null || mobile.isBlank()) {
                log.warn("문자 발송 건너뜀 — 휴대폰 번호 없음 personId={}", personId);
                continue;
            }
            NoticeResult r = sender.sendSms(List.of(mobile), "[Asset-ERP] " + (message == null ? "" : message));
            if (!r.ok()) {
                log.warn("SMS전송실패 personId={}: {}", personId, r.message());
            }
        }
    }
}
