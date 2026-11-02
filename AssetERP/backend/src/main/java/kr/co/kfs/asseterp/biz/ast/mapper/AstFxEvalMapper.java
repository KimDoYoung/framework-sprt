package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.FxEvalItemReq;
import kr.co.kfs.asseterp.biz.ast.dto.FxEvalRes;
import kr.co.kfs.asseterp.biz.ast.dto.FxEvalSearchCond;
import kr.co.kfs.asseterp.biz.ast.dto.FxRateRes;
import kr.co.kfs.asseterp.biz.ast.dto.FxRateSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast06_tr.xml selectFxEvalList 외 · ast24_fx_rate.xml — 외화예금 환평가처리 Ast06_Tab_FxEvalDeposit (X12) */
@Mapper
public interface AstFxEvalMapper {

    /** ast06_tr.selectFxEvalList */
    List<FxEvalRes> selectFxEvalList(@Param("c") FxEvalSearchCond cond);

    /** ast06_tr.checkStdDateAfterFxEval — 기준일 이후 환평가(3700)가 있으면 1 이상 */
    int countFxEvalAfter(@Param("companyId") Long companyId, @Param("astId") Long astId, @Param("stdDate") LocalDate stdDate);

    /** UpdateDataModel(ast06_tr) 동적 INSERT — 평가손익(amt)은 외화잔고×환율−원화잔고 */
    int insertFxTr(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("amt") long amt, @Param("r") FxEvalItemReq r);

    /** act03_journal_dtl.deleteDepositBackJournal / act02_journal.deleteDepositBackJournal — 다음날 반제(3701) 분개 */
    int deleteDepositBackJournalDtl(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId, @Param("date") LocalDate date);

    int deleteDepositBackJournal(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId, @Param("date") LocalDate date);

    /** ast06_tr.selectDepositBackJournal — 다음날 반제 거래ID(없으면 null) */
    Long selectDepositBackTrId(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId, @Param("date") LocalDate date);

    /** ast09_book.checkBook */
    long countBook(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId, @Param("keepAccountId") Long keepAccountId,
                   @Param("holdDate") LocalDate holdDate);

    /** ast09_book.selectTargetBook + ast09_book.insert — 직전 원장을 평가일 원장으로 복사(평가금액 = 장부금액 + 환산손익, 환산손익 = fxPl). 넣은 행 수 */
    int insertBookFromTarget(@Param("companyId") Long companyId, @Param("astClassTreeId") Long astClassTreeId, @Param("keepAccountId") Long keepAccountId,
                             @Param("holdDate") LocalDate holdDate, @Param("fxPl") long fxPl);

    /** ast09_book.updateFxPl */
    int updateFxPl(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate, @Param("astClassTreeId") Long astClassTreeId,
                   @Param("fxPl") long fxPl);

    /** sys99_print.insert — 출력용 한 줄 */
    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") FxEvalRes r);

    // ---- ast24_fx_rate (환율입력 Ast24_Lookup_FxRate)
    List<FxRateRes> selectFxRates(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                                  @Param("fxRateType") String fxRateType, @Param("curCode") String curCode);

    FxRateRes selectFxRateById(@Param("companyId") Long companyId, @Param("fxRateId") Long fxRateId);

    long selectNextId();

    int insertFxRate(@Param("fxRateId") long fxRateId, @Param("companyId") Long companyId, @Param("fxRateType") String fxRateType,
                     @Param("r") FxRateSaveReq.Item r);

    int updateFxRate(@Param("companyId") Long companyId, @Param("r") FxRateSaveReq.Item r);

    int deleteFxRates(@Param("companyId") Long companyId, @Param("fxRateIds") List<Long> fxRateIds);
}
