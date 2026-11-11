package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRelateApprRow;
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
                                              @Param("fixYn") String fixYn, @Param("confirmYn") String confirmYn,
                                              @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS ics11_checklist_company.selectChecklistStatusPagingTotal */
    long selectTotal(@Param("companyId") Long companyId, @Param("confirmerId") Long confirmerId, @Param("stdDate") LocalDate stdDate,
                     @Param("cycleType") String cycleType, @Param("checklistLClassId") Long checklistLClassId,
                     @Param("checklistMClassId") Long checklistMClassId, @Param("searchText") String searchText,
                     @Param("fixYn") String fixYn, @Param("confirmYn") String confirmYn);

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

    /** AS-IS ics16_relate_appr.selectByCompanyId — 그 달·대분류의 상신 연결 행 */
    IcsRelateApprRow selectRelateAppr(@Param("companyId") Long companyId, @Param("checkYyyymm") String checkYyyymm,
                                      @Param("cycleType") String cycleType, @Param("checklistLClassId") Long checklistLClassId);

    /** AS-IS UpdateDataModel INSERT(ics16_relate_appr) */
    int insertRelateAppr(@Param("relateApprId") Long relateApprId, @Param("companyId") Long companyId, @Param("checkYyyymm") String checkYyyymm,
                         @Param("cycleType") String cycleType, @Param("apprId") Long apprId, @Param("confirmerId") Long confirmerId,
                         @Param("checklistLClassId") Long checklistLClassId);

    /** AS-IS ics16_relate_appr.updateApprId */
    int updateRelateApprId(@Param("companyId") Long companyId, @Param("checkYyyymm") String checkYyyymm, @Param("cycleType") String cycleType,
                           @Param("checklistLClassId") Long checklistLClassId, @Param("apprId") Long apprId);

    /** 상신 문서가 이 회사 것인지 */
    int countAppr(@Param("companyId") Long companyId, @Param("apprId") Long apprId);

    /** AS-IS apr01_appr.insertApprDel — 폐기 보관(apr99_appr_del). 이 회사 문서만 */
    int insertApprDel(@Param("companyId") Long companyId, @Param("apprId") Long apprId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.deleteAppr — 이 회사 문서만 */
    int deleteAppr(@Param("companyId") Long companyId, @Param("apprId") Long apprId);
}
