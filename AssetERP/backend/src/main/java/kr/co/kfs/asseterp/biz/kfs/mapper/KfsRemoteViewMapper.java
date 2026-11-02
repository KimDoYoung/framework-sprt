package kr.co.kfs.asseterp.biz.kfs.mapper;

import kr.co.kfs.asseterp.biz.kfs.dto.RemoteViewRes;
import kr.co.kfs.asseterp.biz.kfs.dto.RemoteViewSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/kfs/mapper/kfs01_remote_view.xml */
@Mapper
public interface KfsRemoteViewMapper {
    /** AS-IS selectByText — personName은 LIKE 패턴("%…%"), 기간 안, checkBox면 미입력건만 */
    List<RemoteViewRes> selectByText(@Param("companyId") Long companyId, @Param("personName") String personName,
                                     @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                     @Param("checkBox") boolean checkBox);

    /** AS-IS selectByPersonName — 기간 조건이 없다(원본 그대로) */
    List<RemoteViewRes> selectByPersonName(@Param("companyId") Long companyId, @Param("personName") String personName,
                                           @Param("checkBox") boolean checkBox);

    /** AS-IS selectById — 로그인 회사 행만 */
    RemoteViewRes selectById(@Param("remoteViewId") Long remoteViewId, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel 동적 UPDATE */
    int updateRemoteView(@Param("companyId") Long companyId, @Param("r") RemoteViewSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deleteRemoteViews(@Param("companyId") Long companyId, @Param("remoteViewIds") List<Long> remoteViewIds);

    /** AS-IS excelInsert */
    int excelInsert(@Param("companyId") Long companyId, @Param("personName") String personName, @Param("date") LocalDate date,
                    @Param("startTime") String startTime, @Param("closeTime") String closeTime);

    /** AS-IS excelDelete — 같은 사용자·일자·시작시간의 중복을 하나만 남긴다(원본은 회사 조건이 없다) */
    int excelDelete();
}
