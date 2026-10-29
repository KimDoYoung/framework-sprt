package kr.co.kfs.asseterp.biz.org.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** AS-IS Sys99_Print.insertRdOrgState (org01_code.selectByRdBaseDate + sys99_print) — 조직기구현황 RD 출력 자료 */
@Mapper
public interface OrgStateRdMapper {
    /** AS-IS sys99_print.deleteByPersonId */
    int deleteRdPrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS org01_code.selectByRdBaseDate + sys99_print.insert (행마다 INSERT하던 것을 INSERT … SELECT 한 문장으로) → 만든 행 수 */
    int insertRdOrgState(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                         @Param("groupId") Long groupId, @Param("baseDate") LocalDate baseDate);
}
