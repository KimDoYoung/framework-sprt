package kr.co.kfs.asseterp.biz.org.mapper;

import kr.co.kfs.asseterp.biz.org.dto.OrgRoleStampRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgRoleStampSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/org/mapper/org10_role_stamp.xml */
@Mapper
public interface OrgRoleStampMapper {
    /** AS-IS selectByStampId (G07) — 로그인 회사의 인감만 */
    List<OrgRoleStampRes> selectByStampId(@Param("companyId") Long companyId, @Param("stampId") Long stampId);

    /** 저장한 한 행 (AS-IS selectById) */
    OrgRoleStampRes selectById(@Param("roleStampId") Long roleStampId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Org10_RoleStamp.update → UpdateDataModel INSERT. 로그인 회사의 인감일 때만 1건 */
    int insertRoleStamp(@Param("companyId") Long companyId, @Param("r") OrgRoleStampSaveReq req);

    /** AS-IS Org10_RoleStamp.update → UpdateDataModel UPDATE */
    int updateRoleStamp(@Param("companyId") Long companyId, @Param("r") OrgRoleStampSaveReq req);

    /** AS-IS Org10_RoleStamp.delete → UpdateDataModel DELETE */
    int deleteRoleStamp(@Param("companyId") Long companyId, @Param("roleStampId") Long roleStampId);
}
