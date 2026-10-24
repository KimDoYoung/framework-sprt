package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.RoleCouncilRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleOrgLookupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleTaskRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmRoleMapper {

    /** AS-IS tdm20_role.selectByDate (roleType이 null이 아니면 그 직책그룹만) */
    List<RoleRes> selectByDate(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate, @Param("allYn") boolean allYn,
                               @Param("searchText") String searchText, @Param("roleType") String roleType);

    /** AS-IS tdm20_role.selectById */
    RoleRes selectById(@Param("roleId") Long roleId);

    /** 직책의 회사 ID (없으면 null) */
    Long selectCompanyId(@Param("roleId") Long roleId);

    /** AS-IS tdm20_role.countUseByRoleId (임원별 직책배정에 쓰인 건수) */
    int countUseByRoleId(@Param("roleId") Long roleId);

    /** AS-IS tdm20_role.checkCeoRoleId: 이 직책을 보고CEO로 가진 직책 수 */
    int countCeoRef(@Param("roleId") Long roleId);

    Long selectNextId();

    int insertRole(@Param("roleId") Long roleId, @Param("companyId") Long companyId, @Param("row") RoleSaveReq row, @Param("updName") String updName);

    int updateRole(@Param("companyId") Long companyId, @Param("row") RoleSaveReq row, @Param("updName") String updName);

    int updateCeo(@Param("companyId") Long companyId, @Param("roleId") Long roleId, @Param("ceoRoleId") Long ceoRoleId, @Param("updName") String updName);

    int deleteRoles(@Param("roleIds") List<Long> roleIds, @Param("companyId") Long companyId);

    /** AS-IS tdm21_role_relate_task.selectByRoloId */
    List<RoleTaskRes> selectTasksByRoleId(@Param("roleId") Long roleId);

    /** 책무의 회사 ID (없으면 null) */
    Long selectTaskCompanyId(@Param("taskId") Long taskId);

    int insertRoleTask(@Param("id") Long id, @Param("roleId") Long roleId, @Param("taskId") Long taskId);

    int deleteRoleTasks(@Param("roleId") Long roleId, @Param("ids") List<Long> ids);

    /** AS-IS tdm22_role_relate_cncl.selectByRoleId */
    List<RoleCouncilRes> selectCouncilsByRoleId(@Param("roleId") Long roleId);

    int insertRoleCouncil(@Param("id") Long id, @Param("roleId") Long roleId, @Param("row") RoleCouncilRes row);

    int updateRoleCouncil(@Param("roleId") Long roleId, @Param("row") RoleCouncilRes row);

    int deleteRoleCouncils(@Param("roleId") Long roleId, @Param("ids") List<Long> ids);

    /** AS-IS tdm23_role_relate_org.selectByRoleId */
    List<RoleOrgRes> selectOrgsByRoleId(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("roleId") Long roleId);

    /** AS-IS tdm23_role_relate_org.selectByRoleId (tdm09Yn·searchText 분기 — 담당부서 조회창) */
    List<RoleOrgLookupRes> selectOrgLookup(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("roleId") Long roleId,
                                           @Param("tdm09Yn") boolean tdm09Yn, @Param("searchText") String searchText);

    /** 조직이 로그인 회사의 기준일 조직인지 */
    int countOrg(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("orgId") Long orgId);

    int insertRoleOrg(@Param("id") Long id, @Param("roleId") Long roleId, @Param("orgId") Long orgId);

    int deleteRoleOrgs(@Param("roleId") Long roleId, @Param("ids") List<Long> ids);

    Long selectNextRelateId();
}
