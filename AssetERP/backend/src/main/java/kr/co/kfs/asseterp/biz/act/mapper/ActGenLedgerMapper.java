package kr.co.kfs.asseterp.biz.act.mapper;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCond;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerRes;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerFssRes;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerReportCond;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerReportRes;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.act.dto.CloseCheckRes;
import kr.co.kfs.asseterp.biz.act.dto.CloseDiffRes;
import kr.co.kfs.asseterp.biz.act.dto.CloseParam;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCloseStatusRes;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;

/** AS-IS Act04_GenLedger 서버(X14 회계마감)가 쓰는 SQL — ActGenLedgerMapper.xml */
@Mapper
public interface ActGenLedgerMapper {

    List<GenLedgerCloseStatusRes> selectCloseStatus(Long companyId, String year);

    CloseCheckRes selectCloseCheck(Long companyId);

    long checkCloseCount(CloseParam p);

    long selectCloseDateCount(CloseParam p);

    LocalDate selectCloseDate(CloseParam p);

    LocalDate selectPreMonthLastDay(LocalDate startDate);

    String setDateInfo(LocalDate startDate, LocalDate closeDate);

    /** DB 함수 f_create_genLedger — "Y" 또는 오류 메시지 */
    String summaryGenLedger(CloseParam p);

    /** DB 함수 f_create_depositBook_close(companyId, stdDate, closeDate) — "Y" 또는 오류 메시지 */
    String createDepositBookClose(CloseParam p);

    List<CloseDiffRes> selectDepositRealDiff(CloseParam p);

    List<CloseDiffRes> selectDepositApprStatus(CloseParam p);

    List<CloseDiffRes> selectBookDiff(CloseParam p);

    List<CloseDiffRes> selectNoEvalFinance(CloseParam p);

    List<CloseDiffRes> selectFinanceBookDiff(CloseParam p);

    List<CloseDiffRes> selectNoFxEval(CloseParam p);

    List<CloseDiffRes> selectNoDepn(CloseParam p);

    List<CloseDiffRes> selectRemDepnCostDiff(CloseParam p);

    List<CloseDiffRes> selectCurrYearOfficeAssetsDiff(CloseParam p);

    List<CloseDiffRes> selectRemDepnCostDiff2(CloseParam p);

    List<CloseDiffRes> selectNoSlipAccount(CloseParam p);

    List<CloseDiffRes> selectNoUseAccount(CloseParam p);

    List<CloseDiffRes> selectNoneAccount(CloseParam p);

    List<CloseDiffRes> selectFeeBookDiff(CloseParam p);

    List<CloseDiffRes> selectFeeBookDiff2(CloseParam p);

    List<CloseDiffRes> selectNoFeeEval(CloseParam p);

    long selectUnFixCount(CloseParam p);

    LocalDate getCompanyCloseDate(Long companyId, String year, String type);

    List<Long> selectAccountNumByStartDate(Long companyId, LocalDate startDate);

    int insertAccountNumNext(Long companyId, long num, LocalDate closeDate);

    Long selectTodayBalAmtByAccountCode(Long companyId, LocalDate stdDate, String accountCode);

    List<String> selectTreeAccountCodes(Long companyId, String accountCode);

    long selectCountByAccountCode(Long companyId, LocalDate stdDate, String accountCode);

    int insertUnApprEarnSurplus(Long companyId, LocalDate stdDate, String accountCode, Long todayDiffAmt);

    int updateUnApprEarnSurplus(Long companyId, LocalDate stdDate, String accountCode, Long todayDiffAmt);

    int insertGenLedgerClose(Long companyId, LocalDate closeDate);

    String insertGenLedgerCloseEicp(Long companyId, LocalDate closeDate);

    int deleteGenLedgerClose(Long companyId, LocalDate closeDate);

    int updateJournalCloseYn(Long companyId, LocalDate closeDate, String closeYn);

    // ---- 계정원장 Act04_Tab_GenLedger (X18)

    /** AS-IS selectByStdDate1 — 월별(1)·분기별(3) */
    List<GenLedgerRes> selectByStdDate1(GenLedgerCond cond);

    /** AS-IS selectByStdDate2 — 일별(2) */
    List<GenLedgerRes> selectByStdDate2(GenLedgerCond cond);

    /** AS-IS selectByAccountCode — 계정과 하위 계정(전위 순서, level) */
    List<GenLedgerRes> selectByAccountCode(GenLedgerCond cond);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS sys99_print.insert — 출력용 계정원장 한 줄 */
    int insertPrintGenLedger(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                             @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") GenLedgerRes r);

    // ---- 재무제표 손익계산서 Act04_Tab_ReportPL (X20) · 재무상태표 X21이 재사용

    /** AS-IS act04_gen_ledger.deleteGenLedgerCloseTmp — 가결산원장 정리 */
    int deleteGenLedgerCloseTmp(@Param("companyId") Long companyId, @Param("closeDate") LocalDate closeDate);

    /** AS-IS act04_gen_ledger.insertGenLedgerCloseTmp — 가결산원장 생성 */
    int insertGenLedgerCloseTmp(@Param("companyId") Long companyId, @Param("closeDate") LocalDate closeDate);

    /** AS-IS act04_gen_ledger.insertGenLedgerCloseTmpEicp — 미처분이익잉여금 반영 */
    String insertGenLedgerCloseTmpEicp(@Param("companyId") Long companyId, @Param("closeDate") LocalDate closeDate);

    /** AS-IS dbConfig.getAccountCloseDate — type -1 전기말 */
    LocalDate selectAccountCloseDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("type") int type);

    /** AS-IS dbConfig.getPreQuarterCloseDate — type '2' 반기 · '1' 분기 */
    LocalDate selectQuarterDate(@Param("stdDate") LocalDate stdDate, @Param("type") String type);

    /** AS-IS act04_gen_ledger.selectBSPL */
    List<GenLedgerReportRes> selectBSPL(GenLedgerReportCond cond);

    /** AS-IS sys99_print.insert — 재무제표 한 줄 */
    int insertPrintReport(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                          @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") GenLedgerReportRes r);

    // ---- 금감원보고용 재무제표 Act04_Tab_ReportFSS (X22)

    /** AS-IS act04_gen_ledger.selectFssBSPL — code GA023 재무상태표 / GA025 손익계산서 */
    List<GenLedgerFssRes> selectFssBSPL(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                                        @Param("checkCnt") Long checkCnt, @Param("code") String code);

    /** AS-IS sys99_print.insert — 금감원 재무제표 한 줄 */
    int insertPrintFss(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                       @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") GenLedgerFssRes r);
}
