package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRoleLookupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmCouncilMapper {

    /** AS-IS tdm05_cncl.selectByDate */
    List<CouncilRes> selectByDate(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate, @Param("allYn") boolean allYn);

    CouncilRes selectById(@Param("cnclId") Long cnclId, @Param("companyId") Long companyId);

    /** AS-IS tdm05_cncl.countUseByCnclId */
    int countUseByCnclId(@Param("cnclId") Long cnclId);

    /** 회의체의 회사 ID (없으면 null) */
    Long selectCompanyId(@Param("cnclId") Long cnclId);

    Long selectNextId();

    int insertCouncil(@Param("cnclId") Long cnclId, @Param("companyId") Long companyId, @Param("row") CouncilSaveReq row, @Param("updName") String updName);

    int updateCouncil(@Param("row") CouncilSaveReq row, @Param("updName") String updName);

    int deleteCouncils(@Param("cnclIds") List<Long> cnclIds);

    /** AS-IS tdm22_role_relate_cncl.selectByCnclId */
    List<CouncilRoleRes> selectRolesByCnclId(@Param("cnclId") Long cnclId, @Param("companyId") Long companyId);

    CouncilRoleRes selectRoleById(@Param("roleRelateCnclId") Long roleRelateCnclId);

    /** 직책이 로그인 회사 것인지 (없으면 null) */
    Long selectRoleCompanyId(@Param("roleId") Long roleId);

    int insertRole(@Param("roleRelateCnclId") Long roleRelateCnclId, @Param("row") CouncilRoleRes row);

    int updateRole(@Param("row") CouncilRoleRes row);

    int deleteRoles(@Param("roleRelateCnclIds") List<Long> roleRelateCnclIds);

    /** AS-IS tdm20_role.selectByDate (직책 고르기창) */
    List<CouncilRoleLookupRes> selectRoleLookup(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate, @Param("searchText") String searchText);
}
