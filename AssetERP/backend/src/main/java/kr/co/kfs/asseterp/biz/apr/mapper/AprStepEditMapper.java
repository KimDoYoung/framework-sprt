package kr.co.kfs.asseterp.biz.apr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

import kr.co.kfs.asseterp.biz.apr.dto.AprRecentDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRetouchStepRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepEmpRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepPosRes;

/** 결재선 설정 창 (AS-IS client/vi/apr/Apr04_Edit_ApprStep, V07) */
@Mapper
public interface AprStepEditMapper {

    /**
     * mode: text(selectByText, 퇴직 제외 · 이름/조직/사번/직책 포함 검색) | org(selectByOrgCodeId, 그 조직만) | all(getTransDate, 전 사원) | orgDown(getOrgCodeId, 그 조직과 includeYn이면 하위 조직)
     */
    List<AprStepEmpRes> selectEmps(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("mode") String mode,
                                   @Param("searchText") String searchText, @Param("orgCodeId") Long orgCodeId, @Param("includeYn") boolean includeYn);

    List<AprStepPosRes> selectPosCodes(@Param("companyId") Long companyId, @Param("personIds") List<Long> personIds);

    List<AprRecentDocRes> selectRecentByWeek(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("toDay") LocalDate toDay);

    List<AprRecentDocRes> selectRecentByGroup(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("searchText") String searchText);

    List<AprRetouchStepRow> selectStepList(@Param("apprId") Long apprId);

    int updateStepSeq(@Param("apprStepId") Long apprStepId, @Param("apprId") Long apprId, @Param("seq") String seq);

    int deleteStep(@Param("apprStepId") Long apprStepId, @Param("apprId") Long apprId);
}
