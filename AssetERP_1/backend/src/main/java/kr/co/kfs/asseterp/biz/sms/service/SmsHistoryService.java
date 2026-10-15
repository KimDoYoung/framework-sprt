package kr.co.kfs.asseterp.biz.sms.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryPeriodParam;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryMonthRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryYearRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistorySearchParam;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryTotalRes;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sms/Sms02_History.java (조회만) — 관리자 > 고객관리 화면이라 sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SmsHistoryService {

    /** AS-IS Sms02_Lookup_History.retrieve L120-135: limit 300 */
    private static final long HISTORY_LIMIT = 300L;

    private final SmsHistoryMapper mapper;

    /** AS-IS selectByTotalCount L43 */
    public List<HistoryTotalRes> selectByTotalCount(UserPrincipal user, boolean useYn) {
        requireSysAdmin(user);
        return mapper.selectByTotalCount(String.valueOf(useYn));
    }

    /** AS-IS selectByTotalCountYear L51 */
    public List<HistoryYearRes> selectByTotalCountYear(UserPrincipal user, String locName) {
        requireSysAdmin(user);
        return mapper.selectByTotalCountYear(new HistoryPeriodParam(locName, null));
    }

    /** AS-IS selectByTotalCountMonth L59 */
    public List<HistoryMonthRes> selectByTotalCountMonth(UserPrincipal user, String locName, String year) {
        requireSysAdmin(user);
        return mapper.selectByTotalCountMonth(new HistoryPeriodParam(locName, year));
    }

    /** AS-IS selectByDate L31: 검색어는 클라이언트가 "%"+값+"%"로 보냈다 → 서버가 만든다(null이면 %%) */
    public List<HistoryRes> selectByDate(UserPrincipal user, Long companyId, LocalDate startDate, LocalDate closeDate, String searchText) {
        requireSysAdmin(user);
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByDate(new HistorySearchParam(companyId, startDate, closeDate, like, HISTORY_LIMIT));
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
