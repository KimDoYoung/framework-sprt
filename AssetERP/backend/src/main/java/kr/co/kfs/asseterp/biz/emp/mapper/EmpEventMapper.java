package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EventRes;
import kr.co.kfs.asseterp.biz.emp.dto.EventSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/emp12_event.xml */
@Mapper
public interface EmpEventMapper {

    List<EventRes> selectEvents(@Param("companyId") Long companyId, @Param("personId") Long personId);

    EventRes selectEventById(@Param("eventId") Long eventId);

    Long selectNextEventId();

    int insertEvent(@Param("eventId") Long eventId, @Param("companyId") Long companyId, EventSaveReq req);

    int updateEvent(@Param("eventId") Long eventId, @Param("companyId") Long companyId, EventSaveReq req);

    int deleteEvents(@Param("eventIds") List<Long> eventIds, @Param("companyId") Long companyId);
}
