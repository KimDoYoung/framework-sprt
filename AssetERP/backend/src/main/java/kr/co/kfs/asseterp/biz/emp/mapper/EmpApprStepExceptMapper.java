package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EmpApprStepExceptRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpApprStepExceptSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpApprStepExceptMapper {

    List<EmpApprStepExceptRes> selectByCompanyId(@Param("companyId") Long companyId);

    EmpApprStepExceptRes selectById(@Param("companyId") Long companyId, @Param("apprStepExceptId") Long apprStepExceptId);

    long selectNextId();

    int insertApprStepExcept(@Param("companyId") Long companyId, @Param("r") EmpApprStepExceptSaveReq req);

    int updateApprStepExcept(@Param("companyId") Long companyId, @Param("r") EmpApprStepExceptSaveReq req);

    int deleteApprStepExcept(@Param("companyId") Long companyId, @Param("apprStepExceptId") Long apprStepExceptId);
}
