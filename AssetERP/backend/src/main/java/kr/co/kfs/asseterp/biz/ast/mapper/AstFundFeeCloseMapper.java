package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseItemReq;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseSearchCond;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeFundSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast30_book_fund_fee.xml 외 — 펀드보수 결산처리 Ast30_Tab_OfficeMngFeeClose (X13) */
@Mapper
public interface AstFundFeeCloseMapper {

    /** ast30_book_fund_fee.selectEvalFundFee */
    List<FundFeeCloseRes> selectEvalFundFee(@Param("c") FundFeeCloseSearchCond cond);

    /** ast30_book_fund_fee.selectByCorpId */
    List<FundFeeFundRes> selectByCorpId(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                        @Param("corpId") Long corpId, @Param("curCode") String curCode,
                                        @Param("searchText") String searchText);

    /** dbConfig.getAccountCloseDate (type 0) — 회계결산일 */
    LocalDate selectAccountCloseDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** dbConfig.getCompanyCloseDate (type 2) — 연결산일 */
    LocalDate selectYearCloseDate(@Param("companyId") Long companyId, @Param("year") String year);

    long selectNextId();

    /** ast06_tr.insert — 펀드보수 미수처리 거래(9910/9920) */
    int insertTr(@Param("trId") long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("r") FundFeeCloseItemReq r, @Param("fxRate") double fxRate, @Param("amt") long amt, @Param("contAmt") long contAmt);

    /** ast30_book_fund_fee.insertBookFundFeeRecovery */
    int insertBookFundFeeRecovery(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate, @Param("curCode") String curCode,
                                  @Param("astClassTreeId") Long astClassTreeId, @Param("corpId") Long corpId);

    /** ast30_book_fund_fee.updateFixFee */
    int updateFixFee(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate, @Param("curCode") String curCode,
                     @Param("astClassTreeId") Long astClassTreeId, @Param("corpId") Long corpId);

    /** ast30_book_fund_fee.insertBookFundFeeClose */
    int insertBookFundFeeClose(@Param("companyId") Long companyId, @Param("trId") long trId, @Param("holdDate") LocalDate holdDate,
                               @Param("curCode") String curCode, @Param("astClassTreeId") Long astClassTreeId, @Param("corpId") Long corpId);

    /** ast30_book_fund_fee.deleteBookFundFeeByTrId · insertBookFundFeeByTrId · deleteBookFundFeeRecoveryByTrId · deleteBookFundFeeCloseByTrId */
    int deleteBookFundFeeByTrId(@Param("trId") Long trId);

    int insertBookFundFeeByTrId(@Param("trId") Long trId);

    int deleteBookFundFeeRecoveryByTrId(@Param("trId") Long trId);

    int deleteBookFundFeeCloseByTrId(@Param("trId") Long trId);

    /** act06_journal_tmp / act03_journal_dtl / act02_journal.deleteBackJournalByOrgTrId · ast06_tr.deleteByOrgTrId — 반제분개·반제거래 */
    int deleteBackJournalTmpByOrgTrId(@Param("trId") Long trId);

    int deleteBackJournalDtlByOrgTrId(@Param("trId") Long trId);

    int deleteBackJournalByOrgTrId(@Param("trId") Long trId);

    int deleteTrByOrgTrId(@Param("trId") Long trId);

    /** icam10_fee.createFundFeeBook2 — 결산일 다음날부터 운용사의 보수원장 정리. "Y"면 성공 */
    String createFundFeeBook2(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("corpId") Long corpId);

    /** icam10_fee.createFundFeeBook — 회사 전체 보수원장 정리(펀드코드 null) */
    String createFundFeeBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** 이 펀드 행이 이미 결산(ast31)에 들어 있는가 */
    int countClosedBook(@Param("companyId") Long companyId, @Param("bookFundFeeId") Long bookFundFeeId);

    /** ast30_book_fund_fee UpdateDataModel — 누적보수·외화 누적보수·적용환율 */
    int updateFundFee(@Param("companyId") Long companyId, @Param("r") FundFeeFundSaveReq.Item r);

    /** sys99_print.insert — 출력용 한 줄(결산여부·결산일자·거래유형·운용사코드·운용사·통화·누적보수(통화)·누적보수·적용환율) */
    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") FundFeeCloseRes r);

    /** sys99_print.insert — 펀드운용보수 결산처리(X35) 출력용 한 줄(결산여부·결산일자·거래유형·누적보수) */
    int insertFundMngPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                           @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") FundFeeCloseRes r);
}
