package kr.co.kfs.asseterp.biz.rpt.mapper;

import kr.co.kfs.asseterp.biz.rpt.dto.WeekBizClassRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekCodeRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintRow;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/rpt/mapper/rpt03_week.xml·rpt04_week_confirm.xml·rpt05_week_biz_class.xml + sys09_code.selectWeekBizClass (Z11 Rpt03_Tab_WeekWrite) */
@Mapper
public interface RptWeekMapper {

    /** suggestion = true면 건의사항(업무구분 999)만, false면 999 제외 */
    List<WeekRes> selectByStartDate(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                    @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                    @Param("suggestion") boolean suggestion);

    WeekRes selectById(@Param("companyId") Long companyId, @Param("weekId") Long weekId);

    Long selectNextId();

    /** AS-IS getBeforeWeek — 직전 보고 중 가장 최근 1건 */
    WeekRes selectBeforeWeek(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate);

    /** AS-IS getLastWeek — 시작일이 한 주 전인 보고 1건 */
    WeekRes selectLastWeek(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate);

    int insertBeforeWeek(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate,
                         @Param("closeDate") LocalDate closeDate, @Param("beforeStartDate") LocalDate beforeStartDate);

    int insertWeek(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("weekId") Long weekId, @Param("req") WeekSaveReq req);

    int updateWeek(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") WeekSaveReq req);

    int updateSeq(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("weekId") Long weekId, @Param("seq") Long seq);

    int updateFix(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("weekId") Long weekId, @Param("fixYn") String fixYn);

    int updateBold(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("weekId") Long weekId, @Param("bold") String bold);

    int deleteWeek(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("weekId") Long weekId);

    /** AS-IS rpt04_week_confirm.selectByCompanyId — 확인자 ID (없으면 null) */
    Long selectConfirmerId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate);

    String selectConfirmerName(@Param("confirmerId") Long confirmerId);

    /** AS-IS sys09_code.selectWeekBizClass — 내가 사용으로 정한 업무구분 */
    List<WeekCodeRes> selectWeekBizClass(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS rpt05_week_biz_class.selectByPersonId */
    List<WeekBizClassRes> selectBizClasses(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate);

    int upsertBizClass(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("weekBizType") String weekBizType, @Param("unUseYn") String unUseYn);

    /** AS-IS rpt03_week.selectByLastStartDate */
    List<WeekPrintRow> selectPrintRows(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate);

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("row") WeekPrintRow row);
}
