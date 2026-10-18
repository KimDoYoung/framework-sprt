package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmRoleDigmMapper {

    /** 책무체계도의 회사 (없으면 null) — 재생성 권한 범위 검사용 */
    Long selectCompanyId(@Param("roleDigmId") Long roleDigmId);

    /** AS-IS tdm32_role_digm.selectByRegDateAdmin */
    List<RoleDigmRes> selectByRegDateAdmin(RoleDigmParam param);

    /** AS-IS tdm33_role_digm_file.selectByFileType — 파일정보 ID들(화면은 첫 건) */
    List<Long> selectFileIdByFileType(@Param("roleDigmId") Long roleDigmId, @Param("fileType") String fileType);
}
