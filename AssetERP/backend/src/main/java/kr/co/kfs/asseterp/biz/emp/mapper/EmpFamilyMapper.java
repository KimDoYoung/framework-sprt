package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.FamilyRes;
import kr.co.kfs.asseterp.biz.emp.dto.FamilySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/Emp06_Family.java */
@Mapper
public interface EmpFamilyMapper {

    List<FamilyRes> selectFamilies(@Param("companyId") Long companyId, @Param("personId") Long personId);

    FamilyRes selectFamilyById(@Param("familyId") Long familyId);

    Long selectNextFamilyId();

    int insertFamily(@Param("familyId") Long familyId, @Param("companyId") Long companyId, FamilySaveReq req);

    int updateFamily(@Param("familyId") Long familyId, @Param("companyId") Long companyId, FamilySaveReq req);

    int deleteFamilies(@Param("familyIds") List<Long> familyIds, @Param("companyId") Long companyId);
}
