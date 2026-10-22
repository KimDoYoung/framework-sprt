package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsChecklistConfirmMapper {

    /** AS-IS ics11_checklist_company.selectChecklistStatusPaging — 확인자가 confirmerId인 작성 대상. searchText는 '%…%'를 포함한 값 */
    List<IcsChecklistConfirmRes> selectPaging(@Param("companyId") Long companyId, @Param("confirmerId") Long confirmerId, @Param("stdDate") LocalDate stdDate,
                                              @Param("cycleType") String cycleType, @Param("checklistLClassId") Long checklistLClassId,
                                              @Param("checklistMClassId") Long checklistMClassId, @Param("searchText") String searchText,
                                              @Param("unCheckYn") boolean unCheckYn, @Param("unConfirmYn") boolean unConfirmYn,
                                              @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS ics11_checklist_company.selectChecklistStatusPagingTotal */
    long selectTotal(@Param("companyId") Long companyId, @Param("confirmerId") Long confirmerId, @Param("stdDate") LocalDate stdDate,
                     @Param("cycleType") String cycleType, @Param("checklistLClassId") Long checklistLClassId,
                     @Param("checklistMClassId") Long checklistMClassId, @Param("searchText") String searchText,
                     @Param("unCheckYn") boolean unCheckYn, @Param("unConfirmYn") boolean unConfirmYn);

    /** AS-IS ics15_checklist_write.selectByPersonId — 그 달 작성 행 id, 없으면 null */
    Long selectWriteId(@Param("companyId") Long companyId, @Param("checklistId") Long checklistId, @Param("personId") Long personId,
                       @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType);

    /** AS-IS ics15_checklist_write.updateConfirmYn — confirmYn은 'true'·'false' */
    int updateConfirm(@Param("companyId") Long companyId, @Param("checklistWriteId") Long checklistWriteId,
                      @Param("confirmerId") Long confirmerId, @Param("confirmYn") String confirmYn);

    long selectNextId();

    /** AS-IS UpdateDataModel INSERT — 작성 행이 없는 행을 확인할 때 */
    int insertConfirm(@Param("companyId") Long companyId, @Param("checklistWriteId") Long checklistWriteId, @Param("checklistId") Long checklistId,
                      @Param("yyyymm") String yyyymm, @Param("personId") Long personId, @Param("confirmerId") Long confirmerId,
                      @Param("confirmYn") String confirmYn, @Param("cycleType") String cycleType);

    /** AS-IS ics16_relate_appr.selectByConfirmerId */
    List<IcsChecklistRelateApprRes> selectRelateApprs(@Param("companyId") Long companyId, @Param("confirmerId") Long confirmerId,
                                                      @Param("stdDate") LocalDate stdDate, @Param("cycleType") String cycleType);
}
