package kr.co.kfs.asseterp.biz.icr.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcrRelateManagerMapper {

    /** AS-IS icr05_relate_manager.selectByClassTreeId — 내규에 연결된 관리그룹 (ics02_manager 열만) */
    List<IcsManagerRes> selectByClassTreeId(@Param("companyId") Long companyId, @Param("icrClassTreeId") Long icrClassTreeId);

    /** AS-IS icr05_relate_manager.delete */
    int deleteByClassTreeId(@Param("companyId") Long companyId, @Param("icrClassTreeId") Long icrClassTreeId);

    /** AS-IS icr05_relate_manager.insert */
    int insert(@Param("companyId") Long companyId, @Param("icrClassTreeId") Long icrClassTreeId, @Param("managerId") Long managerId);
}
