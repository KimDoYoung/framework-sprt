package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.AdminUserRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys02_user.xml + UpdateDataModel(sys02_user) — yunhee port-sql·port-save로 옮김 */
@Mapper
public interface SysUserMapper {
    /** AS-IS selectByName (korName = '%') */
    List<AdminUserRes> searchUsers(@Param("companyId") Long companyId, @Param("korName") String korName);

    AdminUserRes selectUser(Long userId);

    Long selectNextId();

    /** 같은 회사에 같은 로그인 ID가 있는지(자기 자신 제외) */
    int countByLoginId(@Param("companyId") Long companyId, @Param("loginId") String loginId, @Param("userId") Long userId);

    int insertUser(AdminUserRow row);

    int updateUser(AdminUserRow row);

    int deleteUsers(@Param("userIds") List<Long> userIds, @Param("companyId") Long companyId);
}
