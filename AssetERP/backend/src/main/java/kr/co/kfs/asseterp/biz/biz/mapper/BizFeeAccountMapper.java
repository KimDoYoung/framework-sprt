package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizFeeAccountRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeAccountSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/biz/mapper/biz29_account — 보수입금계좌 Biz29_Lookup_Account (EE21) */
@Mapper
public interface BizFeeAccountMapper {

    List<BizFeeAccountRes> selectBySearchText(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    BizFeeAccountRes selectById(@Param("companyId") Long companyId, @Param("accountId") Long accountId);

    long selectNextId();

    int countById(@Param("companyId") Long companyId, @Param("accountId") Long accountId);

    int insertAccount(@Param("companyId") Long companyId, @Param("r") BizFeeAccountSaveReq r);

    int updateAccount(@Param("companyId") Long companyId, @Param("r") BizFeeAccountSaveReq r);

    int deleteById(@Param("companyId") Long companyId, @Param("accountId") Long accountId);
}
