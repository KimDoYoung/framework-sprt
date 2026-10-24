package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmCompanyParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmCompanyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmRoleDigmMapper {

    /** 책무체계도의 회사 (없으면 null) — 재생성 권한 범위 검사용 */
    Long selectCompanyId(@Param("roleDigmId") Long roleDigmId);

    /** AS-IS tdm32_role_digm.selectByRegDateAdmin */
    List<RoleDigmRes> selectByRegDateAdmin(RoleDigmParam param);

    /** AS-IS tdm33_role_digm_file.selectByFileType — 파일정보 ID들(화면은 첫 건) */
    List<Long> selectFileIdByFileType(@Param("roleDigmId") Long roleDigmId, @Param("fileType") String fileType);

    /** AS-IS tdm32_role_digm.selectByRegDate (N13 책무체계도 작성) */
    List<RoleDigmCompanyRes> selectByRegDate(RoleDigmCompanyParam param);

    /** AS-IS Tdm33_RoleDigmFile.fileCheck — 조회 범위의 책무체계도 중 첨부(sys10_file)가 없는 파일정보 행을 지운다 */
    int deleteFileInfoWithoutFile(RoleDigmCompanyParam param);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    /** AS-IS UpdateDataModel 동적 INSERT (tdm32_role_digm) */
    int insertRoleDigm(@Param("roleDigmId") Long roleDigmId, @Param("companyId") Long companyId, @Param("regDate") LocalDate regDate,
                       @Param("allcStdDate") LocalDate allcStdDate, @Param("reasonCode") String reasonCode, @Param("updName") String updName);

    /** AS-IS UpdateDataModel 동적 UPDATE (tdm32_role_digm) */
    int updateRoleDigm(@Param("roleDigmId") Long roleDigmId, @Param("companyId") Long companyId, @Param("regDate") LocalDate regDate,
                       @Param("allcStdDate") LocalDate allcStdDate, @Param("reasonCode") String reasonCode, @Param("updName") String updName);

    /** AS-IS UpdateDataModel.deleteModel (tdm32_role_digm) */
    int deleteRoleDigms(@Param("companyId") Long companyId, @Param("roleDigmIds") List<Long> roleDigmIds);

    /** AS-IS tdm33_role_digm_file.insertByRoleDigmId */
    int insertFileInfo(@Param("roleDigmFileId") Long roleDigmFileId, @Param("roleDigmId") Long roleDigmId, @Param("fileType") String fileType);

    /** AS-IS tdm33_role_digm_file.selectByFileType 로 찾은 파일정보 행에 붙은 첨부(sys10_file) ID들 */
    List<Long> selectAttachIdByFileType(@Param("roleDigmId") Long roleDigmId, @Param("fileType") String fileType);

    /** AS-IS tdm33_role_digm_file.deleteByRoleDigmId */
    int deleteFileInfo(@Param("roleDigmId") Long roleDigmId, @Param("fileType") String fileType);
}
