package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.ClassRoleRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassRoleSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs33_role.xml + UpdateDataModel(bbs33_role) (Z13 Bbs33_Lookup_Role) */
@Mapper
public interface BbsClassRoleMapper {

    List<ClassRoleRes> selectByClassTreeId(@Param("classTreeId") Long classTreeId);

    ClassRoleRes selectById(@Param("roleId") Long roleId);

    /** bbs33_role.checkRole — 이 사원(P) 또는 이 사원의 조직(O)에게 권한이 있는 줄 수 */
    long countRole(@Param("classTreeId") Long classTreeId, @Param("personId") Long personId, @Param("orgId") Long orgId);

    Long selectNextId();

    int insertRole(@Param("roleId") Long roleId, @Param("classTreeId") Long classTreeId, @Param("r") ClassRoleSaveReq r);

    int updateRole(@Param("classTreeId") Long classTreeId, @Param("r") ClassRoleSaveReq r);

    int deleteRoles(@Param("classTreeId") Long classTreeId, @Param("roleIds") List<Long> roleIds);
}
