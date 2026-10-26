package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundInfoCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundInfoRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd02_fund_info.xml */
@Mapper
public interface FndFundInfoMapper {
    /** AS-IS selectByNamePaging (P08) */
    List<FundInfoRes> selectByNamePaging(@Param("c") FundInfoCond cond);

    /** AS-IS selectByNameTotal (P08) */
    long selectByNameTotal(@Param("c") FundInfoCond cond);
}
