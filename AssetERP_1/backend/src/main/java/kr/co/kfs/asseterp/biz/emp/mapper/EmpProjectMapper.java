package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.ProjectRes;
import kr.co.kfs.asseterp.biz.emp.dto.ProjectSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/emp13_project.xml */
@Mapper
public interface EmpProjectMapper {

    List<ProjectRes> selectProjects(@Param("companyId") Long companyId, @Param("personId") Long personId);

    ProjectRes selectProjectById(@Param("projectId") Long projectId);

    Long selectNextProjectId();

    int insertProject(@Param("projectId") Long projectId, @Param("companyId") Long companyId, ProjectSaveReq req);

    int updateProject(@Param("projectId") Long projectId, @Param("companyId") Long companyId, ProjectSaveReq req);

    int deleteProjects(@Param("projectIds") List<Long> projectIds, @Param("companyId") Long companyId);
}
