package kr.co.kfs.asseterp.biz.sms.mapper;

import kr.co.kfs.asseterp.biz.sms.dto.SmsAlarmHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sms/mapper/sms10_alarm_history.xml (selectByText) */
@Mapper
public interface SmsAlarmHistoryMapper {

    /** AS-IS sms10_alarm_history.selectByText — inOutYn 'in' 받은 알림 / 'out' 보낸 알림, searchText는 LIKE 패턴 */
    List<SmsAlarmHistoryRes> selectByText(@Param("personId") Long personId, @Param("inOutYn") String inOutYn,
                                          @Param("searchText") String searchText,
                                          @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);
}
