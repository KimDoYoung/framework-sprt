package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeRes;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpSmsNoticeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/emp/Emp92_SmsNotice.java (selectByPersonId·updateList L34-59) — Emp92_Lookup_SmsNotice (EE63) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpSmsNoticeService {

    private final EmpSmsNoticeMapper mapper;

    /** type: "M" 필수알림(M으로 시작하는 코드) · 그 밖 선택알림 (원본 98d5afdd6 Emp92_TabPage_SmsNotice01·02, CH-0278·0313) */
    public List<SmsNoticeRes> search(UserPrincipal user, String type) {
        return mapper.selectByPersonId(user.getUserId(), type);
    }

    /** AS-IS updateList: 행마다 있으면 updateNoticeYn, 없으면 insert. 사원은 로그인한 사용자 */
    @Transactional
    public void save(UserPrincipal user, List<SmsNoticeSaveReq> rows) {
        for (SmsNoticeSaveReq r : rows) {
            String talk = String.valueOf(Boolean.TRUE.equals(r.talkNoticeYn()));
            String sms = String.valueOf(Boolean.TRUE.equals(r.smsNoticeYn()));
            String mail = String.valueOf(Boolean.TRUE.equals(r.mailNoticeYn()));
            if (mapper.countByCode(user.getUserId(), r.smsNoticeCode()) == 0) {
                mapper.insert(user.getUserId(), r.smsNoticeCode(), talk, sms, mail);
            } else {
                mapper.updateNoticeYn(user.getUserId(), r.smsNoticeCode(), talk, sms, mail);
            }
        }
    }
}
