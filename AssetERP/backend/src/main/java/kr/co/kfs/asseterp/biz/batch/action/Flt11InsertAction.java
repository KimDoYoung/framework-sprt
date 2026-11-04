package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFltMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * AS-IS BatchMain.flt11Insert (L278) — 자기매매 보유원장(flt11_book) 이월.
 * 사용 중인 회사마다 오늘 이후 원장을 지우고, 직전 영업일 원장 중 수량이 남은 것을 오늘 날짜로 복사한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class Flt11InsertAction implements BatchAction {

    private final BatchCommonMapper commonMapper;
    private final BatchFltMapper fltMapper;

    @Override
    public String actionCode() {
        return "flt11Insert";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("자기매매 보유원장 이월 시작 (flt11Insert)");

        for (BatchCompany company : commonMapper.selectUseCompanies()) {
            log.info("회사: {}", company.companyName());
            fltMapper.deleteFlt11FromToday(company.companyId());   // 생성전 원장정리
            fltMapper.insertFlt11Carry(company.companyId());       // 원장생성
        }
        return "자기매매 보유원장 이월 작업완료.. commit";
    }
}
