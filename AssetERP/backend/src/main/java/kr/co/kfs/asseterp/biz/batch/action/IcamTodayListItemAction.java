package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamPrice;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.ComStkItemSync;
import kr.co.kfs.asseterp.biz.icam.reader.IcamReader;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.biz.icam.reader.IcamServer;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.icamTodayListItem (L2874) — 오늘 상장한 ICAM 주식종목(sjm0jj)을 읽어
 * 공통 종목정보(com50_item)를 만들거나 종목명을 고친다. 기준일은 항상 오늘(파라미터 없음).
 * 한 트랜잭션, 실패 시 원인 문구만(AS-IS).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamTodayListItemAction implements BatchAction {

    private static final String Q_ITEM = "icam20_price.selectIcamStkItemByListDate";
    private static final String TYPE_STOCK = "2010";

    private final IcamReader icamReader;
    private final ComStkItemSync stkItemSync;

    @Override
    public String actionCode() {
        return "icamTodayListItem";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        String stdDateStr = LocalDate.now().toString();
        log.info("ICAM 당일 상장 주식종목 가져오기 시작 (icamTodayListItem) stdDate={}", stdDateStr);
        try {
            Map<String, Object> param = new HashMap<>();
            param.put("stdDateStr", stdDateStr);
            List<IcamRow> list = icamReader.read(IcamServer.ICAM, Q_ITEM, param);
            for (IcamRow r : list) {
                stkItemSync.insertStkItem(new BatchIcamPrice(null, TYPE_STOCK, r.getString("icam20_item_cd"),
                        r.getString("icam20_item_nm"), null, r.getString("icam20_isin"), null, null, null, null, req.worker()));
            }
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage(), e);
        }
        return "작업완료..commit";
    }
}
