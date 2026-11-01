package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.BookFullRes;
import kr.co.kfs.asseterp.biz.ast.dto.FinanceGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookPeriodRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRes;
import kr.co.kfs.asseterp.biz.ast.dto.HoldBookRes;
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
    List<HoldBookRes> selectHoldList(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate, @Param("astType") String astType,
                                     @Param("abroType") String abroType, @Param("searchText") String searchText);

  List<BookFullRes> selectByHoldDateFull(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                           @Param("astType") String astType, @Param("searchText") String searchText,
                                           @Param("depositIdStr") String depositIdStr);

    /** selectByHoldDate (astType 2 금융자산) — Ast09_Tab_FinanceBook(W12)·FinanceForBook(W13, abroType 2). 정렬은 AS-IS 그대로 */
    List<BookFullRes> selectFinanceBook(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                        @Param("astType") String astType, @Param("abroType") String abroType,
                                        @Param("searchText") String searchText);

    /** sys99_print.insert (Sys99_Print.insertRdFinanceBook이 채우는 열) */
    int insertPrintFinance(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                           @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("b") BookFullRes b);

    /** ast09_book.getHoldDate — 종목유형별 합계(상신 A30) */
    List<FinanceGroupRes> selectFinanceGroup(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate);

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

    /** selectByHoldDatePeriod — 금융상품(W14): 쌓은 그룹에서 전체 열을 읽는다 */
    List<BookFullRes> selectFinancePeriod(@Param("groupId") long groupId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** sys99_print.insert (Sys99_Print.insertRdFinanceBookPeriod가 채우는 열) */
    int insertPrintFinancePeriodExcel(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                                      @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("b") BookFullRes b);

    /** selectByHoldDatePeriod */
    List<BookPeriodRes> selectByHoldDatePeriod(@Param("groupId") long groupId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** selectDepositCurGroupSum */
    List<BookSumRes> selectDepositCurGroupSum(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate);

    /** createDepositBook — 'Y'면 정상, 아니면 오류 메시지 */
    String createDepositBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);
}
