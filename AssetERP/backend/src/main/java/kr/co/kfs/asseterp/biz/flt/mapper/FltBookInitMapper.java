package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.BookInitRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/flt/mapper/flt13_book_init.xml (selectByPersonId, getInitDate, excelInsert) · flt10_tr.xml (countByTrDate, insertFloorTrBook) · flt11_book.xml (deleteByItemName, insertByFlt13)
 *  · flt14_relate_appr.xml (checkAppr) · sys12_calendar.xml (selectByDay) + UpdateDataModel(flt13_book_init) 저장·삭제 (EE46) */
@Mapper
public interface FltBookInitMapper {
    Long selectNextId();

    /** AS-IS flt13_book_init.selectByPersonId (searchText는 `%검색어%`) */
    List<BookInitRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("searchText") String searchText);

    BookInitRes selectById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bookInitId") Long bookInitId);

    /** AS-IS flt13_book_init.getInitDate — 가장 늦은 잔고기준일, 없으면 null */
    LocalDate selectInitDate(@Param("companyId") Long companyId, @Param("personId") Long personId);

    int insert(@Param("id") Long id, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") kr.co.kfs.asseterp.biz.flt.dto.BookInitSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") kr.co.kfs.asseterp.biz.flt.dto.BookInitSaveReq req);

    int deleteByIds(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    /** AS-IS flt13_book_init.excelInsert */
    int insertExcel(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountId") Long accountId,
                    @Param("itemName") String itemName, @Param("itemType") String itemType, @Param("bookDate") LocalDate bookDate,
                    @Param("bookAmt") Long bookAmt, @Param("bookQty") Double bookQty, @Param("itemCode") String itemCode);

    /** AS-IS sys12_calendar.selectByDay 의 첫 행 영업일여부('true'/'false'), 행이 없으면 null */
    String selectWorkingYn(@Param("stdDate") LocalDate stdDate);

    /** AS-IS flt10_tr.countByTrDate */
    int countTrByDate(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS flt14_relate_appr.checkAppr */
    int countRelateAppr(@Param("personId") Long personId);

    /** AS-IS flt11_book.deleteByItemName */
    int deleteBookByItem(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountId") Long accountId,
                         @Param("itemType") String itemType, @Param("stkPriceYn") String stkPriceYn, @Param("itemCode") String itemCode, @Param("itemName") String itemName);

    /** AS-IS flt11_book.insertByFlt13 */
    int insertBookByFlt13(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountId") Long accountId,
                          @Param("itemType") String itemType, @Param("itemCode") String itemCode, @Param("itemName") String itemName);

    /** AS-IS flt10_tr.insertFloorTrBook (함수 f_insert_floorTrBook, 계좌·종목 지정) → 'Y' 또는 오류 메시지 */
    String insertFloorTrBook(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountIdStr") String accountIdStr,
                             @Param("itemType") String itemType, @Param("itemName") String itemName, @Param("itemCode") String itemCode, @Param("startDate") LocalDate startDate);
}
