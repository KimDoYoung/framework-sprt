package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.ExceptPersonRes;
import kr.co.kfs.asseterp.biz.flt.dto.ExceptPersonSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt16_except_person.xml + UpdateDataModel(flt16_except_person) — J09 예외사원 */
@Mapper
public interface FltExceptPersonMapper {

    List<ExceptPersonRes> selectByCompanyId(@Param("companyId") Long companyId);

    ExceptPersonRes selectById(@Param("exceptPersonId") Long exceptPersonId);

    /** AS-IS countByPersonId: 같은 사원이 다른 행으로 이미 있는지 */
    int countByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("exceptPersonId") Long exceptPersonId);

    Long selectNextId();

    int insertExceptPerson(@Param("exceptPersonId") Long exceptPersonId, @Param("companyId") Long companyId, @Param("req") ExceptPersonSaveReq req);

    int updateExceptPerson(@Param("companyId") Long companyId, @Param("req") ExceptPersonSaveReq req);

    int deleteExceptPersons(@Param("companyId") Long companyId, @Param("exceptPersonIds") List<Long> exceptPersonIds);
}
