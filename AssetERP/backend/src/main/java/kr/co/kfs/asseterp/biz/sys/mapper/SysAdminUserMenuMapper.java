package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.AdminUserMenuRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS sys06_menu.selectByAdminUserId + UpdateDataModel(sys82_admin_user_menu) */
@Mapper
public interface SysAdminUserMenuMapper {
    /** AS-IS selectByAdminUserId: 한 단계(parentId의 자식) */
    List<AdminUserMenuRes> selectChildren(@Param("companyId") Long companyId, @Param("userId") Long userId, @Param("parentId") Long parentId);

    Long selectNextId();

    int insertAdminUserMenu(@Param("id") Long id, @Param("userId") Long userId, @Param("menuId") Long menuId, @Param("useYn") String useYn);

    int updateAdminUserMenu(@Param("id") Long id, @Param("userId") Long userId, @Param("useYn") String useYn);

    AdminUserMenuRes selectSaved(@Param("userId") Long userId, @Param("menuId") Long menuId);

    /** 관리자가 그 회사 사람인지 (다른 회사 관리자 ID로 저장하지 못하게) */
    int countUser(@Param("userId") Long userId);
}
