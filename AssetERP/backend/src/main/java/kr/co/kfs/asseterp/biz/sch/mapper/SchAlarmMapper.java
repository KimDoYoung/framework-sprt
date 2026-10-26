package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch06AlarmRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch06AlarmSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SchAlarmMapper {

    /** AS-IS sch06_alarm.selectByTargetId */
    List<Sch06AlarmRes> selectByTargetId(@Param("companyId") Long companyId, @Param("targetId") Long targetId);

    Sch06AlarmRes selectById(@Param("companyId") Long companyId, @Param("alarmId") Long alarmId);

    long selectNextId();

    int insertAlarm(@Param("companyId") Long companyId, @Param("alarmId") Long alarmId, @Param("req") Sch06AlarmSaveReq req);

    int updateAlarm(@Param("companyId") Long companyId, @Param("req") Sch06AlarmSaveReq req);

    int deleteAlarms(@Param("companyId") Long companyId, @Param("alarmIds") List<Long> alarmIds);
}
