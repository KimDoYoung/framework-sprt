package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.ProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramVersionRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/scm/mapper/scm30_program.xml (Scm30_Tab_Program, EE19) */
@Mapper
public interface ScmProgramMapper {

    /** AS-IS scm30_program.selectByCompanyIdPaging */
    List<ProgramRes> selectByCompanyIdPaging(@Param("companyId") Long companyId, @Param("systemCode") String systemCode,
                                             @Param("useYn") String useYn, @Param("programType") String programType,
                                             @Param("searchText") String searchText, @Param("limit") int limit, @Param("offset") int offset);

    /** AS-IS scm30_program.selectByCompanyIdTotal */
    long selectByCompanyIdTotal(@Param("companyId") Long companyId, @Param("systemCode") String systemCode,
                                @Param("useYn") String useYn, @Param("programType") String programType,
                                @Param("searchText") String searchText);

    /** AS-IS scm30_program.selectBySystemCode — 한 프로그램의 모든 버전 */
    List<ProgramVersionRes> selectBySystemCode(@Param("companyId") Long companyId, @Param("systemCode") String systemCode,
                                               @Param("programType") String programType, @Param("programCode") String programCode);

    /** AS-IS scm30_program.selectById */
    ProgramRes selectById(@Param("programId") Long programId);

    /** UpdateDataModel(scm30_program) — 있으면 UPDATE, 없으면 INSERT (사용여부 포함) */
    int upsertProgram(@Param("programId") Long programId, @Param("systemCd") String systemCd, @Param("programType") String programType,
                      @Param("programCd") String programCd, @Param("programNm") String programNm, @Param("source") String source,
                      @Param("version") Long version, @Param("personId") Long personId, @Param("note") String note, @Param("useYn") String useYn);
}
