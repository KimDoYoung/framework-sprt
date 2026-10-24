package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManagerInfoRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManagerRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManagerSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmManagerMapper {

    /** AS-IS tdm08_manager_info.selectByCompanyId */
    List<ManagerRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS tdm08_manager_info.selectByManagerType */
    List<ManagerInfoRes> selectByManagerType(@Param("companyId") Long companyId, @Param("managerType") String managerType, @Param("orgId") Long orgId);

    /** AS-IS tdm08_manager_info.selectById */
    ManagerInfoRes selectById(@Param("managerInfoId") Long managerInfoId);

    /** 담당자 행의 회사 ID (없으면 null) */
    Long selectCompanyId(@Param("managerInfoId") Long managerInfoId);

    Long selectNextId();

    int insertManager(@Param("managerInfoId") Long managerInfoId, @Param("companyId") Long companyId, @Param("row") ManagerSaveReq row, @Param("updName") String updName);

    int updateManager(@Param("row") ManagerSaveReq row, @Param("updName") String updName);

    int deleteManagers(@Param("companyId") Long companyId, @Param("managerInfoIds") List<Long> managerInfoIds);
}
