package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.AstClassCodeRes;
import kr.co.kfs.asseterp.biz.ast.dto.Tr4InsureLedgerRes;
import kr.co.kfs.asseterp.biz.ast.dto.Tr4InsureSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrTaxLedgerRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrTaxSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast06_tr.xml · ast20_tr_tax.xml · ast21_tr_4insure.xml — 세금/4대보험 등록 U04 */
@Mapper
public interface AstTrMapper {

    /** ast06_tr.selectTaxTr */
    List<TrRes> selectTaxTr(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                            @Param("closeDate") LocalDate closeDate, @Param("trCode") String trCode);

    /** ast06_tr.selectById — 화면이 읽는 열만(selectTaxTr와 같은 열 목록), 창 조건 없이 한 건 */
    TrRes selectById(@Param("companyId") Long companyId, @Param("trId") Long trId);

    long selectNextId();

    /** ast06_tr 새 행 / 고친 행 (화면이 바꾸는 열만) */
    int insertTr(@Param("trId") long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("date") LocalDate date, @Param("trCode") String trCode, @Param("amt") Long amt,
                 @Param("contAmt") Long contAmt, @Param("settleMngYn") boolean settleMngYn, @Param("note") String note,
                 @Param("depositId") Long depositId, @Param("astClassTreeId") Long astClassTreeId);

    int updateTr(@Param("companyId") Long companyId, @Param("trId") Long trId, @Param("amt") Long amt,
                 @Param("contAmt") Long contAmt, @Param("settleMngYn") boolean settleMngYn, @Param("note") String note,
                 @Param("depositId") Long depositId);

    /** ast20_tr_tax 존재 여부(trTaxId) / 새 행 / 고침 */
    Long selectTaxId(@Param("trId") Long trId);

    int insertTax(@Param("taxId") long taxId, @Param("trId") Long trId, @Param("r") TrTaxSaveReq r);

    int updateTax(@Param("taxId") Long taxId, @Param("r") TrTaxSaveReq r);

    Long select4InsureId(@Param("trId") Long trId);

    int insert4Insure(@Param("insureId") long insureId, @Param("trId") Long trId, @Param("r") Tr4InsureSaveReq r);

    int update4Insure(@Param("insureId") Long insureId, @Param("r") Tr4InsureSaveReq r);

    /** ast06_tr.updateApprId */
    int updateApprId(@Param("companyId") Long companyId, @Param("trId") Long trId, @Param("apprId") Long apprId);

    /** ast20_tr_tax.selectGenLedgerTax */
    TrTaxLedgerRes selectGenLedgerTax(@Param("companyId") Long companyId, @Param("date") LocalDate date, @Param("trCode") String trCode);

    /** ast21_tr_4insure.selectGenLedgerInsure */
    Tr4InsureLedgerRes selectGenLedgerInsure(@Param("companyId") Long companyId, @Param("date") LocalDate date);

    // ---- 삭제 (ast.Ast06_Tr.delete) ----
    Long selectAstClassTreeId(@Param("companyId") Long companyId, @Param("trId") Long trId);

    AstClassCodeRes selectClassCodes(@Param("astClassTreeId") Long astClassTreeId);

    /** ast09_book.createDepnBook — 'Y'면 정상 */
    String createDepnBook(@Param("procType") String procType, @Param("trId") Long trId);

    int deleteTaxByTrId(@Param("trId") Long trId);

    int delete4InsureByTrId(@Param("trId") Long trId);

    int countFixedJournalByTrId(@Param("trId") Long trId);

    int deleteJournalTmpByTrId(@Param("trId") Long trId);

    int deleteJournalDtlByTrId(@Param("trId") Long trId);

    int deleteJournalByTrId(@Param("trId") Long trId);

    int deleteRelateApprByTrId(@Param("trId") Long trId);

    int deleteSettleByTrId(@Param("trId") Long trId);

    int deleteTr(@Param("companyId") Long companyId, @Param("trId") Long trId);
}
