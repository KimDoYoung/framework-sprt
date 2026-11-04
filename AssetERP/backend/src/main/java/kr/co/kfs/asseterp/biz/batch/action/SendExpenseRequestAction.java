package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.notice.BatchNoticeService;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** AS-IS BatchMain.sendExpenseRequest (L3627) — 승인자별 승인요청 건수를 앱알림·메일·SMS로 알림 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SendExpenseRequestAction implements BatchAction {

    private final BatchNoticeService noticeService;

    @Override
    public String actionCode() {
        return "sendExpenseRequest";
    }

    @Override
    public String run(BatchReq req) {
        log.info("사업비지출 승인요청 (sendExpenseRequest)");
        noticeService.sendExpenseRequest();
        return "사업비지출 승인요청 알림발송 완료..commit";
    }
}
