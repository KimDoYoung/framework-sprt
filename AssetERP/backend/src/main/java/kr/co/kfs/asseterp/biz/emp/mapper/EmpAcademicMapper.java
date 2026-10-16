package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.AcademicRes;
import kr.co.kfs.asseterp.biz.emp.dto.AcademicSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/Emp05_Academic.java */
@Mapper
public interface EmpAcademicMapper {

    List<AcademicRes> selectAcademics(@Param("companyId") Long companyId, @Param("personId") Long personId);

    AcademicRes selectAcademicById(@Param("academicId") Long academicId);

    Long selectNextAcademicId();

    int insertAcademic(@Param("academicId") Long academicId, @Param("companyId") Long companyId, AcademicSaveReq req);

    int updateAcademic(@Param("academicId") Long academicId, @Param("companyId") Long companyId, AcademicSaveReq req);

    int deleteAcademics(@Param("academicIds") List<Long> academicIds, @Param("companyId") Long companyId);
}
