package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthClassRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthTargetRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr04_emp_auth.xml (EE08 조회권한 예외사원 등록) */
@Mapper
public interface DcrEmpAuthMapper {
    /** AS-IS dcr04_emp_auth.selectByText */
    List<DcrEmpAuthRes> selectByText(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId,
                                     @Param("searchText") String searchText);

    /** AS-IS dcr04_emp_auth.getTargetList */
    List<DcrEmpAuthTargetRes> selectTargets(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS dcr04_emp_auth.getTargetClassTreeList */
    List<DcrEmpAuthClassRes> selectTargetClassTrees(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                    @Param("searchText") String searchText);

    /** AS-IS dcr04_emp_auth.checkPerson: (사원, 문서분류) 건수 */
    int countAuth(@Param("personId") Long personId, @Param("classTreeId") Long classTreeId);

    /** AS-IS dcr04_emp_auth.updateNote */
    int updateNote(@Param("personId") Long personId, @Param("classTreeId") Long classTreeId, @Param("note") String note);

    /** AS-IS UpdateDataModel INSERT (retrieveYn은 화면이 false로 채운다) */
    int insertAuth(@Param("personId") Long personId, @Param("classTreeId") Long classTreeId, @Param("note") String note);

    /** AS-IS UpdateDataModel.deleteModel (회사 것만) */
    int deleteAuths(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    int countClassTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
