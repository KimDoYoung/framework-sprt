package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.AdminUserHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sys/mapper/sys81_admin_user_history.xml */
@Mapper
public interface SysAdminUserHistoryMapper {
    /** AS-IS selectByDate */
    List<AdminUserHistoryRes> selectByDate(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);
}
