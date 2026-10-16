package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EducationCopyReq;
import kr.co.kfs.asseterp.biz.emp.dto.EducationRes;
import kr.co.kfs.asseterp.biz.emp.dto.EducationSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/emp19_education.xml */
@Mapper
public interface EmpEducationMapper {

    List<EducationRes> selectEducations(@Param("companyId") Long companyId, @Param("personId") Long personId);

    EducationRes selectEducationById(@Param("educationId") Long educationId);

    Long selectNextEducationId();

    int insertEducation(@Param("educationId") Long educationId, EducationSaveReq req);

    int updateEducation(@Param("educationId") Long educationId, @Param("companyId") Long companyId, EducationSaveReq req);

    int deleteEducations(@Param("educationIds") List<Long> educationIds, @Param("companyId") Long companyId);

    int copyEducation(@Param("newId") Long newId, @Param("req") EducationCopyReq req,
                      @Param("personId") Long personId, @Param("companyId") Long companyId);

    int countPersonInCompany(@Param("personId") Long personId, @Param("companyId") Long companyId);
}
