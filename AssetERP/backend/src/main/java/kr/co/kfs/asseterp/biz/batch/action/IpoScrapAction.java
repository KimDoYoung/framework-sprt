package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.ipo.BatchIpoService;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * AS-IS BatchMain.ipoScrap (L629) — 119서버가 IPOStock에서 수집해 보낸 공모주 일정(data)을 sch13에 저장하고,
 * 이어서 미일치내역을 만든다. 저장과 미일치 생성은 AS-IS처럼 따로 commit한다(미일치 생성이 실패해도 저장분은 남는다).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IpoScrapAction implements BatchAction {

    private final BatchIpoService ipoService;

    @Override
    public String actionCode() {
        return "ipoScrap";
    }

    @Override
    public String run(BatchReq req) {
        log.info("IPO Stock 공모주일정 스크래핑 시작 (ipoScrap)");
        ipoService.saveIpoStock(req.data());
        ipoService.createMismatch();
        return "IPO Stock 공모주일정 스크래핑 작업 완료.. commit";
    }
}
