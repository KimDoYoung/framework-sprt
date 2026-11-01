package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.FinanceOprPrintRow;
import kr.co.kfs.asseterp.biz.ast.dto.FinanceOprRes;
import kr.co.kfs.asseterp.biz.ast.dto.FinanceOprTrRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestAssetLimitRes;
import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalMaxRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS ast09_book.selectInvestAssetLimit·selectFinanceByHoldDate, ast06_tr.selectByAstClassTreeId, ast40_owner_capital.selectByMaxDate + sys99_print — 금융상품 운용내역(W15) */
@Mapper
public interface AstFinanceOprMapper {

    /** ast40_owner_capital.selectByMaxDate — 없으면 null */
    OwnerCapitalMaxRes selectOwnerCapitalMax(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** ast09_book.selectInvestAssetLimit */
    List<InvestAssetLimitRes> selectInvestAssetLimit(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate);

    /** ast09_book.selectFinanceByHoldDate (sortType 1) */
    List<FinanceOprRes> selectFinanceByHoldDate(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                                @Param("searchText") String searchText, @Param("investAssetType") String investAssetType,
                                                @Param("holdYn") boolean holdYn, @Param("periodType") String periodType,
                                                @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** ast06_tr.selectByAstClassTreeId — trType 1 매수 / 2 매도 */
    List<FinanceOprTrRes> selectTrsByAstClassTreeId(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                                                    @Param("astClassTreeId") Long astClassTreeId, @Param("keepAccountId") Long keepAccountId,
                                                    @Param("trType") String trType);

    /** sys99_print.insert (insertRdFinanceBookOpr1이 채우는 열) */
    int insertPrintLimit(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                         @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("b") InvestAssetLimitRes b);

    /** sys99_print.insert (insertRdFinanceBookOpr2가 채우는 열) */
    int insertPrintOpr(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                       @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") FinanceOprPrintRow r);
}
