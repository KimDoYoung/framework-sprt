package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamDataRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcamDataMapper {

    /** AS-IS icam02_data.selectByCompanyId */
    List<IcamDataRes> selectByCompanyId(@Param("companyId") Long companyId);
}
