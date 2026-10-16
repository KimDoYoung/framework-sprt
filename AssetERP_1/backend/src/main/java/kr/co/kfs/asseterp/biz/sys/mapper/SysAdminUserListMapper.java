package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.AdminUserListRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserListSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys80_admin_user_list.xml + UpdateDataModel(sys80_admin_user_list) — yunhee port-save로 옮김 */
@Mapper
public interface SysAdminUserListMapper {
    /** AS-IS selectByAll */
    List<AdminUserListRes> selectByAll();

    AdminUserListRes selectById(@Param("adminUserListId") Long adminUserListId);

    Long selectNextId();

    int insertAdminUserList(@Param("adminUserListId") Long adminUserListId, @Param("req") AdminUserListSaveReq req);

    int updateAdminUserList(@Param("req") AdminUserListSaveReq req);

    int deleteAdminUserLists(@Param("adminUserListIds") List<Long> adminUserListIds);
}
