package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.HrChangeRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrLookupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrNowRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRowRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmHrMapper {

    /** AS-IS tdm01_hr.selectByEndDate — 재직 중이고 책무 대상 기간이 끝나지 않은 임원 */
    List<HrLookupRes> selectByEndDate(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS tdm01_hr.selectByCompanyId — 임원 등록 목록 */
    List<HrRes> selectByCompanyId(@Param("companyId") Long companyId,
                                  @Param("exceptRetireYn") boolean exceptRetireYn,
                                  @Param("searchText") String searchText);

    /** AS-IS tdm01_hr.selectPersonModifyed — 신규·변동·제외 목록 */
    List<HrChangeRes> selectPersonModifyed(@Param("companyId") Long companyId);

    /** AS-IS emp00_trans_info.selectGetPersonByPersonId */
    HrNowRes selectGetPersonByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS tdm01_hr.selectByPersonId */
    HrRowRes selectByPersonId(@Param("personId") Long personId);

    /** AS-IS tdm01_hr.insert */
    int insertHr(@Param("companyId") Long companyId, @Param("now") HrNowRes now, @Param("updName") String updName);

    /** AS-IS tdm01_hr.updateHrChange */
    int updateHrChange(@Param("hr") HrRowRes hr, @Param("orgHeadName") String orgHeadName, @Param("updName") String updName);

    /** AS-IS tdm01_hr.updateEndDate */
    int updateEndDate(@Param("personId") Long personId, @Param("retireDate") LocalDate retireDate,
                      @Param("endDate") LocalDate endDate, @Param("updName") String updName);

    /** AS-IS tdm02_hr_record.insert */
    int insertHrRecord(@Param("companyId") Long companyId, @Param("regType") String regType,
                       @Param("personName") String personName, @Param("changeData") String changeData,
                       @Param("updName") String updName);
}
