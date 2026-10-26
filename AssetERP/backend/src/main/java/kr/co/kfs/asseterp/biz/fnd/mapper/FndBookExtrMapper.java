package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.BookExtrRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookExtrSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface FndBookExtrMapper {

    /** AS-IS fnd11_book_extr.selectByStdDate */
    List<BookExtrRes> selectByStdDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText);

    /** AS-IS fnd11_book_extr.selectRecentStdDate (없으면 null) */
    String selectRecentStdDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS fnd11_book_extr.selectById (UpdateDataModel이 저장 뒤 읽는 행) */
    BookExtrRes selectById(@Param("bookExtrId") Long bookExtrId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    int insertBookExtr(@Param("bookExtrId") Long bookExtrId, @Param("companyId") Long companyId, @Param("req") BookExtrSaveReq req);

    int updateBookExtr(@Param("companyId") Long companyId, @Param("req") BookExtrSaveReq req);

    int deleteBookExtrs(@Param("companyId") Long companyId, @Param("bookExtrIds") List<Long> bookExtrIds);

    /** AS-IS fnd11_book_extr.excelInsert (id는 f_create_seq()) */
    int excelInsert(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("fundCode") String fundCode,
                    @Param("fundName") String fundName, @Param("itemCode") String itemCode, @Param("itemName") String itemName,
                    @Param("itemType") String itemType);
}
