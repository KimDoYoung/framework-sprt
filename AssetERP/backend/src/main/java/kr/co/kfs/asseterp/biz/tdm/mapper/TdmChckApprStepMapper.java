package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 부서 점검 승인선 (AS-IS server/tdm Tdm58_ChckApprStep) */
@Mapper
public interface TdmChckApprStepMapper {

    /** AS-IS tdm58_chck_appr_step.selectByChckOrgId */
    List<CheckApprStepRes> selectByChckOrgId(@Param("chckOrgId") Long chckOrgId);

    /** 행이 속한 부서 점검현황의 회사 (TOBE 추가 — 로그인 회사 행만 다루려고) */
    Long selectCompanyId(@Param("chckApprStepId") Long chckApprStepId);

    Long selectNextId();

    int insertApprStep(@Param("row") CheckApprStepRow row, @Param("updName") String updName);

    int updateApprStep(@Param("row") CheckApprStepRow row, @Param("updName") String updName);

    int deleteApprSteps(@Param("chckApprStepIds") List<Long> chckApprStepIds);
}
