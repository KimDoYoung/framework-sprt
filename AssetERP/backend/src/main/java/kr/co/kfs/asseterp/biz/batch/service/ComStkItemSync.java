package kr.co.kfs.asseterp.biz.batch.service;

import kr.co.kfs.asseterp.biz.batch.dto.BatchComItem;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamPrice;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchPriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

/**
 * AS-IS BatchMain.insertStkItem (L2847) — 공통 주식종목정보(com50_item) 생성/종목명 변경.
 * icamPrice(SB20)·icamTodayListItem(SB21)가 함께 쓴다. 호출한 쪽의 트랜잭션에 참여한다.
 */
@Component
@RequiredArgsConstructor
public class ComStkItemSync {

    private static final String TYPE_STOCK = "2010";

    private final BatchPriceMapper priceMapper;

    /** 없으면 만들고(표준코드·종목명·구분·단축코드=종목코드), 있으면 종목명이 다를 때만 고친다 */
    public void insertStkItem(BatchIcamPrice stk) {
        List<BatchComItem> items = priceMapper.selectItems(stk.isin(), TYPE_STOCK);
        if (items.isEmpty()) {
            priceMapper.insertItem(new BatchComItem(stk.isin(), stk.itemName(), stk.itemType(), stk.itemCode()));
        } else if (!Objects.equals(stk.itemName(), items.get(0).itemName())) {
            priceMapper.updateItemName(stk.isin(), TYPE_STOCK, stk.itemName());
        }
    }
}
