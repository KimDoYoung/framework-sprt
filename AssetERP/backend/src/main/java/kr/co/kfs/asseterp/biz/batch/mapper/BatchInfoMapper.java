package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamDataInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** ICAM 연계 정보코드(icam01_data_info) 반영용 SQL (ICAM 읽기는 IcamReader) */
@Mapper
public interface BatchInfoMapper {

    /** AS-IS icam01_data_info.selectByInfoCodeAndTrCode */
    List<BatchIcamDataInfo> selectByInfoCodeAndTrCode(@Param("infoCode") String infoCode, @Param("trCode") String trCode);

    /** AS-IS icam01_data_info.insertUpdate — 있으면 고치고 없으면 넣는다 */
    int insertUpdate(@Param("p") BatchIcamDataInfo info);
}
