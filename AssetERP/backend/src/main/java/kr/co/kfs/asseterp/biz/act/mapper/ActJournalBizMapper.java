package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.JournalBizCardRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizErpFeeRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizFeeRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizLineRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 급여/카드 회계처리 Act02_Tab_CreateJournalBiz (U10) — AS-IS server/act/mapper/act02_journal.xml · act03_journal_dtl.xml 외 (매퍼 XML 머리 주석) */
@Mapper
public interface ActJournalBizMapper {

    List<JournalBizRes> selectMonthBiz(@Param("companyId") Long companyId, @Param("stdMonth") String stdMonth);

    List<JournalBizLineRes> selectBizCardLines(@Param("companyId") Long companyId, @Param("stdMonth") String stdMonth);

    List<JournalBizLineRes> selectChargeFeeLines(@Param("companyId") Long companyId, @Param("stdMonth") String stdMonth,
                                                 @Param("trCode") String trCode, @Param("manageType") String manageType);

    List<JournalBizLineRes> selectErpChargeFeeLines(@Param("companyId") Long companyId, @Param("chargeDate") LocalDate chargeDate, @Param("trCode") String trCode);

    List<JournalBizLineRes> selectJournalLines(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    List<JournalBizCardRes> selectBizCards(@Param("companyId") Long companyId, @Param("stdMonth") String stdMonth);

    List<JournalBizFeeRes> selectFeeCharges(@Param("companyId") Long companyId, @Param("stdMonth") String stdMonth,
                                            @Param("trCode") String trCode, @Param("manageType") String manageType);

    int updateFeeChargeTrId(@Param("feeChargeId") Long feeChargeId, @Param("trId") Long trId);

    List<JournalBizErpFeeRes> selectErpFeeCharges(@Param("companyId") Long companyId, @Param("trCode") String trCode, @Param("chargeDate") LocalDate chargeDate);

    int updateErpFeeChargeTrId(@Param("erpFeeChargeId") Long erpFeeChargeId, @Param("trId") Long trId);

    int insertTr(@Param("trId") Long trId, @Param("astClassTreeId") Long astClassTreeId, @Param("date") LocalDate date, @Param("trCode") String trCode,
                 @Param("amt") Long amt, @Param("contAmt") Long contAmt, @Param("tax") Long tax, @Param("note") String note,
                 @Param("personId") Long personId, @Param("companyId") Long companyId, @Param("corpId") Long corpId);

    List<Long> selectTrIdsByDate(@Param("companyId") Long companyId, @Param("trCode") String trCode, @Param("date") LocalDate date);

    String createJournalPayMonth(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("payDate") LocalDate payDate,
                                 @Param("payType") String payType, @Param("retireId") Long retireId);

    Long selectJournalIdByTrId(@Param("trId") Long trId);

    int insertRelateAppr(@Param("apprId") Long apprId, @Param("journalId") Long journalId, @Param("trId") Long trId);

    int deleteJournalTmpByBizId(@Param("bizId") Long bizId);

    int deleteJournalDtlByBizId(@Param("bizId") Long bizId);

    int deleteJournalByBizId(@Param("bizId") Long bizId);

    int deleteJournalTmpById(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    int deleteJournalDtlById(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    int deleteJournalById(@Param("companyId") Long companyId, @Param("journalId") Long journalId);
}
