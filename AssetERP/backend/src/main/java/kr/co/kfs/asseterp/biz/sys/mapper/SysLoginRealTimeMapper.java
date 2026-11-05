package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.LoginRealTimeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys28_login_real_time.xml (selectByDate) */
@Mapper
public interface SysLoginRealTimeMapper {

    /** AS-IS sys28_login_real_time.selectByDate — 내 접속 기록 중 현재 시각 ±10분 */
    List<LoginRealTimeRes> selectByDate(@Param("personId") Long personId);

    /** AS-IS sys28_login_real_time.selectByPersonId (건수만) */
    int countByPersonIp(@Param("personId") Long personId, @Param("ipAddress") String ipAddress);

    /** AS-IS sys28_login_real_time.updateInfo */
    int updateInfo(@Param("personId") Long personId, @Param("ipAddress") String ipAddress);

    /** AS-IS sys28_login_real_time.insertInfo */
    int insertInfo(@Param("personId") Long personId, @Param("ipAddress") String ipAddress);
}
