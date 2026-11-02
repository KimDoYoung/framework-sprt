package kr.co.kfs.asseterp.biz.mkt.mapper;

import kr.co.kfs.asseterp.biz.mkt.dto.MktSelectRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetItemRes;
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

    /** Z06 AS-IS mkt01_target_company.selectTargetCompanyPaging (Mkt01_Lookup_TargetCompany2) — 구분 코드 조건, 미사용 제외 */
    List<MktTargetItemRes> selectTargetCompanyItemPaging(@Param("companyId") Long companyId, @Param("itemTypeCode") String itemTypeCode,
                                                         @Param("searchText") String searchText, @Param("offset") long offset, @Param("limit") long limit);

    /** Z06 AS-IS mkt01_target_company.selectTargetCompanyTotal (구분 코드 조건) */
    long selectTargetCompanyItemTotal(@Param("companyId") Long companyId, @Param("itemTypeCode") String itemTypeCode, @Param("searchText") String searchText);

    /** AS-IS mkt01_target_company.selectManagerPaging — 회사 + 담당자(담당자 없는 회사도 한 줄) */
    List<MktTargetRes> selectManagerPaging(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                           @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS mkt01_target_company.selectManagerTotal */
    long selectManagerTotal(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** Y12 AS-IS mkt01_target_company.selectBySearchTextPaging — itemTypeCode는 `%`, favoriteYn이면 내 즐겨찾기 담당자만 */
    List<MktSelectRes> selectSelectPaging(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("itemTypeCode") String itemTypeCode,
                                          @Param("searchText") String searchText, @Param("favoriteYn") boolean favoriteYn,
                                          @Param("offset") long offset, @Param("limit") long limit);

    /** Y12 AS-IS mkt01_target_company.selectBySearchTextTotal */
    long selectSelectTotal(@Param("companyId") Long companyId, @Param("itemTypeCode") String itemTypeCode, @Param("searchText") String searchText);
}
