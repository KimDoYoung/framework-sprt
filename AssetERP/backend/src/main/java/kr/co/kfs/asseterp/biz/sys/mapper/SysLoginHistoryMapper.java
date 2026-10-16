package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.LoginHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface SysLoginHistoryMapper {

    /** AS-IS sys26_login.selectByLoginDate (companyId·loginMode는 LIKE 패턴, '%' = 전체) */
    List<LoginHistoryRes> selectByLoginDate(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                            @Param("companyId") String companyId, @Param("loginMode") String loginMode);

    /** AS-IS UpdateDataModel.deleteModel(sys26_login) — sys26_login_id로 행마다 DELETE */
    int deleteLoginHistories(@Param("ids") List<Long> ids);
}
