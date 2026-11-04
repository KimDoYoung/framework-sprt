package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.ipo.BatchIpoService;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.ParseException;

/**
 * AS-IS BatchMain.ipo38Scrap (L348) — 119서버가 공모주38에서 수집해 보낸 공모주 일정(data)을 sch13에 저장하고,
 * 이어서 공모주 일정(sch10_ipo)을 등록·갱신한다(upsertSch10). 저장과 갱신은 AS-IS처럼 따로 commit한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class Ipo38ScrapAction implements BatchAction {

    private final BatchIpoService ipoService;

    @Override
    public String actionCode() {
        return "ipo38Scrap";
    }

    @Override
    public String run(BatchReq req) {
        log.info("공모주38 공모주일정 스크래핑 시작 (ipo38Scrap)");
        ipoService.saveIpo38(req.data());
        try {
            ipoService.upsertSch10();
        } catch (ParseException e) {
            throw new IllegalStateException(e.getMessage(), e);
        }
        return "공모주38 공모주일정 스크래핑 작업 완료.. commit";
    }
}
