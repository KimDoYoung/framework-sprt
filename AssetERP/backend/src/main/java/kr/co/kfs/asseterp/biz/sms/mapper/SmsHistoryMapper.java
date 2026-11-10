package kr.co.kfs.asseterp.biz.sms.mapper;

import kr.co.kfs.asseterp.biz.sms.dto.HistoryPeriodParam;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryMonthRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryYearRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistorySearchParam;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryTotalRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sms/mapper/sms02_history.xml */
@Mapper
public interface SmsHistoryMapper {
    /** AS-IS selectByTotalCount (useYn = 'true'/'false') */
    List<HistoryTotalRes> selectByTotalCount(String useYn);

    /** AS-IS selectByTotalCountYear */
    List<HistoryYearRes> selectByTotalCountYear(HistoryPeriodParam param);

    /** AS-IS selectByTotalCountMonth */
    List<HistoryMonthRes> selectByTotalCountMonth(HistoryPeriodParam param);

    /** AS-IS selectByDate */
    List<HistoryRes> selectByDate(HistorySearchParam param);

    /** AS-IS insert — SendSMSAPI.smsSender L339-351이 발송 성공 뒤 남기는 기록(ID는 dbConfig.getEtcSeq, 일시는 지금) */
    int insertHistory(@Param("companyId") Long companyId, @Param("content") String content, @Param("note") String note);

    /** 회사 위치(sys01_loc_nm) — AS-IS getSMSFlag(companyLoc)의 열쇠 */
    String selectCompanyLoc(@Param("companyId") Long companyId);
}
