package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcsManagerMapper {

    /** AS-IS ics02_manager.selectByCompanyId (Ics02_Lookup_Manager) — 미지정 그룹이 맨 앞 */
    List<IcsManagerRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS ics02_manager.getDefaultYn (Ics01_Lookup_Share) — 미지정 관리그룹 */
    IcsManagerRes selectDefault(@Param("companyId") Long companyId);

    /** 관리그룹이 이 회사 것인지 (AS-IS에는 없는 보안 확인) */
    IcsManagerRes selectById(@Param("companyId") Long companyId, @Param("managerId") Long managerId);

    /** AS-IS ics04_share.selectByManagerId (Ics01_Lookup_Share 공유 그리드) */
    List<IcsShareRes> selectSharesByManagerId(@Param("companyId") Long companyId, @Param("managerId") Long managerId);
}
