package kr.co.kfs.asseterp.biz.batch.notice;

import kr.co.kfs.asseterp.biz.apr.service.AlertService;
import kr.co.kfs.asseterp.biz.batch.dto.BatchAlarmRecord;
import kr.co.kfs.asseterp.biz.batch.dto.BatchCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchExpenseRequest;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticeCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticePerson;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper.AltAppr;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 알림 배치 3종 (AS-IS BatchMain.alarm·sendFlt10Report·sendExpenseRequest).
 * 원본 98d5afdd6(2026-11-11, CH-0319)부터 세 배치 모두 통합알림(AlertService)으로 보낸다 — 코드 T04 스케줄 알림 · B01 매매 사전승인 · B02 사업비.
 * 발송은 커밋된 뒤(롤백이면 안 감). B01·B02는 원본이 건수(숫자)를 글자로 꺼내다 ClassCastException으로 배치가 롤백된다(원본-이상한점 235) —
 * TOBE는 건수를 글자로 바꿔 보낸다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BatchNoticeService {

    private static final String NOTICE_B01 = "B01";   // 임직원매매 사전신청건 확인
    private static final String NOTICE_B02 = "B02";   // 사업비지출 승인요청건 확인

    private final BatchNoticeMapper mapper;
    private final BatchCommonMapper commonMapper;
    private final AlertService alert;

    /** 알람 메세지 전송 (actionCode=alarm) — BatchMain.alarm L177-213 */
    @Transactional
    public void alarm() {
        for (BatchCompany company : commonMapper.selectUseCompanies()) {
            // 알람 예정내역 생성
            int cnt = mapper.insertAlarmTarget(company.companyId());
            log.info("{} : {}건", company.companyName(), cnt);
        }
        // 통합알림 T04 — 메일을 보내면 sch07에 보낸 주소·시각을 남긴다(AlertService)
        for (BatchAlarmRecord a : mapper.selectPendingAlarms("1")) {
            Map<String, Object> p = new HashMap<>();
            p.put("content", a.alarmMessage());
            p.put("alarmRecordId", a.alarmRecordId());
            alert.alert("T04", a.personId(), a.companyId(), p);
        }
    }

    /** 임직원매매 사전신고 승인신청 알림발송 (actionCode=sendFlt10Report) — BatchMain L3150-3184 */
    @Transactional
    public void sendFlt10Report() {
        for (BatchNoticeCompany company : mapper.selectNoticeCompanies()) {
            int pending = mapper.countFlt10Pending(company.companyId());
            if (pending == 0) {
                continue;
            }
            for (BatchNoticePerson target : mapper.selectSmsNoticeTargets(company.companyId(), NOTICE_B01)) {
                // 오늘 유효한 대결자가 있으면 그 사람에게
                List<AltAppr> alts = mapper.selectTodayAltAppr(target.personId());
                Long personId = alts.isEmpty() ? target.personId() : alts.get(0).targetEmpId();
                alert.alert(NOTICE_B01, personId, company.companyId(), Map.of("count", String.valueOf(pending)));
            }
        }
    }

    /** 사업비지출 승인요청 알림발송 (actionCode=sendExpenseRequest) — BatchMain L3197-3223. 회사는 승인자의 회사 */
    @Transactional
    public void sendExpenseRequest() {
        for (BatchNoticeCompany company : mapper.selectNoticeCompanies()) {
            for (BatchExpenseRequest request : mapper.selectExpenseRequests(company.companyId())) {
                alert.alert(NOTICE_B02, request.confirmerId(), null, Map.of("count", String.valueOf(request.requestCnt())));
            }
        }
    }
}
