package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcPersonRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescCompanyParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescCompanyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmRoleDescMapper {

    /** 책무기술서의 회사 (없으면 null) — 재생성 권한 범위 검사용 */
    Long selectCompanyId(@Param("roleDescId") Long roleDescId);

    /** AS-IS tdm31_role_desc.selectByRegDateAdmin */
    List<RoleDescRes> selectByRegDateAdmin(RoleDescParam param);

    /** AS-IS tdm31_role_desc.selectByRegDate — 로그인 회사의 책무기술서 */
    List<RoleDescCompanyRes> selectByRegDate(RoleDescCompanyParam param);

    /** AS-IS dbConfig.getSeq */
    Long selectNextId();

    /** AS-IS UpdateDataModel 동적 INSERT (tdm31_role_desc) */
    int insertRoleDesc(@Param("roleDescId") Long roleDescId, @Param("companyId") Long companyId, @Param("regDate") LocalDate regDate,
                       @Param("reasonCode") String reasonCode, @Param("personId") Long personId, @Param("roleAllcId") Long roleAllcId,
                       @Param("allcStdDate") LocalDate allcStdDate, @Param("updName") String updName);

    /** AS-IS UpdateDataModel 동적 UPDATE (tdm31_role_desc) — 화면이 고치는 생성일·생성사유 */
    int updateRoleDesc(@Param("roleDescId") Long roleDescId, @Param("companyId") Long companyId, @Param("regDate") LocalDate regDate,
                       @Param("reasonCode") String reasonCode, @Param("updName") String updName);

    /** 책무기술서 첨부(sys10_file) 행 삭제 */
    int deleteFilesByParentIds(@Param("roleDescIds") List<Long> roleDescIds);

    /** AS-IS UpdateDataModel.deleteModel (tdm31_role_desc) */
    int deleteRoleDescs(@Param("companyId") Long companyId, @Param("roleDescIds") List<Long> roleDescIds);

    /** AS-IS tdm31_role_desc.selectByParentId — 1분 안에 작업 중이면 1, 아니면 0 */
    int countWorking(@Param("roleDescId") Long roleDescId);

    /** AS-IS tdm30_role_allc.selectPerson */
    List<RoleAllcPersonRes> selectPerson(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText);
}
