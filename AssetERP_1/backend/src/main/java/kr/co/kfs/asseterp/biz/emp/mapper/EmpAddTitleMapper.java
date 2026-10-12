package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.AddTitleRes;
import kr.co.kfs.asseterp.biz.emp.dto.AddTitleSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/Emp04_AddTitle.java (emp04_add_title.xml + emp01/02/03·apr 매퍼 일부) */
@Mapper
public interface EmpAddTitleMapper {

    List<AddTitleRes> selectAddTitles(@Param("companyId") Long companyId, @Param("personId") Long personId);

    AddTitleRes selectAddTitleById(@Param("addTitleId") Long addTitleId, @Param("companyId") Long companyId);

    Long selectNextId();

    String selectEmpNo(@Param("personId") Long personId, @Param("companyId") Long companyId);

    int insertAddPerson(@Param("newPersonId") Long newPersonId, @Param("personId") Long personId,
                        @Param("empNo") String empNo, @Param("companyId") Long companyId);

    int insertAddTrans(@Param("transId") Long transId, @Param("personId") Long personId, @Param("req") AddTitleSaveReq req);

    int updateAddTrans(@Param("companyId") Long companyId, @Param("req") AddTitleSaveReq req);

    int insertOthersCopy(@Param("newPersonId") Long newPersonId, @Param("personId") Long personId);

    int insertAddTitle(@Param("addTitleId") Long addTitleId, @Param("addPersonId") Long addPersonId, @Param("req") AddTitleSaveReq req);

    int updateAddTitle(@Param("companyId") Long companyId, @Param("req") AddTitleSaveReq req);

    int countApprByPersonId(@Param("personId") Long personId);

    int deletePerson(@Param("personId") Long personId);

    int deleteOthers(@Param("personId") Long personId);

    int deleteTrans(@Param("personId") Long personId);

    int deleteAddTitle(@Param("addTitleId") Long addTitleId, @Param("companyId") Long companyId);
}
