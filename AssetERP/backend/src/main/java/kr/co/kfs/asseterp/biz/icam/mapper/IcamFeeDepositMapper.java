package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDepositRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDepositSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcamFeeDepositMapper {

    /** AS-IS icam11_fee_deposit.selectByCompanyId — corpIdStr "%"는 전체 운용사 */
    List<IcamFeeDepositRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("corpIdStr") String corpIdStr, @Param("searchText") String searchText);

    /** AS-IS icam11_fee_deposit.selectByFundCode2 */
    List<IcamFeeDepositRes> selectByFundCode2(@Param("companyId") Long companyId, @Param("icamCompanyCode") String icamCompanyCode, @Param("fundCode") String fundCode);

    /** AS-IS icam11_fee_deposit.selectById */
    IcamFeeDepositRes selectById(@Param("companyId") Long companyId, @Param("feeDepositId") Long feeDepositId);

    Long selectNextId();

    int insertFeeDeposit(@Param("feeDepositId") Long feeDepositId, @Param("companyId") Long companyId, @Param("r") IcamFeeDepositSaveReq.Item r);

    int updateFeeDeposit(@Param("companyId") Long companyId, @Param("r") IcamFeeDepositSaveReq.Item r);

    int deleteFeeDeposits(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
