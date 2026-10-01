package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysUserRoleMapper {
    Long selectNextId();

    UserRoleRes selectById(UserRoleSearchParam param);

    /** 권한그룹의 사원 (현재 발령 조직·직책) */
    List<UserRoleRes> searchByRoleId(UserRoleSearchParam param);

    int insert(UserRoleRow row);

    /** 권한조직만 바꾼다 */
    int update(UserRoleRow row);

    int delete(UserRoleDeleteParam param);
}
