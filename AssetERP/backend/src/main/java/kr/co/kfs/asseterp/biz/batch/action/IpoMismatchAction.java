package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.ipo.BatchIpoService;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** AS-IS BatchMain.ipoMismatch (L693) — 공모주 일정 미일치내역 생성(DB 함수 f_create_ipoMismatch) */
@Slf4j
@Component
@RequiredArgsConstructor
public class IpoMismatchAction implements BatchAction {

    private final BatchIpoService ipoService;

    @Override
    public String actionCode() {
        return "ipoMismatch";
    }

    @Override
    public String run(BatchReq req) {
        log.info("공모주일정 미일치내역 생성 시작 (ipoMismatch)");
        ipoService.createMismatch();
        return "공모주일정 미일치내역 생성 완료.. commit";
    }
}
