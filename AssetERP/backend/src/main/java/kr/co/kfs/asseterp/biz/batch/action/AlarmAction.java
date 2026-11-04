package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.notice.BatchNoticeService;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** AS-IS BatchMain.alarm (L190) — 알람 예정내역을 만들고 아직 안 보낸 메일 알람을 앱알림·메일로 보낸다 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AlarmAction implements BatchAction {

    private final BatchNoticeService noticeService;

    @Override
    public String actionCode() {
        return "alarm";
    }

    @Override
    public String run(BatchReq req) {
        log.info("알람 메세지 전송 시작(alarm)");
        noticeService.alarm();
        return "알람 메세지 전송 작업완료.. commit";
    }
}
