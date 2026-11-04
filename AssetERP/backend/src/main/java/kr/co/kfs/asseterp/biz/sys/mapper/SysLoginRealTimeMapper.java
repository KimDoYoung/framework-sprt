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
}
