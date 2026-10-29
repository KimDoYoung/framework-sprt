package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprCorpStampRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampManageRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr10_stamp.xml (문서분류 인감 조회창이 쓰는 것) */
@Mapper
public interface AprStampMapper {
    /** AS-IS selectBySearchText2: 문서분류에서 제외한 인감을 빼고, 모두 사용 가능하거나 사용자 조직의 역할 인감만. searchText는 LIKE 패턴 */
    List<AprStampRes> selectBySearchText2(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId,
                                          @Param("orgId") Long orgId, @Param("searchText") String searchText);

    /** AS-IS selectBySearchText (G06 Apr10_Lookup_Stamp, flag=true): 모두 사용 가능하거나 사용자 조직에 역할로 준 인감. searchText는 LIKE 패턴 */
    List<AprStampRes> selectBySearchText(@Param("companyId") Long companyId, @Param("orgId") Long orgId, @Param("searchText") String searchText);

    /** AS-IS selectByCodeName (G07 Apr10_Tab_Stamp): 회사의 모든 인감 */
    List<AprStampManageRes> selectByCodeName(@Param("companyId") Long companyId);

    /** 저장한 한 행 (AS-IS update 뒤 retrieve) */
    AprStampManageRes selectManageById(@Param("companyId") Long companyId, @Param("stampId") Long stampId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Apr10_Stamp.update → UpdateDataModel INSERT (G07) */
    int insertStamp(@Param("companyId") Long companyId, @Param("r") AprStampSaveReq req);

    /** AS-IS Apr10_Stamp.update → UpdateDataModel UPDATE (G07) */
    int updateStamp(@Param("companyId") Long companyId, @Param("r") AprStampSaveReq req);

    /** AS-IS Apr10_Stamp.delete → UpdateDataModel DELETE (G07) */
    int deleteStamp(@Param("companyId") Long companyId, @Param("stampId") Long stampId);

    /** LoginUser.getOrgCodeId() 근사: 직원의 가장 최근 발령(겸직 제외) 조직. 없으면 null */
    Long selectOrgCodeId(@Param("personId") Long personId);

    /** AS-IS apr10_stamp.selectCorpStampYn — 기준일에 쓸 수 있는 법인인감(여러 개면 첫 번째가 기본값) */
    List<AprCorpStampRes> selectCorpStamps(@Param("companyId") Long companyId, @Param("stdDate") java.time.LocalDate stdDate);
}
