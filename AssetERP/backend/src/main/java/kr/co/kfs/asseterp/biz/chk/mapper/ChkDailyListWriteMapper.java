package kr.co.kfs.asseterp.biz.chk.mapper;

import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

@Mapper
public interface ChkDailyListWriteMapper {

    /** AS-IS chk03_daily_list_write.selectByPersonId — 그 날짜 내 작성 행 */
    ChkDailyListWriteItem selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                           @Param("dailyListId") Long dailyListId, @Param("date") LocalDate date);

    /** AS-IS chk03_daily_list_write.selectById — 내 작성 행만(보안 보강) */
    ChkDailyListWriteItem selectById(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                     @Param("dailyListWriteId") Long dailyListWriteId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Chk03_DailyListWrite.updateAnswerCode / modelUpdate → UpdateDataModel INSERT */
    int insert(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("dailyListWriteId") Long dailyListWriteId,
               @Param("dailyListId") Long dailyListId, @Param("date") LocalDate date, @Param("answerCode") String answerCode);

    /** AS-IS chk03_daily_list_write.updateAnswerCode */
    int updateAnswerCode(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("dailyListWriteId") Long dailyListWriteId,
                         @Param("answerCode") String answerCode, @Param("date") LocalDate date);

    /** AS-IS Chk03_Edit_Reason.update → modelUpdate (점검결과 열) */
    int updateReason(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("dailyListWriteId") Long dailyListWriteId,
                     @Param("reason") String reason);

    /** AS-IS Chk03_Edit_Note.update → modelUpdate (비고 열) */
    int updateNote(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("dailyListWriteId") Long dailyListWriteId,
                   @Param("note") String note);
}
