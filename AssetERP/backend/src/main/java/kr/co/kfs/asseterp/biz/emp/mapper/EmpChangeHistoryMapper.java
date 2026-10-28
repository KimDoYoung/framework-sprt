package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryLicenseRes;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryRewardRes;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryTransRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpChangeHistoryMapper {

    List<ChangeHistoryTransRes> selectTransHistory(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                                   @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText,
                                                   @Param("empTransCode") String empTransCode);

    List<ChangeHistoryLicenseRes> selectLicenseHistory(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                                       @Param("searchText") String searchText, @Param("transCode") String transCode);

    List<ChangeHistoryRewardRes> selectRewardHistory(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                                     @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText);

    long selectNextId();

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertPrintTrans(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                         @Param("groupId") Long groupId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                         @Param("searchText") String searchText, @Param("empTransCode") String empTransCode);

    int insertPrintLicense(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                           @Param("groupId") Long groupId, @Param("startDate") LocalDate startDate,
                           @Param("searchText") String searchText, @Param("transCode") String transCode);

    int insertPrintReward(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                          @Param("groupId") Long groupId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                          @Param("searchText") String searchText);
}
