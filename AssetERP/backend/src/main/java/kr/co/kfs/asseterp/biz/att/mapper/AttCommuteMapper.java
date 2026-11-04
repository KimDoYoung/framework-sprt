package kr.co.kfs.asseterp.biz.att.mapper;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteFlags;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyCommuteRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AttCommuteMapper {

    /** 로그인 회사의 출퇴근 행이면 1 (TOBE 보안 보강) */
    int countInCompany(@Param("companyId") Long companyId, @Param("commuteId") Long commuteId);

    /** AS-IS att02_commute.selectByTextAdmin — baseDate가 있으면 그날 하루, 없으면 startDate~closeDate */
    List<AttCommuteRes> selectByTextAdmin(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                          @Param("baseDate") LocalDate baseDate, @Param("startDate") LocalDate startDate,
                                          @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText);

    /** AS-IS att02_commute.adminCheck — 확인필요 표시를 NULL로 */
    int adminCheck(@Param("commuteId") Long commuteId);

    /** AS-IS att02_commute.insertBatch — 사원 한 명의 기간 출퇴근을 정책 시간으로 생성 */
    int insertBatch(@Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS att02_commute.getLastInfo — 마지막 근무일 한 건 */
    AttMyCommuteRes selectLastInfo(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS att02_commute.selectByDate — 그날의 출퇴근(상태 포함) */
    List<AttMyCommuteRes> selectByDate(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                       @Param("baseDate") LocalDate baseDate);

    /** AS-IS att02_commute.checkWorkDate — 그날 출퇴근 ID (없으면 null) */
    Long checkWorkDate(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("baseDate") LocalDate baseDate);

    /** AS-IS att02_commute.insert — 출근 */
    int insertCheckIn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("baseDate") LocalDate baseDate);

    /** AS-IS att02_commute.updateOff — 퇴근 */
    int updateOff(@Param("commuteId") Long commuteId);

    /** AS-IS att02_commute.updateOffWork — 외근 후 퇴근 */
    int updateOffWork(@Param("commuteId") Long commuteId);

    /** AS-IS att02_commute.updateReason */
    int updateReason(@Param("commuteId") Long commuteId, @Param("actionCode") String actionCode, @Param("reason") String reason);

    /** AS-IS att02_commute.updateCheckOutTime */
    int updateCheckOutTime(@Param("commuteId") Long commuteId, @Param("checkOutTime") LocalDate checkOutTime,
                           @Param("checkOutTimeStr") String checkOutTimeStr);

    /** 로그인 사원 본인의 출퇴근 행이면 1 (TOBE 보안 보강) */
    int countMine(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("commuteId") Long commuteId);

    /** 회사 근태 설정 */
    AttCommuteFlags selectCommuteFlags(@Param("companyId") Long companyId);
}
