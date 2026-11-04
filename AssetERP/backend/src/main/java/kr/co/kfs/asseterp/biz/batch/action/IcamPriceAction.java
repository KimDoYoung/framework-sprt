package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchComItem;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamPrice;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchPriceMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
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
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.icamPrice (L2763) + insertStkItem (L2847) — 기준일(기본: 직전 영업일)의 ICAM 종목시세를
 * icam20_price에 넣는다. 그 날 시세를 먼저 모두 지우고 ① 주식시세(2010)를 넣으며 공통 종목정보(com50_item)를
 * 만들거나 종목명을 고치고 ② 사모펀드 기준가(2050)를 넣는다. 한 트랜잭션, 실패 시 원인 문구만(AS-IS).
 * 회사와 무관한 공통 시세다(회사별 반복 없음).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamPriceAction implements BatchAction {

    private static final String Q_STK = "icam20_price.selectIcamStkPrice";
    private static final String Q_FUND = "icam20_price.selectIcamFundPrice";
    private static final String TYPE_STOCK = "2010";
    private static final String TYPE_FUND = "2050";

    private final BatchCommonMapper commonMapper;
    private final BatchPriceMapper priceMapper;
    private final IcamReader icamReader;
    private final BatchNoticeLogService noticeLog;

    @Override
    public String actionCode() {
        return "icamPrice";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 종목시세 가져오기 시작 (icamPrice) worker={}", req.worker());

        LocalDate stdDate;
        if (req.stdDate() == null || req.stdDate().isEmpty()) {
            stdDate = commonMapper.selectBizDate(0L, LocalDate.now(), "-1");
        } else {
            try {
                stdDate = LocalDate.parse(req.stdDate());
            } catch (DateTimeParseException e) {
                // AS-IS는 파싱 실패를 삼키고 null로 format하다 NPE로 서블릿이 죽는다(원본-이상한점 #215)
                throw new BusinessException(ErrorCode.INVALID_INPUT, "stdDate 형식이 맞지 않습니다(yyyy-MM-dd): " + req.stdDate());
            }
        }
        if (stdDate == null) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "기준일(직전 영업일)을 구할 수 없습니다.");
        }

        try {
            Map<String, Object> param = new HashMap<>();
            param.put("stdDate", stdDate.toString());
            param.put("stdDateStr", stdDate.toString());

            // 처리 전 기준일 시세정리
            priceMapper.deletePrices(stdDate);

            List<IcamRow> stk = icamReader.read(IcamServer.ICAM, Q_STK, param);
            List<IcamRow> fund = icamReader.read(IcamServer.ICAM, Q_FUND, param);
            if (stk.isEmpty()) {
                noticeLog.notice(actionCode(), "icamStkList(icam20) size : 0 ", param.toString());
            }
            if (fund.isEmpty()) {
                noticeLog.notice(actionCode(), "icamFundList(icam20) size : 0 ", param.toString());
            }

            // 주식시세 생성
            for (IcamRow r : stk) {
                BatchIcamPrice p = toPrice(r, TYPE_STOCK, req.worker());
                priceMapper.insertPrice(p);
                insertStkItem(p);   // 공통사용 주식종목정보 생성
            }
            // 펀드시세 생성
            for (IcamRow r : fund) {
                priceMapper.insertPrice(toPrice(r, TYPE_FUND, req.worker()));
            }
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage());
        }
        return "시세 작업완료..commit";
    }

    private static BatchIcamPrice toPrice(IcamRow r, String itemType, String worker) {
        return new BatchIcamPrice(r.getDate("icam20_std_date"), itemType, r.getString("icam20_item_cd"), r.getString("icam20_item_nm"),
                r.getString("icam20_koscom_cd"), r.getString("icam20_isin"), r.getString("icam20_ksd_item_cd"),
                r.getDecimal("icam20_close_price"), r.getDecimal("icam20_pre_close_price"), r.getString("icam20_market_type"), worker);
    }

    /** 공통 종목정보: 없으면 만들고(표준코드·종목명·구분·단축코드=코스콤코드), 있으면 종목명이 다를 때만 고친다 */
    private void insertStkItem(BatchIcamPrice stk) {
        List<BatchComItem> items = priceMapper.selectItems(stk.isin(), TYPE_STOCK);
        if (items.isEmpty()) {
            priceMapper.insertItem(new BatchComItem(stk.isin(), stk.itemName(), stk.itemType(), stk.itemCode()));
        } else if (!java.util.Objects.equals(stk.itemName(), items.get(0).itemName())) {
            priceMapper.updateItemName(stk.isin(), TYPE_STOCK, stk.itemName());
        }
    }
}
