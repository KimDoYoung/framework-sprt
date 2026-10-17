package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcamFeeMapper {

    /** AS-IS icam10_fee.selectByFeeTypePaging */
    List<IcamFeeRes> selectByFeeTypePaging(@Param("p") IcamFeeParam param);

    /** AS-IS icam10_fee.selectByFeeTypePagingTotal */
    int selectByFeeTypePagingTotal(@Param("p") IcamFeeParam param);
}
