package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.PersonRoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.PersonRoleRow;
import kr.co.kfs.asseterp.biz.sys.dto.RoleAdminRow;
import kr.co.kfs.asseterp.biz.sys.dto.RoleDeleteParam;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRow;
import kr.co.kfs.asseterp.biz.sys.dto.RoleSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/sys/mapper/sys04_role.xml + UpdateDataModel(sys04_role) */
@Mapper
public interface SysRoleMapper {
    /** AS-IS selectByName */
    List<RoleRes> searchRoles(RoleSearchParam param);

    /** A11 AS-IS selectByMenuId (그 메뉴를 쓰는 권한그룹) */
    List<RoleRes> searchRolesByMenuId(@org.apache.ibatis.annotations.Param("companyId") Long companyId,
                                      @org.apache.ibatis.annotations.Param("menuId") Long menuId);

    /** AS-IS selectById (저장 후 다시 읽기) */
    RoleRes selectRole(Long roleId);

    /** AS-IS getSeq (= f_create_seq) */
    Long selectNextId();

    /** AS-IS UpdateDataModel 동적 INSERT */
    int insertRole(RoleRow row);

    /** AS-IS UpdateDataModel 동적 UPDATE (화면에서 바뀌는 컬럼만, 로그인 회사 행만) */
    int updateRole(RoleRow row);

    /** AS-IS UpdateDataModel 동적 DELETE (로그인 회사 행만) */
    int deleteRoles(RoleDeleteParam param);

    /** A02 고객사 권한그룹: UpdateDataModel 동적 INSERT (기본권한·관리자권한 포함) */
    int insertRoleAdmin(RoleAdminRow row);

    /** A02 고객사 권한그룹: UpdateDataModel 동적 UPDATE (화면에서 바뀌는 컬럼만, 고른 고객사 행만) */
    int updateRoleAdmin(RoleAdminRow row);

    /** A04 사원별 권한그룹: AS-IS selectByUserId (회사 권한그룹 + 사원 연결 여부) */
    List<PersonRoleRes> searchPersonRoles(Long companyId, Long userId);

    /** A04 AS-IS updateUserRole → UpdateDataModel(sys05_user_role) INSERT (note = 권한명) */
    int insertPersonRole(PersonRoleRow row);
}
