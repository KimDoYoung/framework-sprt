package kr.co.kfs.asseterp.biz.act.mapper;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubCond;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalRealAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlCond;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlListRes;

import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalLineRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalPayMonthRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/act/mapper/act03_journal_dtl.xml — 분개 상세(S18: 급여 전표확인) */
@Mapper
public interface ActJournalDtlMapper {
    /** AS-IS selectPayMonth */
    List<JournalPayMonthRes> selectPayMonth(@Param("companyId") Long companyId, @Param("payDate") LocalDate payDate,
                                            @Param("payType") String payType);

    /** AS-IS selectByAstId — drCrType D(입금)·C(출금) */
    List<JournalDtlRes> selectByAstId(@Param("companyId") Long companyId, @Param("date") LocalDate date,
                                      @Param("astId") Long astId, @Param("drCrType") String drCrType);

    /** AS-IS selectByJournalId (Ast06_Grid_Journal, U04) */
    List<JournalLineRes> selectByJournalId(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    /** AS-IS selectByCompanyId (분개장, X15) */
    List<JournalDtlListRes> selectByCompanyId(JournalDtlCond cond);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS sys99_print.insert — 출력용 선택전표 */
    int insertPrintChecked(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                           @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("journalId") Long journalId);

    /** AS-IS sys99_print.insert — 출력용 분개장 한 줄 */
    int insertPrintJournal(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                           @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") JournalDtlListRes r);

    /** AS-IS selectByAccountCode (계정별원장, X17) */
    List<JournalSubRes> selectByAccountCode(JournalSubCond cond);

    /** AS-IS act02_journal.getAccountCode — 기간 중 분개가 있는 전표용 계정(보고서 계정 기준) */
    List<JournalAccountRes> selectAccountCodes(JournalSubCond cond);

    /** AS-IS act02_journal.getOneAccountCode — 계정과 그 하위 중 전표생성 계정 */
    List<JournalAccountRes> selectOneAccountCodes(JournalSubCond cond);

    /** AS-IS act13_real_account_map.selectByAstClassTreeId */
    JournalRealAccountRes selectRealAccountByClassTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS sys99_print.insert — 출력용 계정별원장 한 줄 */
    int insertPrintJournalSub(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                              @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") JournalSubRes r);
}
