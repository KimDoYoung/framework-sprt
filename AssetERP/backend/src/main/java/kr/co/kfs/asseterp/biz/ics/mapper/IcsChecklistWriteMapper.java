package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteItem;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsChecklistWriteMapper {

    /** AS-IS Sys01_Company.selectById 중 sys01_ics_check_cycle_type — M(월)/Q(분기), 없으면 null */
    String selectCycleType(@Param("companyId") Long companyId);

    /** AS-IS ics10_checklist.selectByPersonId — 내가 담당(작성그룹 공유)인 사용 중 체크리스트 + 그 달 내 작성 내역. checkBox면 답변 없는 항목만 */
    List<IcsChecklistWriteRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate,
                                                @Param("checklistLClassId") Long checklistLClassId, @Param("checklistMClassId") Long checklistMClassId,
                                                @Param("searchText") String searchText, @Param("checkBox") boolean checkBox, @Param("cycleType") String cycleType);

    /** AS-IS ics15_checklist_write.selectById — 내 작성 행만 */
    IcsChecklistWriteItem selectById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("checklistWriteId") Long checklistWriteId);

    /** AS-IS ics15_checklist_write.selectByPersonId — 한 체크리스트의 그 달 작성 행 */
    IcsChecklistWriteItem selectByChecklist(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("checklistId") Long checklistId,
                                            @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType);

    /** AS-IS ics15_checklist_write.selectWrite — 삭제 전 확인용(그 달 내 작성 행 전부) */
    List<IcsChecklistWriteItem> selectWrite(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate,
                                            @Param("cycleType") String cycleType);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Ics15_ChecklistWrite.updateAnswerCode / modelUpdate(INSERT) — 작성 행 추가 */
    int insert(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("checklistWriteId") Long checklistWriteId,
               @Param("checklistId") Long checklistId, @Param("yyyymm") String yyyymm, @Param("answerCode") String answerCode,
               @Param("cycleType") String cycleType);

    /** AS-IS ics15_checklist_write.updateAnswerCode — 내 작성 행만 */
    int updateAnswerCode(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("checklistWriteId") Long checklistWriteId,
                         @Param("answerCode") String answerCode);

    /** AS-IS Ics15_Edit_Reason.update → modelUpdate(UPDATE) — 사유만 바뀐다 */
    int updateReason(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("checklistWriteId") Long checklistWriteId,
                     @Param("reason") String reason);

    /** AS-IS ics15_checklist_write.updateFixYn — 내 작성 행만 */
    int updateFixYn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("checklistWriteId") Long checklistWriteId,
                    @Param("fixYn") String fixYn);

    /** AS-IS UpdateDataModel.deleteModel(ics15_checklist_write) — 내 작성 행만 */
    int deleteById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("checklistWriteId") Long checklistWriteId);
}
