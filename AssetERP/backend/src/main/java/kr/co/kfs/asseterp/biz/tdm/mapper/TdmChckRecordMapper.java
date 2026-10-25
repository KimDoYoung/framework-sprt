package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ChckRecordRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRecordParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 이행점검 기록 (AS-IS server/tdm Tdm55_ChckRecord) */
@Mapper
public interface TdmChckRecordMapper {

    /** AS-IS tdm55_chck_record.selectByChckOrgId — 점검부서별 승인이력(exceptionTable TDM51) */
    List<ChckRecordRes> selectByChckOrgId(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm55_chck_record.selectByRelateId — 점검항목 등 연결 대상의 이력(exceptionTable NONE) */
    List<ChckRecordRes> selectByRelateId(@Param("relateId") Long relateId);

    /** 연결 대상(점검항목·미흡/개선 내역)의 회사 (없으면 null) — 권한 범위 검사용(TOBE 추가) */
    Long selectRelateCompanyId(@Param("relateId") Long relateId);

    /** AS-IS tdm55_chck_record.insert — 점검(승인) 이력 한 건 */
    int insertRecord(@Param("row") CheckRecordParam row);

    /** 점검부서의 회사 (없으면 null) — 권한 범위 검사용(TOBE 추가) */
    Long selectChckOrgCompanyId(@Param("chckOrgId") Long chckOrgId);
}
