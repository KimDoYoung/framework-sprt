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
 * AS-IS BatchMain.sch09Insert (L140) — 업무일정(스케줄) 반복일정 sch09 생성.
 * stdDate가 없으면 오늘. 사용 중인 회사마다 sch03_deadline.createSch09(DB 함수 f_create_schDeadlineDay 호출)를 실행한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class Sch09InsertAction implements BatchAction {

    private final BatchCommonMapper commonMapper;
    private final BatchSchMapper schMapper;

    @Override
    public String actionCode() {
        return "sch09Insert";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("업무일정(스케줄) 반복일정 생성 시작 (sch09Insert) stdDate={}", req.stdDate());

        LocalDate stdDate = BatchDates.isBlank(req.stdDate()) ? LocalDate.now() : BatchDates.parseOrNull(req.stdDate());
        log.info("기준일: {}", stdDate);

        for (BatchCompany company : commonMapper.selectUseCompanies()) {
            log.info("회사: {}", company.companyName());
            String resultMsg = schMapper.createSch09(company.companyId(), stdDate);
            if ("Y".equals(resultMsg)) {
                log.error("createSch09 Err !!! {}", resultMsg);
            }
        }
        return "업무일정(스케줄) 반복일정 Sch09에 Insert 작업완료.. commit";
    }
}
