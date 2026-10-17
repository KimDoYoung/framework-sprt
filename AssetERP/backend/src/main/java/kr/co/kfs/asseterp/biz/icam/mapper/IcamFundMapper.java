package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamFundParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFundRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcamFundMapper {

    /** AS-IS icam03_fund.selectRecentFund */
    List<IcamFundRes> selectRecentFund(@Param("companyId") Long companyId);

    /** AS-IS icam03_fund.selectByNamePaging */
    List<IcamFundRes> selectByNamePaging(@Param("p") IcamFundParam param);

    /** AS-IS icam03_fund.selectByNameTotal */
    int selectByNameTotal(@Param("p") IcamFundParam param);
}
