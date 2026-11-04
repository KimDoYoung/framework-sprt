package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamPriceStockRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 공용 시세 종목 찾기 (AS-IS server/icam/mapper/icam20_price.xml) — EE99 Flt10_Lookup_ItemStk */
@Mapper
public interface IcamPriceMapper {

    /** AS-IS icam20_price.selectByStdDatePaging */
    List<IcamPriceStockRes> selectByStdDatePaging(@Param("stdDate") String stdDate, @Param("itemType") String itemType,
                                                  @Param("searchText") String searchText, @Param("limit") int limit, @Param("offset") int offset);

    /** AS-IS icam20_price.selectByStdDatePagingTotal */
    long selectByStdDatePagingTotal(@Param("stdDate") String stdDate, @Param("itemType") String itemType, @Param("searchText") String searchText);

    /** Flt10_Lookup_ItemStk.open(date) L56-79: 오늘 이후면 전영업일(sys.Sys12_Calendar.selectBizDate2, 회사 0, type -1, chkYn true) */
    String selectStdDate(@Param("date") String date);
}
