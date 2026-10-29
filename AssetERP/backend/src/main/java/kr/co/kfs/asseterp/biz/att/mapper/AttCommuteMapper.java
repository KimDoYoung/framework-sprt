package kr.co.kfs.asseterp.biz.att.mapper;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteRes;
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
}
