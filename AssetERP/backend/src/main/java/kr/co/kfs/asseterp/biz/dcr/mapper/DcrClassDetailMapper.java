package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassDetailRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassDetailSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr07_class_detail.xml + UpdateDataModel(dcr07_class_detail) */
@Mapper
public interface DcrClassDetailMapper {
    /** AS-IS selectByClassTreeId (조회순) */
    List<DcrClassDetailRes> selectByClassTreeId(@Param("classTreeId") Long classTreeId);

    DcrClassDetailRes selectById(@Param("classDetailId") Long classDetailId);

    Long selectNextId();

    int insert(@Param("classDetailId") Long classDetailId, @Param("req") DcrClassDetailSaveReq req);

    int update(@Param("req") DcrClassDetailSaveReq req);

    int deleteByIds(@Param("ids") List<Long> ids);
}
