package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleCopyParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** 권한그룹·메뉴권한 복사 (AS-IS sys07_role_menu 매퍼와 Sys07_RoleMenu가 부르는 sys04/sys06/sys03 SQL) */
@Mapper
public interface SysRoleMenuMapper {
    /** companyId 회사에서 이름이 roleNm(LIKE)인 권한그룹 수 */
    int countRolesByName(RoleCopyParam param);

    /** 원본 회사의 권한그룹을 companyId 회사로 복사 */
    int insertRoleCopy(RoleCopyParam param);

    /** menuId와 그 상위 메뉴 ID 전부 */
    List<Long> selectMenuPath(Long menuId);

    int countCompanyMenu(RoleCopyParam param);

    int updateCompanyMenuCopy(RoleCopyParam param);

    int insertCompanyMenuCopy(RoleCopyParam param);

    int countRoleMenu(RoleCopyParam param);

    int updateRoleMenuCopy(RoleCopyParam param);

    int insertRoleMenuCopy(RoleCopyParam param);
}
