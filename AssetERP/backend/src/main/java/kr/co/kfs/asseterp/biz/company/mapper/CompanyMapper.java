package kr.co.kfs.asseterp.biz.company.mapper;

import kr.co.kfs.asseterp.biz.company.dto.CompanyRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface CompanyMapper {
    Optional<CompanyRes> findByCompanyCode(@Param("companyCode") String companyCode);
    List<CompanyRes> findAllUsable();
}
