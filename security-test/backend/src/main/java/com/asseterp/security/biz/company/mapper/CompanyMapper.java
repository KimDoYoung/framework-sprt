package com.asseterp.security.biz.company.mapper;

import com.asseterp.security.biz.company.dto.CompanyRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface CompanyMapper {
    Optional<CompanyRes> findByCompanyCode(@Param("companyCode") String companyCode);
    List<CompanyRes> findAllUsable();
}
