package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.PriceRes;
import kr.co.kfs.asseterp.biz.ast.dto.PrcRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 시세입력 Ast25_Lookup_Price (W09) — AS-IS ast25_price.selectHoldItem · selectByItemCode · upsert */
@Mapper
public interface AstPriceMapper {

    List<PriceRes> selectHoldItem(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate, @Param("abroType") String abroType,
                                  @Param("itemType") String itemType, @Param("searchText") String searchText);

    long selectNextId();

    Long selectPriceId(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("itemType") String itemType, @Param("itemCode") String itemCode);

    int upsert(@Param("priceId") long priceId, @Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("itemType") String itemType,
               @Param("itemCode") String itemCode, @Param("itemName") String itemName, @Param("evalPrice") Double evalPrice, @Param("note") String note);

    int updateEvalPrice(@Param("priceId") long priceId, @Param("evalPrice") Double evalPrice);

    /** ast25_price.selectByStdDatePaging (+Total) — W10 */
    List<PrcRes> selectByStdDatePaging(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                       @Param("itemType") String itemType, @Param("searchText") String searchText, @Param("holdYn") boolean holdYn,
                                       @Param("limit") int limit, @Param("offset") int offset);

    long selectByStdDatePagingTotal(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                    @Param("itemType") String itemType, @Param("searchText") String searchText, @Param("holdYn") boolean holdYn);

    long checkItemCode(@Param("priceId") long priceId, @Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                       @Param("itemType") String itemType, @Param("itemCode") String itemCode);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
