package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchExtrFund;
import kr.co.kfs.asseterp.biz.batch.dto.BatchExtrOfficeWork;
import kr.co.kfs.asseterp.biz.batch.dto.BatchOfficeWork;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 타사무수탁사 펀드정보(ifi30) 가져오기용 SQL — 전부 asseterpdb (ICAM 읽기 없음) */
@Mapper
public interface BatchExtrMapper {

    /** AS-IS fnd03_consignment.insert3 — 수신한 수탁사 중 회사에 없는 것을 추가. companyId·ifCode는 null이면 전체 */
    int insertConsignments(@Param("companyId") Long companyId, @Param("ifCode") String ifCode,
                           @Param("startDate") String startDate, @Param("closeDate") String closeDate);

    /** AS-IS ifi30_fund.selectOfficeWork */
    List<BatchExtrOfficeWork> selectOfficeWorks(@Param("companyId") Long companyId, @Param("ifCode") String ifCode,
                                                @Param("startDate") String startDate, @Param("closeDate") String closeDate);

    /** AS-IS fnd06_office_work.selectByExtrCode */
    List<BatchOfficeWork> selectOfficeWorkByExtrCode(@Param("companyId") Long companyId, @Param("officeWorkCode") String officeWorkCode,
                                                     @Param("ifCode") String ifCode);

    /** AS-IS fnd06_office_work.countByCode */
    int countOfficeWorkByCode(@Param("companyId") Long companyId, @Param("officeWorkCode") String officeWorkCode);

    /** AS-IS fnd06_office_work.insert3 */
    int insertOfficeWork(@Param("companyId") Long companyId, @Param("ifCode") String ifCode,
                         @Param("ifi30OfficeWorkCode") String ifi30OfficeWorkCode, @Param("officeWork") BatchOfficeWork officeWork);

    /** AS-IS ifi30_fund.selectByCompanyId */
    List<BatchExtrFund> selectFunds(@Param("companyId") Long companyId, @Param("ifCode") String ifCode,
                                    @Param("startDate") String startDate, @Param("closeDate") String closeDate);
}
