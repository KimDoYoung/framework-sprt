package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcsRelateManagerMapper {

    /** AS-IS ics05_relate_manager.selectByClassTreeId */
    List<IcsManagerRes> selectByClassTreeId(@Param("companyId") Long companyId, @Param("icsClassTreeId") Long icsClassTreeId);

    /** AS-IS ics05_relate_manager.delete */
    int deleteByClassTreeId(@Param("companyId") Long companyId, @Param("icsClassTreeId") Long icsClassTreeId);

    /** AS-IS ics05_relate_manager.insert */
    int insert(@Param("companyId") Long companyId, @Param("icsClassTreeId") Long icsClassTreeId, @Param("managerId") Long managerId);

    /** AS-IS sch02_share.delete */
    int deleteShare(@Param("companyId") Long companyId, @Param("icsClassTreeId") Long icsClassTreeId);

    /** AS-IS sch02_share.insert */
    int insertShare(@Param("infoId") Long infoId, @Param("companyId") Long companyId, @Param("shareCode") String shareCode,
                    @Param("personId") Long personId, @Param("orgId") Long orgId);
}
