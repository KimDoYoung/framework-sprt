package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamPrice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 종목명 변경 일괄 반영용 SQL (AS-IS icam20_price·flt10_tr·flt11_book·flt12_book_month·flt13_book_init의 updateItemName) */
@Mapper
public interface BatchItemNameMapper {

    /** AS-IS icam20_price.selectChangedItemName — 그 날 주식시세 중 다른 날 종목명과 다른 것 */
    List<BatchIcamPrice> selectChangedItemName(@Param("stdDate") LocalDate stdDate);

    /** AS-IS icam20_price.updateItemName — 기준일이 아닌 시세의 종목명 */
    int updatePriceItemName(@Param("itemType") String itemType, @Param("isin") String isin,
                            @Param("stdDate") LocalDate stdDate, @Param("itemName") String itemName);

    /** AS-IS flt10_tr.updateItemName */
    int updateFlt10ItemName(@Param("isin") String isin, @Param("itemName") String itemName);

    /** AS-IS flt10_tr.updateTrItemName */
    int updateFlt10TrItemName(@Param("isin") String isin, @Param("itemName") String itemName);

    /** AS-IS flt11_book.updateItemName */
    int updateFlt11ItemName(@Param("isin") String isin, @Param("itemName") String itemName);

    /** AS-IS flt12_book_month.updateItemName */
    int updateFlt12ItemName(@Param("isin") String isin, @Param("itemName") String itemName);

    /** AS-IS flt13_book_init.updateItemName */
    int updateFlt13ItemName(@Param("isin") String isin, @Param("itemName") String itemName);
}
