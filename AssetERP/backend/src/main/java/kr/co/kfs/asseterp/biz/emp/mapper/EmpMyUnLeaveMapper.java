package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.MyUnLeaveRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** Y03 연월차휴가 지정통보 (AS-IS server/emp/mapper/emp21_un_leave.xml 본인 쪽) */
@Mapper
public interface EmpMyUnLeaveMapper {

    List<MyUnLeaveRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdYear") String stdYear);

    MyUnLeaveRes selectMineById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("unLeaveId") Long unLeaveId);

    int updateExpectApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("unLeaveId") Long unLeaveId,
                           @Param("apprId") Long apprId);
}
