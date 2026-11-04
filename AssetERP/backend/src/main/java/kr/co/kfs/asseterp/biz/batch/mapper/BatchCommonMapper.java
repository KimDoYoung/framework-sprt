package kr.co.kfs.asseterp.biz.batch.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

import kr.co.kfs.asseterp.biz.batch.dto.BatchCompany;

/** 배치 작업이 함께 쓰는 조회 (AS-IS: sys01_company.selectByUseYn, sys12_calendar.bizDate) */
@Mapper
public interface BatchCommonMapper {

    /** 사용 중인 회사(ID 순). AS-IS와 같은 조건 */
    List<BatchCompany> selectUseCompanies();

    /** f_get_biz_date(회사, 기준일, 이동 일수) — 영업일 */
    LocalDate selectBizDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("type") String type);
}
