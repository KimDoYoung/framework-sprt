package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizErpCompanyRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeChargeRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeChargeSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeDefaultRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/biz/mapper/biz55_erp_fee_charge + biz51 selectErpCompany + biz52 selectDefaultData·selectByDate — AssetERP 사용료청구 (EE23) */
@Mapper
public interface BizErpFeeChargeMapper {

    List<BizErpFeeChargeRes> selectByStdDate(@Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText);

    BizErpFeeChargeRes selectById(@Param("erpFeeChargeId") Long erpFeeChargeId);

    List<BizErpCompanyRes> selectErpCompany(@Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText);

    /** 한 계약사의 청구 계산 기본 정보 (selectErpCompany 한 행을 ID로 — 생성 때 서버가 다시 읽는다) */
    List<BizErpCompanyRes> selectErpCompanyById(@Param("stdDate") LocalDate stdDate, @Param("erpContCorpId") Long erpContCorpId);

    BizErpFeeDefaultRes selectDefaultData(@Param("erpContCorpId") Long erpContCorpId, @Param("companyId") Long companyId,
                                          @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** biz52_erp_fee.selectByDate — 기간 안 사용료 요약(청구 생성 계산용), 없으면 null */
    ErpFeePeriod selectFeeByDate(@Param("erpContCorpId") Long erpContCorpId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    long selectSmsCount(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** sys10_file.selectByCompanyId 의 누적 사용량(GB), 없으면 null */
    Double selectServerUsage(@Param("companyId") Long companyId, @Param("closeDate") LocalDate closeDate);

    /** emp01_person.getPersonCount — userCountStdCode 1=전월말 2=전년말 기준 */
    long selectPersonCount(@Param("companyId") Long companyId, @Param("userCountStdCode") String userCountStdCode);

    long selectNextId();

    int countById(@Param("erpFeeChargeId") Long erpFeeChargeId);

    int insertErpFeeCharge(@Param("r") ChargeInsert r);

    int insertSaved(@Param("r") BizErpFeeChargeSaveReq r);

    int updateSaved(@Param("r") BizErpFeeChargeSaveReq r);

    int confirmUpdate(@Param("erpFeeChargeId") Long erpFeeChargeId, @Param("fixYn") String fixYn);

    int updateApprId(@Param("erpFeeChargeId") Long erpFeeChargeId, @Param("apprId") Long apprId);

    int deleteById(@Param("erpFeeChargeId") Long erpFeeChargeId);

    /** biz52_erp_fee.selectByDate 한 행 (청구 생성 계산에 쓰는 열) */
    record ErpFeePeriod(String chargeDay, String vatCd, Boolean addFeeSmsYn, Boolean addFeeServerYn, Boolean addFeeUserYn,
                        Long erpFee, Long dataFee, Long smsBaseCount, Long smsAddPrice, Long serverBaseUsage, Long serverAddUnit,
                        Long serverAddPrice, Long userBaseCount, Long userAddPrice, String userCountStdCd) {
    }

    /** [생성]이 넣는 한 행 (Biz55_ErpFeeChargeModel 중 insertErpFeeCharge 가 쓰는 속성). 부가세 5개는 0 */
    record ChargeInsert(Long erpFeeChargeId, LocalDate chargeDate, LocalDate startDate, LocalDate closeDate, Long erpContCorpId,
                        Long erpFee, Long dataFee, Long smsCount, Long serverUsage, Long userCount, Long addSmsFee, Long addServerFee,
                        Long addUserFee, Long etcAmt, Long totalAmt, Long totalVat, Long chargeAmt) {
    }
}
