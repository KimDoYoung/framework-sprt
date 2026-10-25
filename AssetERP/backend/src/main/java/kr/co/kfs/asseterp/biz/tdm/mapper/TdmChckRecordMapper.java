package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ChckRecordRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 이행점검 기록 (AS-IS server/tdm Tdm55_ChckRecord) */
@Mapper
public interface TdmChckRecordMapper {

    /** AS-IS tdm55_chck_record.selectByChckOrgId — 점검부서별 승인이력(exceptionTable TDM51) */
    List<ChckRecordRes> selectByChckOrgId(@Param("chckOrgId") Long chckOrgId);

    /** 점검부서의 회사 (없으면 null) — 권한 범위 검사용(TOBE 추가) */
    Long selectChckOrgCompanyId(@Param("chckOrgId") Long chckOrgId);
}
