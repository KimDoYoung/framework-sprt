package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmRoleDescMapper {

    /** 책무기술서의 회사 (없으면 null) — 재생성 권한 범위 검사용 */
    Long selectCompanyId(@Param("roleDescId") Long roleDescId);

    /** AS-IS tdm31_role_desc.selectByRegDateAdmin */
    List<RoleDescRes> selectByRegDateAdmin(RoleDescParam param);
}
