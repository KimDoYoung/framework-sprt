package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd01_fund_code.xml */
@Mapper
public interface FndFundCodeMapper {
    /** AS-IS selectByFundOrgAuth L392 (F06) */
    List<FundCodeRes> selectByFundOrgAuth(@Param("c") FundCodeCond cond);
}
