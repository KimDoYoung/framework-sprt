package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundLookupRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd00_fund.xml */
@Mapper
public interface FndFundMapper {
    /** AS-IS selectByLookupFundCode L366 (P01 펀드찾기) */
    List<FundLookupRes> selectByLookupFundCode(@Param("companyId") Long companyId, @Param("closeYn") String closeYn,
                                               @Param("fundName") String fundName);
}
