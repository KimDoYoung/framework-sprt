package kr.co.kfs.asseterp.biz.sms.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.SmsAlarmHistoryRes;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsAlarmHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sms/Sms10_AlarmHistory.java (selectByText) — Sms10_Lookup_AlarmList (EE57) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SmsAlarmHistoryService {

    private final SmsAlarmHistoryMapper mapper;

    /** AS-IS retrieve() L158-188: 검색어가 없으면 '%', 있으면 '%검색어%' */
    public List<SmsAlarmHistoryRes> search(UserPrincipal user, String inOutYn, String searchText, LocalDate startDate, LocalDate closeDate) {
        String out = "out".equals(inOutYn) ? "out" : "in";
        String like = (searchText == null || searchText.isEmpty()) ? "%" : "%" + searchText + "%";
        return mapper.selectByText(user.getUserId(), out, like, startDate, closeDate);
    }
}
