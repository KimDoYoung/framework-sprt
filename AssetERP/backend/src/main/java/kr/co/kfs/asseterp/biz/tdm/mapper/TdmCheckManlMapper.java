package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 이행점검 항목 (AS-IS server/tdm Tdm52_ChckManl) */
@Mapper
public interface TdmCheckManlMapper {

    /** AS-IS tdm52_chck_manl.selectByChckOrgId (unspecYn이면 점검자 미지정만) */
    List<CheckManlRes> selectByChckOrgId(@Param("chckOrgId") Long chckOrgId, @Param("unspecYn") boolean unspecYn, @Param("searchText") String searchText);

    /** AS-IS tdm52_chck_manl.updateCheckerId — 로그인 회사 행만 */
    int updateCheckerId(@Param("chckManlId") Long chckManlId, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("updName") String updName);
}
