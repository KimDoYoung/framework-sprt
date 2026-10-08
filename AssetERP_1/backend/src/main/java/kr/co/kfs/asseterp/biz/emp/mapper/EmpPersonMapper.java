package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.PersonDeleteParam;
import kr.co.kfs.asseterp.biz.emp.dto.PersonRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/emp/Emp01_Person (update / deleteTarget) */
@Mapper
public interface EmpPersonMapper {
    /** AS-IS UpdateDataModel(emp01_person) UPDATE */
    int updatePerson(PersonRow row);

    int countEmpNo(@Param("companyId") Long companyId, @Param("empNo") String empNo, @Param("personId") Long personId);

    /** AS-IS emp04_add_title.selectByPersonId (건수) */
    int countAddTitles(@Param("personId") Long personId);

    /** AS-IS emp01_person.insertEmpDel */
    int insertEmpDel(PersonDeleteParam param);

    /** AS-IS UpdateDataModel(emp01_person) DELETE */
    int deletePerson(PersonDeleteParam param);
}
