package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr10_stamp.xml (문서분류 인감 조회창이 쓰는 것) */
@Mapper
public interface AprStampMapper {
    /** AS-IS selectBySearchText2: 문서분류에서 제외한 인감을 빼고, 모두 사용 가능하거나 사용자 조직의 역할 인감만. searchText는 LIKE 패턴 */
    List<AprStampRes> selectBySearchText2(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId,
                                          @Param("orgId") Long orgId, @Param("searchText") String searchText);

    /** LoginUser.getOrgCodeId() 근사: 직원의 가장 최근 발령(겸직 제외) 조직. 없으면 null */
    Long selectOrgCodeId(@Param("personId") Long personId);
}
