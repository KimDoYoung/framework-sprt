package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.DirectorRes;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/emp31_director.xml + sys99_print (insertRdDirector01·02) */
@Mapper
public interface EmpDirectorMapper {

    List<DirectorRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText, @Param("endCheck") boolean endCheck);

    /** selectByPersonId: 사원의 emp31_director 행 ID (없으면 null) */
    Long selectDirectorIdByPersonId(@Param("personId") Long personId);

    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    long selectNextId();

    int insertDirector(DirectorRow row);

    int updateDirector(DirectorRow row);

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertPrintSenior(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                          @Param("groupId") Long groupId, @Param("searchText") String searchText, @Param("endCheck") boolean endCheck,
                          @Param("personList") List<Long> personList);

    int insertPrintTotal(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                         @Param("groupId") Long groupId, @Param("searchText") String searchText, @Param("endCheck") boolean endCheck);
}
