package kr.co.kfs.asseterp.biz.sms.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.SmsSendTargetRes;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsSendListMapper;
import kr.co.kfs.asseterp.biz.apr.service.AlertService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/** 문자 발송 창 (AS-IS client/vi/sms/Sms03_Lookup_SendList · server/sms/Sms03_GroupSend.sendMessageList, V04) */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SmsSendListService {

    private final SmsSendListMapper mapper;
    private final AlertService alert;

    /** AS-IS emp.Emp00_TransInfo.selectByList — 목록이 비면 아무도 없다(AS-IS는 IN (NULL)) */
    public List<SmsSendTargetRes> search(UserPrincipal user, List<Long> personIds) {
        if (personIds == null || personIds.isEmpty()) {
            return List.of();
        }
        return mapper.selectByList(user.getCompanyId(), personIds);
    }

    /**
     * AS-IS sendMessageList L124-137(원본 98d5afdd6, CH-0298·0314) — 목록의 행마다 그 사원에게 통합알림(화면이 넘긴 코드: 댓글 T03 · 책무 T05)
     * "[Asset-ERP] " + 글. 앱알림·메일·SMS 중 받을 수 있는 것으로 간다(전엔 문자만, 번호 없으면 NPE — 원본 이상한점 #26은 이것으로 없어짐)
     */
    @Transactional
    public void send(UserPrincipal user, List<Long> personIds, String message, String smsNoticeCode) {
        if (personIds == null) {
            return;
        }
        if (smsNoticeCode == null || smsNoticeCode.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "알림 코드가 없습니다");
        }
        for (Long personId : personIds) {
            alert.alert(smsNoticeCode, personId, user.getCompanyId(), Map.of("content", "[Asset-ERP] " + message));
        }
    }
}
