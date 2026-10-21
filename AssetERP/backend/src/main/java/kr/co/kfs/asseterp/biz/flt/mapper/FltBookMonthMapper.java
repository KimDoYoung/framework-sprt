package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.BookMonthRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthTargetRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt12_book_month.xml + flt11_book.updateBookAmt + UpdateDataModel(flt12_book_month) */
@Mapper
public interface FltBookMonthMapper {

    List<BookMonthRes> selectBookMonths(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountId") Long accountId,
                                        @Param("startDate") String startDate, @Param("closeDate") String closeDate,
                                        @Param("searchText") String searchText, @Param("myAccountYn") boolean myAccountYn);

    BookMonthRes selectBookMonthById(@Param("bookMonthId") Long bookMonthId);

    int countBookMonth(@Param("bookMonthId") Long bookMonthId, @Param("companyId") Long companyId, @Param("personId") Long personId);

    int countEmptyBookAmt(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") String startDate,
                          @Param("closeDate") String closeDate, @Param("myAccountYn") boolean myAccountYn);

    List<BookMonthTargetRes> selectInsertBookAmtTarget(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                       @Param("accountId") Long accountId, @Param("startDate") String startDate,
                                                       @Param("closeDate") String closeDate, @Param("searchText") String searchText,
                                                       @Param("type") String type);

    Long selectNextId();

    int insertBookMonth(@Param("bookMonthId") Long bookMonthId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                        @Param("accountId") Long accountId, @Param("itemName") String itemName, @Param("itemType") String itemType,
                        @Param("bookDate") String bookDate, @Param("bookAmt") Long bookAmt, @Param("itemCode") String itemCode);

    int updateBookMonth(@Param("bookMonthId") Long bookMonthId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                        @Param("bookAmt") Long bookAmt);

    int updateBookAmt(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountId") Long accountId,
                      @Param("itemType") String itemType, @Param("itemName") String itemName, @Param("itemCode") String itemCode,
                      @Param("bookDate") String bookDate, @Param("bookAmt") Long bookAmt, @Param("stkPriceYn") String stkPriceYn);
}
