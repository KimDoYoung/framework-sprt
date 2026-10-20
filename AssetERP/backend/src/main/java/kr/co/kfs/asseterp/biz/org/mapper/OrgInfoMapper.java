package kr.co.kfs.asseterp.biz.org.mapper;

import kr.co.kfs.asseterp.biz.org.dto.OrgInfoRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoSearchParam;
import kr.co.kfs.asseterp.biz.org.dto.OrgTdmRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/org/mapper/org00_org_info.xml */
@Mapper
public interface OrgInfoMapper {
    /** AS-IS selectByKorName */
    List<OrgInfoRes> searchOrgInfos(OrgInfoSearchParam param);

    /** AS-IS selectByOrgCodeId */
    OrgInfoRes selectOrgInfo(OrgInfoSearchParam param);

    /** AS-IS org00_org_info.selectByIgnoreStamp (G06) — 사용자 조직의 인감무시(ignore_stamp) 행 수. 회사관리자(personId 0 이하)는 조직이 없어 0 */
    int countIgnoreStamp(@Param("personId") Long personId);

    /** AS-IS org00_org_info.selectByTdmYn — 책무 대상 조직(tdm_yn). searchText는 LIKE 패턴 */
    List<OrgTdmRes> selectByTdmYn(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText);
}
