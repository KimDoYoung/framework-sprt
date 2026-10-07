package kr.co.kfs.asseterp.biz.sys.mapper;

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
}
