package kr.co.kfs.asseterp.biz.batch.notice;

import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.batch.dto.BatchAlarmRecord;
import kr.co.kfs.asseterp.biz.batch.dto.BatchCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchExpenseRequest;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticeCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticePerson;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper.AltAppr;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 알림 배치 3종 (AS-IS BatchMain.alarm·sendFlt10Report·sendExpenseRequest).
 * 누구에게 무엇을 보낼지는 DB를 읽어 정하고(plan), 실제 발송은 AA01과 같이 커밋된 뒤 NoticeSender로 한다
 * (AS-IS는 반복 중에 바로 보내 나중에 롤백돼도 이미 간 알림은 돌이킬 수 없었다 — 여기서는 롤백이면 가지 않는다).
 * 앱알림은 수신 차단 설정(emp92_sms_notice)을, 메일·SMS는 회사별 발송 설정(asseterp.notice.mail-companies·sms-companies)을 함께 본다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BatchNoticeService {

    private static final String NOTICE_B01 = "B01";   // 임직원매매 사전신청건 확인
    private static final String NOTICE_B02 = "B02";   // 사업비지출 승인요청건 확인

    private final BatchNoticeMapper mapper;
    private final BatchCommonMapper commonMapper;
    private final AprNoticeMapper aprNoticeMapper;
    private final NoticeProperties props;
    private final AprNoticeService noticeSender;

    /** 알람 메세지 전송 (actionCode=alarm) */
    @Transactional
    public void alarm() {
        for (BatchCompany company : commonMapper.selectUseCompanies()) {
            // 알람 예정내역 생성
            int cnt = mapper.insertAlarmTarget(company.companyId());
            log.info("{} : {}건", company.companyName(), cnt);
        }

        List<AprNoticeCall> calls = new ArrayList<>();
        for (BatchAlarmRecord alarm : mapper.selectPendingAlarms("1")) {
            String loc = mapper.selectCompanyLoc(alarm.companyId());
            BatchNoticePerson person = mapper.selectPerson(alarm.personId());
            String email = person.emailAddress();

            if (email != null) {
                calls.add(new AprNoticeCall("talk", email, "알림", alarm.alarmMessage()));
            }
            if (props.mailEnabled(loc) && email != null) {
                // 보낸 곳·보낸 시각 기록 (AS-IS SendMailMaster.sendAlarmMessage) — 메일을 보내는 경우에만 남는다
                mapper.updateAlarmSendInfo(alarm.alarmRecordId(), email);
                calls.add(new AprNoticeCall("mail", email, "[알림] Asset-ERP", alarm.alarmMessage()));
            }
        }
        noticeSender.dispatchAfterCommit(calls);
    }

    /** 임직원매매 사전신고 승인신청 알림발송 (actionCode=sendFlt10Report) */
    @Transactional
    public void sendFlt10Report() {
        List<AprNoticeCall> calls = new ArrayList<>();
        for (BatchNoticeCompany company : mapper.selectNoticeCompanies()) {
            int pending = mapper.countFlt10Pending(company.companyId());
            if (pending == 0) {
                continue;
            }
            String loc = company.locName();
            for (BatchNoticePerson target : mapper.selectSmsNoticeTargets(company.companyId(), NOTICE_B01)) {
                // 오늘 유효한 대결자가 있으면 그 사람 연락처로 보낸다
                List<AltAppr> alts = mapper.selectTodayAltAppr(target.personId());
                BatchNoticePerson to = alts.isEmpty()
                        ? target
                        : new BatchNoticePerson(alts.get(0).targetEmpId(), alts.get(0).mobileTelNo(), alts.get(0).emailAddress(), alts.get(0).hasPassword());

                String msg = "[Asset-ERP] 임직원 매매 사전 승인신청 " + pending + "건이 존재합니다." + "\r\n\r\n https://" + loc + ".k-fs.co.kr:5151/";
                plan(calls, to, loc, NOTICE_B01, "임직원매매 사전신청건 확인", "임직원 매매 사전 승인신청 " + pending + "건이 존재합니다.", msg);
            }
        }
        noticeSender.dispatchAfterCommit(calls);
    }

    /** 사업비지출 승인요청 알림발송 (actionCode=sendExpenseRequest) */
    @Transactional
    public void sendExpenseRequest() {
        List<AprNoticeCall> calls = new ArrayList<>();
        for (BatchNoticeCompany company : mapper.selectNoticeCompanies()) {
            String loc = company.locName();
            for (BatchExpenseRequest request : mapper.selectExpenseRequests(company.companyId())) {
                // 승인자 정보 — 없으면 AS-IS처럼 NullPointerException
                BatchNoticePerson confirmer = mapper.selectPerson(request.confirmerId());
                BatchNoticePerson to = new BatchNoticePerson(confirmer.personId(), confirmer.mobileTelNo(), confirmer.emailAddress(), confirmer.hasPassword());

                String body = "사업비지출 승인요청 " + request.requestCnt() + "건이 존재합니다";
                plan(calls, to, loc, NOTICE_B02, "사업비지출 승인요청건 확인", body, "[Asset-ERP] " + body);
            }
        }
        noticeSender.dispatchAfterCommit(calls);
    }

    /**
     * 한 사람에게 갈 알림 — 앱알림(이메일 있음 + 수신 차단 아님) · 메일(회사 메일 발송 + 메일 암호 있음 + 차단 아님 — AS-IS는 이메일이 아니라
     * 암호 유무를 본다) · SMS(회사 SMS 발송 + 번호 있음 + 차단 아님). 이메일이 비어 있으면 메일은 보낼 곳이 없어 건너뛴다(AS-IS는 오류).
     */
    private void plan(List<AprNoticeCall> out, BatchNoticePerson to, String loc, String noticeCode, String talkTitle, String talkBody, String msg) {
        if (to.emailAddress() != null && aprNoticeMapper.countTalkBlocked(to.personId(), noticeCode) == 0) {
            out.add(new AprNoticeCall("talk", to.emailAddress(), talkTitle, talkBody));
        }
        if (props.mailEnabled(loc) && to.hasPassword() && aprNoticeMapper.countMailBlocked(to.personId(), noticeCode) == 0) {
            if (to.emailAddress() != null) {
                out.add(new AprNoticeCall("mail", to.emailAddress(), "[알림] Asset-ERP 전자결재", msg));
            } else {
                log.warn("메일 주소가 없어 메일을 건너뜀: personId={}", to.personId());
            }
        }
        if (props.smsEnabled(loc) && to.mobileTelNo() != null && aprNoticeMapper.countSmsBlocked(to.personId(), noticeCode) == 0) {
            out.add(new AprNoticeCall("sms", to.mobileTelNo().replace("-", ""), "[Asset-ERP 알림]", msg));
        }
    }
}
