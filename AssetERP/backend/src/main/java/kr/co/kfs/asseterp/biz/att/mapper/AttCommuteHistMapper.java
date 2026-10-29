package kr.co.kfs.asseterp.biz.att.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AttCommuteHistMapper {

    /** AS-IS att04_commute_hist.selectByCommuteId — 이력 ID 목록(있는지 보려는 용도) */
    List<Long> selectByCommuteId(@Param("commuteId") Long commuteId);

    /** AS-IS att04_commute_hist.insert */
    int insert(@Param("commuteId") Long commuteId, @Param("personId") Long personId, @Param("changeReason") String changeReason,
               @Param("checkInTime") LocalDate checkInTime, @Param("checkInTimeStr") String checkInTimeStr,
               @Param("checkOutTime") LocalDate checkOutTime, @Param("checkOutTimeStr") String checkOutTimeStr);

    /** AS-IS att04_commute_hist.updateTime — 출근시각이 있으면 출근만, 아니면 퇴근만(원본 choose 그대로) */
    int updateTime(@Param("commuteId") Long commuteId, @Param("personId") Long personId, @Param("changeReason") String changeReason,
                   @Param("checkInTime") LocalDate checkInTime, @Param("checkInTimeStr") String checkInTimeStr,
                   @Param("checkOutTime") LocalDate checkOutTime, @Param("checkOutTimeStr") String checkOutTimeStr);

    /** AS-IS att04_commute_hist.insertAuto */
    int insertAuto(@Param("commuteId") Long commuteId, @Param("personId") Long personId, @Param("changeReason") String changeReason);

    /** AS-IS att04_commute_hist.updateTimeAuto */
    int updateTimeAuto(@Param("commuteId") Long commuteId, @Param("personId") Long personId, @Param("changeReason") String changeReason);
}
