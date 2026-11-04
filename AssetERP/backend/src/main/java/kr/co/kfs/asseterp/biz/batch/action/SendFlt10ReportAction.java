package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.notice.BatchNoticeService;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** AS-IS BatchMain.sendFlt10Report (L3485) — 사전신청건이 있는 회사의 수신 대상자에게 앱알림·메일·SMS */
@Slf4j
@Component
@RequiredArgsConstructor
public class SendFlt10ReportAction implements BatchAction {

    private final BatchNoticeService noticeService;

    @Override
    public String actionCode() {
        return "sendFlt10Report";
    }

    @Override
    public String run(BatchReq req) {
        log.info("임직원매매 사전신고 승인신청 알림발송 (sendFlt10Report)");
        noticeService.sendFlt10Report();
        return "임직원매매 사전신고 승인신청 알림발송 완료..commit";
    }
}
