package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchComItem;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamPrice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** ICAM 종목시세(icam20)와 공통 종목정보(com50) 반영용 SQL (ICAM 읽기는 IcamReader) */
@Mapper
public interface BatchPriceMapper {

    /** AS-IS icam20_price.delete — 그 날 시세 전부 */
    int deletePrices(@Param("stdDate") LocalDate stdDate);

    /** AS-IS icam20_price.insert */
    int insertPrice(@Param("p") BatchIcamPrice price);

    /** AS-IS com50_item.selectByItemCode */
    List<BatchComItem> selectItems(@Param("itemCode") String itemCode, @Param("itemType") String itemType);

    /** AS-IS com50_item.insert */
    int insertItem(@Param("p") BatchComItem item);

    /** AS-IS com50_item.updateItemName */
    int updateItemName(@Param("itemCode") String itemCode, @Param("itemType") String itemType, @Param("itemName") String itemName);
}
