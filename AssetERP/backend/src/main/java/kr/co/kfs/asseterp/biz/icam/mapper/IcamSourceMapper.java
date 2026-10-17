package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamSourceParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamSourceRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcamSourceMapper {

    /** AS-IS icam50_source.selectByServerTypePaging */
    List<IcamSourceRes> selectByServerTypePaging(@Param("p") IcamSourceParam param);

    /** AS-IS icam50_source.selectByServerTypePagingTotal */
    int selectByServerTypePagingTotal(@Param("p") IcamSourceParam param);

    /** AS-IS icam50_source.countByStdDate: 오늘자 소스 건수 */
    int countByStdDate();
}
