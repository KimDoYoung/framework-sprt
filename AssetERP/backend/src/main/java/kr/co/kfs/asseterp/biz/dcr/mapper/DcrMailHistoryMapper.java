package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailFileRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr10_mail_history.xml + server/sys/mapper/sys10_file.xml(selectMailFileHistory) */
@Mapper
public interface DcrMailHistoryMapper {

    List<DcrMailHistoryRes> selectBySenderEmail(@Param("empId") Long empId, @Param("startDate") String startDate, @Param("endDate") String endDate,
                                                @Param("titleText") String titleText, @Param("fundId") Long fundId, @Param("mailGubun") String mailGubun);

    List<DcrMailFileRes> selectMailFileHistory(@Param("empId") Long empId, @Param("mailHistoryId") Long mailHistoryId);
}
