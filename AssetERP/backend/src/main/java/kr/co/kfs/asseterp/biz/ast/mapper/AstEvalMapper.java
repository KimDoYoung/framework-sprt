package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.EvalItemReq;
import kr.co.kfs.asseterp.biz.ast.dto.EvalRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** W09 금융상품 평가처리 — AS-IS ast06_tr.selectEvalList · updateEval이 부르는 SQL들 */
@Mapper
public interface AstEvalMapper {

    /** ast06_tr.selectEvalList */
    List<EvalRes> selectEvalList(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                 @Param("astClassTreeId") Long astClassTreeId, @Param("keepAccountId") Long keepAccountId,
                                 @Param("corpId") Long corpId, @Param("assetType") String assetType,
                                 @Param("searchText") String searchText, @Param("evalType") String evalType,
                                 @Param("abroType") String abroType);

    int existsTr(@Param("trId") Long trId);

    int insertTr(@Param("r") EvalItemReq r, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("amt") Long amt, @Param("forAmt") Double forAmt, @Param("fxRate") Double fxRate);

    int updateTr(@Param("r") EvalItemReq r, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("amt") Long amt, @Param("forAmt") Double forAmt, @Param("fxRate") Double fxRate);

    long selectNextId();

    int insertFinance(@Param("financeId") long financeId, @Param("r") EvalItemReq r, @Param("price") Double price,
                      @Param("trAmt") Long trAmt, @Param("pl") Long pl, @Param("forTrAmt") Double forTrAmt, @Param("forPl") Double forPl);

    int updateFinance(@Param("financeId") long financeId, @Param("r") EvalItemReq r, @Param("price") Double price,
                      @Param("trAmt") Long trAmt, @Param("pl") Long pl, @Param("forTrAmt") Double forTrAmt, @Param("forPl") Double forPl);

    int countFixedJournalByTrId(@Param("trId") Long trId);

    int countFixedJournalByOrgTrId(@Param("trId") Long trId);

    int deleteJournalDtlByTrId(@Param("trId") Long trId);

    int deleteJournalTmpByTrId(@Param("trId") Long trId);

    int deleteJournalByTrId(@Param("trId") Long trId);

    int deleteBackJournalDtl(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId,
                             @Param("keepAccountId") Long keepAccountId, @Param("date") LocalDate date);

    int deleteBackJournal(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId,
                          @Param("keepAccountId") Long keepAccountId, @Param("date") LocalDate date);

    Long selectBackTrId(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId,
                        @Param("keepAccountId") Long keepAccountId, @Param("date") LocalDate date);

    int deleteFinanceByTrId(@Param("trId") Long trId);

    int deleteTr(@Param("trId") Long trId);

    int deleteBookClose(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId,
                        @Param("keepAccountId") Long keepAccountId, @Param("holdDate") LocalDate holdDate);

    int insertBookClose(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId,
                        @Param("keepAccountId") Long keepAccountId, @Param("holdDate") LocalDate holdDate);

    String createFinanceBook(@Param("procType") String procType, @Param("trId") Long trId);

    String createBackJournal(@Param("trId") Long trId);

    String selectBizDate2(@Param("stdDate") LocalDate stdDate);

    String selectEvalCycle(@Param("companyId") Long companyId);

    LocalDate selectLastDay(@Param("date") LocalDate date);

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") EvalRes r, @Param("pl") long pl);
}
