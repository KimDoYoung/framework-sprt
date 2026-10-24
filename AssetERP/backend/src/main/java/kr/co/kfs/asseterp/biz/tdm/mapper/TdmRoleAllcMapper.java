package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcDetailKey;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcExctRow;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcTaskDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcTaskRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmRoleAllcMapper {

    /** AS-IS tdm30_role_allc.selectByText */
    List<RoleAllcRes> selectByText(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate,
                                   @Param("allYn") boolean allYn, @Param("searchText") String searchText);

    /** AS-IS tdm30_role_allc.selectById */
    RoleAllcRes selectById(@Param("roleAllcId") Long roleAllcId);

    /** AS-IS tdm30_role_allc.notInRoleAllcIdList */
    List<RoleAllcRes> notInRoleAllcIdList(@Param("companyId") Long companyId, @Param("roleAllcIds") List<Long> roleAllcIds);

    Long selectNextId();

    /** 직책배정의 회사 (없으면 null) */
    Long selectCompanyId(@Param("roleAllcId") Long roleAllcId);

    int insertRoleAllc(@Param("roleAllcId") Long roleAllcId, @Param("companyId") Long companyId, @Param("roleId") Long roleId,
                       @Param("personId") Long personId, @Param("addTitleYn") String addTitleYn,
                       @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("updName") String updName);

    int updateRoleAllc(@Param("roleAllcId") Long roleAllcId, @Param("companyId") Long companyId, @Param("roleId") Long roleId,
                       @Param("personId") Long personId, @Param("addTitleYn") String addTitleYn,
                       @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("updName") String updName);

    /** AS-IS tdm34_role_allc_detail.deleteByRoleAllcId */
    int deleteDetailsByRoleAllcId(@Param("roleAllcId") Long roleAllcId);

    int deleteRoleAllcs(@Param("companyId") Long companyId, @Param("roleAllcIds") List<Long> roleAllcIds);

    /** AS-IS tdm34_role_allc_detail.selectByRoleAllcId */
    List<RoleAllcDetailRes> selectDetailsByRoleAllcId(@Param("roleAllcId") Long roleAllcId);

    /** 책무배분일의 회사·임원·책무배분일 (없으면 null) */
    RoleAllcDetailKey selectDetailKey(@Param("roleAllcDetailId") Long roleAllcDetailId);

    int insertDetail(@Param("roleAllcDetailId") Long roleAllcDetailId, @Param("roleAllcId") Long roleAllcId,
                     @Param("roleAllcDate") LocalDate roleAllcDate, @Param("regReason") String regReason,
                     @Param("deputyEmpName") String deputyEmpName, @Param("updName") String updName);

    int updateDetail(@Param("roleAllcDetailId") Long roleAllcDetailId, @Param("roleAllcDate") LocalDate roleAllcDate,
                     @Param("regReason") String regReason, @Param("deputyEmpName") String deputyEmpName, @Param("updName") String updName);

    int deleteDetails(@Param("roleAllcDetailIds") List<Long> roleAllcDetailIds);

    /** AS-IS tdm35_role_allc_task.selectTask */
    List<RoleAllcTaskRes> selectTask(@Param("roleAllcDetailId") Long roleAllcDetailId);

    /** AS-IS tdm35_role_allc_task.selectTaskDetail */
    List<RoleAllcTaskDetailRes> selectTaskDetail(@Param("roleAllcDetailId") Long roleAllcDetailId, @Param("taskId") Long taskId);

    /** AS-IS tdm30_role_allc.selectByExctId */
    List<RoleAllcExctRow> selectByExctId(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("exctId") Long exctId);

    /** AS-IS tdm35_role_allc_task.deleteByRoleAllcDetailId */
    int deleteTasksByDetailId(@Param("roleAllcDetailId") Long roleAllcDetailId);

    /** AS-IS tdm35_role_allc_task.insertByRoleAllcDetailId */
    int insertTasksByDetailId(@Param("roleAllcDetailId") Long roleAllcDetailId, @Param("updName") String updName);

    /** AS-IS tdm31_role_desc.getRollAllcDetailId — 승인 완료된 책무기술서 ID (없으면 null) */
    Long selectRoleDescId(@Param("companyId") Long companyId, @Param("roleAllcDate") LocalDate roleAllcDate,
                          @Param("roleAllcDetailId") Long roleAllcDetailId);
}
