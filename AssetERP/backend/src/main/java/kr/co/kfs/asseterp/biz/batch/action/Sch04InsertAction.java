package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchSchMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchDates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * AS-IS BatchMain.sch04Insert (L87) — 당일 미처리 스케줄(sch04_list) 생성.
 * stdDate가 없으면 직전 영업일(f_get_biz_date(0, 오늘, '-1')), 있으면 그 날짜. 사용 중인 회사마다 insert하고 한 트랜잭션으로 끝낸다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class Sch04InsertAction implements BatchAction {

    private final BatchCommonMapper commonMapper;
    private final BatchSchMapper schMapper;

    @Override
    public String actionCode() {
        return "sch04Insert";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("당일 미처리건 생성 시작 (sch04Insert) stdDate={}", req.stdDate());

        LocalDate stdDate = BatchDates.isBlank(req.stdDate())
                ? commonMapper.selectBizDate(0L, LocalDate.now(), "-1")
                : BatchDates.parseOrNull(req.stdDate());
        log.info("기준일: {}", stdDate);

        for (BatchCompany company : commonMapper.selectUseCompanies()) {
            log.info("회사: {}", company.companyName());
            schMapper.insertSch04List(company.companyId(), stdDate);
        }
        return "미처리 스케줄 Sch04에 Insert 작업완료.. commit";
    }
}
