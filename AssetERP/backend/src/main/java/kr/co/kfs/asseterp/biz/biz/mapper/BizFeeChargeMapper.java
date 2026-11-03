package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/biz/mapper/biz20_fee_charge · biz21_fee_charge_dtl · biz22_fee_charge_calc · biz29_account(insertNotAccount) 등 — 최저보수 청구 Biz20_Tab_FeeCharge (EE21) */
@Mapper
public interface BizFeeChargeMapper {

    // ── 목록·한 건 ──

    List<BizFeeChargeRes> selectByChargeDate(@Param("companyId") Long companyId, @Param("chargeDate") LocalDate chargeDate,
                                             @Param("searchText") String searchText);

    BizFeeChargeDetailRes selectById(@Param("companyId") Long companyId, @Param("feeChargeId") Long feeChargeId);

    long selectNextId();

    // ── 편집창 ──

    /** biz20_fee_charge.updateCheck — 같은 운용사·청구일자에 다른 행이 몇 개 있는지 */
    int countSameCorp(@Param("companyId") Long companyId, @Param("feeChargeId") Long feeChargeId, @Param("corpId") Long corpId,
                      @Param("chargeDate") LocalDate chargeDate);

    int countById(@Param("companyId") Long companyId, @Param("feeChargeId") Long feeChargeId);

    int insertFeeCharge(@Param("companyId") Long companyId, @Param("r") BizFeeChargeSaveReq r, @Param("targetYn") String targetYn);

    int updateFeeCharge(@Param("companyId") Long companyId, @Param("r") BizFeeChargeSaveReq r, @Param("targetYn") String targetYn);

    // ── 삭제·확정·상신 ──

    int deleteByFeeChargeId(@Param("companyId") Long companyId, @Param("feeChargeId") Long feeChargeId);

    int confirmUpdate(@Param("companyId") Long companyId, @Param("feeChargeId") Long feeChargeId, @Param("fixYn") String fixYn);

    int updateApprId(@Param("companyId") Long companyId, @Param("feeChargeId") Long feeChargeId, @Param("apprId") Long apprId);

    List<BizFeeChargeApprRes> selectHtmlContent(@Param("companyId") Long companyId, @Param("feeChargeId") Long feeChargeId);

    // ── 구간 계산 상세 (Biz22_Lookup_FeeChargeCalc) ──

    List<BizFeeChargeCalc> selectCalcs(@Param("companyId") Long companyId, @Param("contCorpId") Long contCorpId,
                                       @Param("chargeDate") LocalDate chargeDate);

    // ── 자료생성 (Biz20_FeeCharge.createFeeCharge · createCalcTerm) ──

    LocalDate selectQuarterStartDate(@Param("stdDate") LocalDate stdDate, @Param("type") String type);

    List<BizFeeContCorpRow> selectContCorp(@Param("companyId") Long companyId, @Param("contCorpId") Long contCorpId,
                                           @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    List<BizFeeWithCorpRow> selectWithCorps(@Param("contCorpId") Long contCorpId, @Param("calcStartDate") LocalDate calcStartDate,
                                            @Param("calcCloseDate") LocalDate calcCloseDate);

    List<BizFeeChargeRow> selectByCorpId(@Param("companyId") Long companyId, @Param("contCorpId") Long contCorpId,
                                         @Param("corpId") Long corpId, @Param("chargeDate") LocalDate chargeDate);

    int insertNewCharge(@Param("feeChargeId") Long feeChargeId, @Param("companyId") Long companyId, @Param("chargeDate") LocalDate chargeDate,
                        @Param("corpId") Long corpId, @Param("contCorpId") Long contCorpId, @Param("calcStartDate") LocalDate calcStartDate,
                        @Param("calcCloseDate") LocalDate calcCloseDate);

    int deleteDtlByFeeChargeId(@Param("feeChargeId") Long feeChargeId);

    Long selectOccFeeSum(@Param("contCorpId") Long contCorpId, @Param("corpId") Long corpId, @Param("chargeDate") LocalDate chargeDate,
                         @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    int deleteCalcByContCorpId(@Param("contCorpId") Long contCorpId, @Param("chargeDate") LocalDate chargeDate);

    List<LocalDate> selectTermStartDates(@Param("contCorpId") Long contCorpId, @Param("calcStartDate") LocalDate calcStartDate,
                                         @Param("calcCloseDate") LocalDate calcCloseDate);

    int insertCalcTerm(@Param("contCorpId") Long contCorpId, @Param("chargeDate") LocalDate chargeDate,
                       @Param("termStartDate") LocalDate termStartDate, @Param("termCloseDate") LocalDate termCloseDate);

    int deleteTermLastCloseDate(@Param("contCorpId") Long contCorpId, @Param("chargeDate") LocalDate chargeDate);

    /** biz22_fee_charge_calc.selectByContCorpId 와 같은 SQL(회사 확인 없음) — 자료생성 안에서 쓴다 */
    List<BizFeeChargeCalc> selectCalcsByContCorp(@Param("contCorpId") Long contCorpId, @Param("chargeDate") LocalDate chargeDate);

    /** biz11_cont_history.selectByStartDate 에서 계약상태코드만 */
    String selectContStatusByStartDate(@Param("contCorpId") Long contCorpId, @Param("startDate") LocalDate startDate);

    int deleteCalcById(@Param("feeChargeCalcId") Long feeChargeCalcId);

    int updateTermCloseDate(@Param("feeChargeCalcId") Long feeChargeCalcId, @Param("termCloseDate") LocalDate termCloseDate);

    BizFeeHistoryRow selectHistoryByDate(@Param("contCorpId") Long contCorpId, @Param("stdDate") LocalDate stdDate);

    int updateCalcFeeInfo(@Param("t") BizFeeChargeCalc t);

    List<BizFeeChargeRow> selectByContCorpId2(@Param("contCorpId") Long contCorpId, @Param("chargeDate") LocalDate chargeDate);

    BizFeeInfoRow selectFeeInfo(@Param("contCorpId") Long contCorpId, @Param("chargeDate") LocalDate chargeDate,
                                @Param("manageType") String manageType);

    int updateFeeCalcInfo(@Param("feeChargeId") Long feeChargeId, @Param("calcStartDate") LocalDate calcStartDate,
                          @Param("calcCloseDate") LocalDate calcCloseDate, @Param("calcDays") Long calcDays, @Param("f") BizFeeInfoRow f);

    int insertNotAccount(@Param("companyId") Long companyId, @Param("chargeDate") LocalDate chargeDate);

    // ── 출력/다운로드 (Sys99_Print.insertRdFeeCharge) ──

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") BizFeeChargeRes r);
}
