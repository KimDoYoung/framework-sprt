package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.ManagementTeamRes;
import kr.co.kfs.asseterp.biz.sys.dto.ManagementTeamSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysManagementTeamMapper {

    /** AS-IS sys92_management_team.selectByAll */
    List<ManagementTeamRes> selectByAll();

    /** AS-IS sys92_management_team.selectById (사원이 있는 행만) */
    ManagementTeamRes selectById(@Param("managementTeamId") Long managementTeamId);

    /** 사원을 아직 안 고른 행은 selectById(INNER JOIN)에 안 나온다 → 저장한 값만 읽는다 (TOBE 보강) */
    ManagementTeamRes selectRawById(@Param("managementTeamId") Long managementTeamId);

    /** AS-IS dbConfig.getSeq (= f_create_seq) */
    Long selectNextId();

    int insertManagementTeam(@Param("id") Long id, @Param("r") ManagementTeamSaveReq req);

    int updateManagementTeam(@Param("r") ManagementTeamSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deleteManagementTeams(@Param("ids") List<Long> ids);
}
