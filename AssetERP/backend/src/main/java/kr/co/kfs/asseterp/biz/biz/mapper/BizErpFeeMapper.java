package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/biz/mapper/biz52_erp_fee — AssetERP 사용료 Biz52_Lookup_ErpFee (EE22) */
@Mapper
public interface BizErpFeeMapper {

    List<BizErpFeeRes> selectByErpContCorpId(@Param("companyId") Long companyId, @Param("erpContCorpId") Long erpContCorpId);

    BizErpFeeRes selectByStartDate(@Param("companyId") Long companyId, @Param("erpContCorpId") Long erpContCorpId, @Param("stdDate") LocalDate stdDate);

    BizErpFeeRes selectById(@Param("erpFeeId") Long erpFeeId);

    long selectNextId();

    int countById(@Param("erpFeeId") Long erpFeeId);

    int insertErpFee(@Param("r") BizErpFeeSaveReq r);

    int updateErpFee(@Param("r") BizErpFeeSaveReq r);

    int deleteById(@Param("erpFeeId") Long erpFeeId);
}
