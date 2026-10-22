package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusCount;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsChecklistStatusMapper {

    /** AS-IS sys12_calendar.selectMonthLastDay — 그 해의 월 말일들 */
    List<LocalDate> selectMonthLastDays(@Param("companyId") Long companyId, @Param("year") String year);

    /** AS-IS sys12_calendar.selectQuarterLastDay — 그 해의 분기 말일들 */
    List<LocalDate> selectQuarterLastDays(@Param("companyId") Long companyId, @Param("year") String year);

    /** AS-IS dbConfig.getPreMonthLastDay — 지난 달 말일 */
    LocalDate selectPreMonthLastDay(@Param("stdDate") LocalDate stdDate);

    /** AS-IS dbConfig.getPreQuarterCloseDate(type '1') — 지난 분기 말일 */
    LocalDate selectPreQuarterCloseDate(@Param("stdDate") LocalDate stdDate, @Param("type") String type);

    /** AS-IS ics11_checklist_company.selectChecklistStatus — 한 기준일의 체크리스트별 미체크·미확인 건수. searchText는 '%…%'를 포함한 값 */
    List<IcsChecklistStatusCount> selectCounts(@Param("companyId") Long companyId, @Param("cycleType") String cycleType, @Param("stdDate") LocalDate stdDate,
                                               @Param("checklistLClassId") Long checklistLClassId, @Param("checklistMClassId") Long checklistMClassId,
                                               @Param("searchText") String searchText);

    /** AS-IS sys99_print.selectIcsCheckListStatus 바깥 SELECT — 기준일에 유효한 분류의 체크리스트만, 분류 순서대로 */
    List<IcsChecklistStatusOrder> selectOrder(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("ids") List<Long> ids);

    /** AS-IS ics11_checklist_company.selectByChecklistIdStatus — 한 체크리스트의 담당자별 내역 */
    List<IcsChecklistStatusDetailRes> selectByChecklistId(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("cycleType") String cycleType,
                                                          @Param("checklistId") Long checklistId, @Param("unCheckYn") boolean unCheckYn,
                                                          @Param("unConfirmYn") boolean unConfirmYn);

    /** AS-IS ics11_checklist_company.selectChecklistStatusPaging (K08) — 확인자 조건 없이 회사 전체. searchText는 '%…%'를 포함한 값이거나 null */
    List<IcsChecklistStatusDetailRes> selectPaging(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("cycleType") String cycleType,
                                                   @Param("checklistLClassId") Long checklistLClassId, @Param("checklistMClassId") Long checklistMClassId,
                                                   @Param("searchText") String searchText, @Param("unCheckYn") boolean unCheckYn,
                                                   @Param("unConfirmYn") boolean unConfirmYn, @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS ics11_checklist_company.selectChecklistStatusPagingTotal (K08) */
    long selectTotal(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("cycleType") String cycleType,
                     @Param("checklistLClassId") Long checklistLClassId, @Param("checklistMClassId") Long checklistMClassId,
                     @Param("searchText") String searchText, @Param("unCheckYn") boolean unCheckYn, @Param("unConfirmYn") boolean unConfirmYn);
}
