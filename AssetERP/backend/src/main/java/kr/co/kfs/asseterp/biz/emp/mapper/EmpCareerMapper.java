package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.CareerRes;
import kr.co.kfs.asseterp.biz.emp.dto.CareerSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/Emp07_Career.java */
@Mapper
public interface EmpCareerMapper {

    List<CareerRes> selectCareers(@Param("companyId") Long companyId, @Param("personId") Long personId);

    CareerRes selectCareerById(@Param("careerId") Long careerId);

    Long selectNextCareerId();

    int insertCareer(@Param("careerId") Long careerId, @Param("companyId") Long companyId, CareerSaveReq req);

    int updateCareer(@Param("careerId") Long careerId, @Param("companyId") Long companyId, CareerSaveReq req);

    int deleteCareers(@Param("careerIds") List<Long> careerIds, @Param("companyId") Long companyId);
}
