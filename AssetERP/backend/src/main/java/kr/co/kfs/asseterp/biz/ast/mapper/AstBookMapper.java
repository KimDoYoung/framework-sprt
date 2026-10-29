package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.BookFullRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookPeriodRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookSumRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast09_book.xml — 예금원장(U01) */
@Mapper
public interface AstBookMapper {
    /** selectByHoldDate (astType 1 = 예금) */
    List<BookRes> selectByHoldDate(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                   @Param("astType") String astType, @Param("searchText") String searchText,
                                   @Param("depositIdStr") String depositIdStr);

    /** selectByHoldDate — 예금잔고 기간조회(U02)가 sys99_print에 쌓는 전체 열 */
    List<BookFullRes> selectByHoldDateFull(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                           @Param("astType") String astType, @Param("searchText") String searchText,
                                           @Param("depositIdStr") String depositIdStr);

    /** sys12_calendar.selectPeriod */
    List<LocalDate> selectCalendarDays(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** dbConfig.getBatchSeq */
    long selectBatchId();

    /** dbConfig.getSeq */
    long selectNextId();

    /** sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** sys99_print.insert (selectByHoldDatePeriod가 채우는 열) */
    int insertPrintPeriod(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                          @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("b") BookFullRes b);

    /** selectByHoldDatePeriod */
    List<BookPeriodRes> selectByHoldDatePeriod(@Param("groupId") long groupId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** selectDepositCurGroupSum */
    List<BookSumRes> selectDepositCurGroupSum(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate);

    /** createDepositBook — 'Y'면 정상, 아니면 오류 메시지 */
    String createDepositBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);
}
