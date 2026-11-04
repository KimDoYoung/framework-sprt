package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamData;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** ICAM 연계 배치의 asseterpdb 쪽 조회·쓰기 (ICAM 읽기는 IcamReader) */
@Mapper
public interface BatchIcamMapper {

    /** AS-IS sys01_company.selectIcamCompanyCode — companyId는 LIKE 패턴('%' 또는 숫자 문자열) */
    List<BatchIcamCompany> selectIcamCompanies(@Param("companyId") String companyId);

    /** AS-IS icam02_data.insert */
    int insertIcamData(@Param("p") BatchIcamData data);
}
