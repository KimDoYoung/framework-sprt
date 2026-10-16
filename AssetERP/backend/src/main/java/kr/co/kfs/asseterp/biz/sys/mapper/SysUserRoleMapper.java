package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.UserRoleDeleteParam;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys05_user_role.xml + UpdateDataModel(sys05_user_role) */
@Mapper
public interface SysUserRoleMapper {
    /** AS-IS selectByRoleId */
    List<UserRoleRes> searchUserRoles(@Param("roleId") Long roleId);

    /** AS-IS selectById */
    UserRoleRes selectUserRole(@Param("userRoleId") Long userRoleId);

    int countRole(@Param("companyId") Long companyId, @Param("roleId") Long roleId);

    int countPerson(@Param("companyId") Long companyId, @Param("userId") Long userId);

    int countSameUserRole(UserRoleRow row);

    /** AS-IS getSeq */
    Long selectNextId();

    int insertUserRole(UserRoleRow row);

    int updateUserRole(UserRoleRow row);

    int deleteUserRoles(UserRoleDeleteParam param);
}
