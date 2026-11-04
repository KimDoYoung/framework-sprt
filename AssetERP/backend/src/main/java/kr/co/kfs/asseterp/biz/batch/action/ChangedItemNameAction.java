package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamPrice;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchItemNameMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS BatchMain.changedItemName (L2913) — 직전 영업일(오늘 기준 -1, 확인 포함)의 주식시세 중 종목명이
 * 다른 날 시세와 달라진 종목을 찾아, 그 종목명으로 다른 날 시세(icam20)와 임직원매매 거래·보유원장
 * (flt10·flt11·flt12·flt13)의 종목명을 일괄 고친다. 한 트랜잭션, 실패 시 원인 문구만(AS-IS).
 * icamPrice(SB20)가 같은 날 먼저 돌아야 의미가 있다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ChangedItemNameAction implements BatchAction {

    private final BatchCommonMapper commonMapper;
    private final BatchItemNameMapper itemNameMapper;

    @Override
    public String actionCode() {
        return "changedItemName";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("종목명 변경 시작 (changedItemName) worker={}", req.worker());

        LocalDate stdDate = commonMapper.selectBizDate2(0L, LocalDate.now(), "-1", "true");
        if (stdDate == null) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "기준일(직전 영업일)을 구할 수 없습니다.");
        }
        try {
            // 한글명 변경 종목코드
            List<BatchIcamPrice> targets = itemNameMapper.selectChangedItemName(stdDate);
            for (BatchIcamPrice t : targets) {
                // 1. 시세
                itemNameMapper.updatePriceItemName(t.itemType(), t.isin(), t.stdDate(), t.itemName());
                // 2. 임직원매매 거래
                itemNameMapper.updateFlt10ItemName(t.isin(), t.itemName());
                itemNameMapper.updateFlt10TrItemName(t.isin(), t.itemName());
                // 3. 임직원매매 보유원장
                itemNameMapper.updateFlt11ItemName(t.isin(), t.itemName());
                itemNameMapper.updateFlt12ItemName(t.isin(), t.itemName());
                itemNameMapper.updateFlt13ItemName(t.isin(), t.itemName());
            }
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage());
        }
        return "종목명 변경 작업완료..commit";
    }
}
