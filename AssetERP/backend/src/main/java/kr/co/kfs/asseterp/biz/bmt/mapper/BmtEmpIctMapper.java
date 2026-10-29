package kr.co.kfs.asseterp.biz.bmt.mapper;

import kr.co.kfs.asseterp.biz.bmt.dto.BmtEmpIctRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface BmtEmpIctMapper {

    /** AS-IS bmt12_pc_history.selectEmpICT — searchText는 '%글자%' */
    List<BmtEmpIctRes> selectEmpIct(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                                    @Param("searchText") String searchText);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId — 내 출력 자료 정리 */
    int deletePrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdEmplct — selectEmpICT 결과를 출력 자료로 */
    int insertPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                    @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText);
}
