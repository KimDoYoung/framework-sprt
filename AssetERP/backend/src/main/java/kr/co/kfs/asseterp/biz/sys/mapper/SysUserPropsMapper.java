package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.UserPropsRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** sys90_user_props — 사용자 설정 (TOBE 재설계 03, AS-IS 없음) */
@Mapper
public interface SysUserPropsMapper {
    /** 사용자 한 행 (없으면 null) */
    UserPropsRow selectByUserId(@Param("userId") Long userId);

    /** 나의 화면 목록 저장 — 행이 없으면 만든다 */
    int upsertMyScreenLayout(@Param("userId") Long userId, @Param("companyId") Long companyId, @Param("json") String json);
}
