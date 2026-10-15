package kr.co.kfs.asseterp.biz.sms.mapper;

import kr.co.kfs.asseterp.biz.sms.dto.HistoryPeriodParam;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryMonthRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryYearRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistorySearchParam;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryTotalRes;
import org.apache.ibatis.annotations.Mapper;

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
}
