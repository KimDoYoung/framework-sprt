package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgApprParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgApprRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgMgrRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgPeriodRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmManlOrgMapper {

    /** 부서 책무매뉴얼의 회사 (없으면 null) — 재생성·점검항목 권한 범위 검사용 */
    Long selectCompanyId(@Param("manlOrgId") Long manlOrgId);

    /** AS-IS tdm42_manl_org.selectByText (adminYn=true 고정) */
    List<ManlOrgRes> selectByText(ManlOrgParam param);

    /** AS-IS tdm42_manl_org.selectByText (Tdm42_Tab_ManlOrgAppr: useYn 화면 값, adminYn·기간 조건 없음) */
    List<ManlOrgApprRes> selectByTextAppr(ManlOrgApprParam param);

    /** AS-IS tdm42_manl_org.selectByText (Tdm42_Tab_ManlManager, N19: 부서는 화면에서 고른 값, 점검부서·점검항목 사용/미사용 건수 포함) */
    List<ManlOrgMgrRes> selectByTextMgr(ManlOrgApprParam param);

    /** AS-IS tdm42_manl_org.notManlOrgList — 로그인 회사의 부서 책무매뉴얼 중 목록(화면 그리드)에 없는 것 */
    List<ManlOrgPeriodRes> selectNotIn(@Param("companyId") Long companyId, @Param("manlOrgIds") List<Long> manlOrgIds);

    /** UpdateDataModel(tdm42_manl_org) — 화면이 바꾸는 적용시작일·적용종료일만. 회사 조건 포함, 건수를 돌려준다 */
    int updatePeriod(@Param("manlOrgId") Long manlOrgId, @Param("companyId") Long companyId,
                     @Param("startDate") String startDate, @Param("endDate") String endDate, @Param("updName") String updName);

    /** AS-IS tdm42_manl_org.updateLockYn (회사 조건 추가) */
    int updateLockYn(@Param("manlOrgId") Long manlOrgId, @Param("companyId") Long companyId,
                     @Param("lockYn") boolean lockYn, @Param("updName") String updName);
}
