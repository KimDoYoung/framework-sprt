package kr.co.kfs.asseterp.biz.act.mapper;

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
}
