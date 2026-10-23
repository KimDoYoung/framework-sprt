package kr.co.kfs.asseterp.biz.mkt.mapper;

import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MktTargetCompanyMapper {

    /** AS-IS mkt01_target_company.selectTargetCompanyPaging — 미사용 제외(unUseYn=true), 구분 전체(`%`). searchText는 `%…%`로 감싼 값 */
    List<MktTargetRes> selectTargetCompanyPaging(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                                 @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS mkt01_target_company.selectTargetCompanyTotal */
    long selectTargetCompanyTotal(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS mkt01_target_company.selectManagerPaging — 회사 + 담당자(담당자 없는 회사도 한 줄) */
    List<MktTargetRes> selectManagerPaging(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                           @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS mkt01_target_company.selectManagerTotal */
    long selectManagerTotal(@Param("companyId") Long companyId, @Param("searchText") String searchText);
}
