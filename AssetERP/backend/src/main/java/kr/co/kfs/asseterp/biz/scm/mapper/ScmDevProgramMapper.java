package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.DevProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/scm/mapper/scm13_dev_program.xml + scm30_program.xml (EE16) */
@Mapper
public interface ScmDevProgramMapper {

    /** AS-IS scm13_dev_program.selectByDevId */
    List<DevProgramRes> selectByDevId(@Param("devId") Long devId);

    long selectNextId();

    /** AS-IS scm30_program.selectByProgramCode — 시스템·구분·프로그램ID별 최신 버전 한 줄 */
    List<ProgramRes> selectByProgramCode(@Param("companyId") Long companyId, @Param("systemCode") String systemCode,
                                         @Param("programType") String programType, @Param("programCode") String programCode);

    /** scm30_program 저장 (UpdateDataModel: 있으면 UPDATE, 없으면 INSERT) */
    int upsertProgram(@Param("programId") Long programId, @Param("systemCd") String systemCd, @Param("programType") String programType,
                      @Param("programCd") String programCd, @Param("programNm") String programNm, @Param("source") String source,
                      @Param("version") Long version, @Param("personId") Long personId, @Param("note") String note);

    /** AS-IS scm30_program.updateRegDate (등록일시를 따로 바꾼다) */
    int updateRegDate(@Param("programId") Long programId, @Param("regDate") java.time.LocalDateTime regDate);

    /** scm13_dev_program 저장 (UpdateDataModel) */
    int upsertDevProgram(@Param("devProgramId") long devProgramId, @Param("devId") Long devId, @Param("programId") Long programId,
                         @Param("deployTgtYn") String deployTgtYn, @Param("deploySeq") Long deploySeq);

    /** AS-IS scm30_program.selectByTextPaging */
    List<ProgramRes> selectByTextPaging(@Param("systemCode") String systemCode, @Param("programType") String programType,
                                        @Param("searchText") String searchText, @Param("limit") int limit, @Param("offset") int offset);

    /** AS-IS scm30_program.selectByTextPagingTotal */
    long selectByTextPagingTotal(@Param("systemCode") String systemCode, @Param("programType") String programType,
                                 @Param("searchText") String searchText);
}
