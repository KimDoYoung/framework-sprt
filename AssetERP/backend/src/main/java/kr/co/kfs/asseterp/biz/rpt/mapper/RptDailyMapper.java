package kr.co.kfs.asseterp.biz.rpt.mapper;

import kr.co.kfs.asseterp.biz.rpt.dto.DailyConfirmRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/rpt/mapper/rpt01_daily.xml + UpdateDataModel(rpt01_daily) (Z08 Rpt01_Tab_DailyWrite) */
@Mapper
public interface RptDailyMapper {

    List<DailyRes> selectByText(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate,
                                @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText);

    DailyRes selectById(@Param("companyId") Long companyId, @Param("dailyId") Long dailyId);

    Long selectNextId();

    int insertDaily(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("dailyId") Long dailyId, @Param("req") DailySaveReq req);

    int updateDaily(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") DailySaveReq req);

    int deleteDaily(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("dailyId") Long dailyId);

    // ===== Z09 Rpt01_Tab_DailyConfirm =====

    /** AS-IS rpt01_daily.selectByConfirmText — unconfirmedOnly = 화면의 "미확인건만 조회"(AS-IS 파라미터 confirmYn), orgCodeId = 로그인 사원의 조직 */
    List<DailyConfirmRes> selectByConfirmText(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                              @Param("unconfirmedOnly") String unconfirmedOnly, @Param("orgCodeId") Long orgCodeId, @Param("searchText") String searchText);

    DailyConfirmRes selectConfirmById(@Param("companyId") Long companyId, @Param("dailyId") Long dailyId);

    int updateConfirmNote(@Param("companyId") Long companyId, @Param("dailyId") Long dailyId, @Param("confirmNote") String confirmNote);

    int updateConfirm(@Param("companyId") Long companyId, @Param("dailyId") Long dailyId, @Param("confirmYn") String confirmYn, @Param("confirmerId") Long confirmerId);

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                    @Param("groupId") long groupId, @Param("row") DailyConfirmRes row);
}
