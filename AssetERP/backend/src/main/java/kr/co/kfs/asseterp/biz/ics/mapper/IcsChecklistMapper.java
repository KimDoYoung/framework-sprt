package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistClassCodeRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsChecklistMapper {

    /** AS-IS ics10_checklist.selectByAdmin — 대분류·중분류 id가 null이면 전체, useYn은 '%'·'true'·'false', searchText는 %…% */
    List<IcsChecklistRes> selectByAdmin(@Param("companyId") Long companyId, @Param("checklistLClassId") Long checklistLClassId,
                                        @Param("checklistMClassId") Long checklistMClassId, @Param("useYn") String useYn,
                                        @Param("searchText") String searchText, @Param("stdDate") LocalDate stdDate);

    /** AS-IS ics10_checklist.selectById — 저장 결과 한 행 */
    IcsChecklistRes selectById(@Param("checklistId") Long checklistId, @Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Ics10_Checklist.modelUpdate → UpdateDataModel(ics10_checklist) INSERT */
    int insert(@Param("companyId") Long companyId, @Param("req") IcsChecklistSaveReq req);

    /** AS-IS Ics10_Checklist.modelUpdate → UpdateDataModel(ics10_checklist) UPDATE — 로그인 회사 행만 */
    int update(@Param("companyId") Long companyId, @Param("req") IcsChecklistSaveReq req);

    /** AS-IS ics11_checklist_company.updateUseYn — ics10 사용여부를 고객사별 설정(ics11)에도(있을 때만, 공통 회사 0 제외) */
    int updateCompanyUseYn(@Param("companyId") Long companyId, @Param("checklistId") Long checklistId, @Param("useYn") String useYn);

    /** AS-IS Ics10_Checklist.delete(UpdateDataModel.deleteModel) — 로그인 회사 행만 */
    int deleteById(@Param("checklistId") Long checklistId, @Param("companyId") Long companyId);

    /** AS-IS sys09_code.selectByIcs21 — 사용 중인 대분류 콤보 */
    List<IcsChecklistClassCodeRes> selectLCodes(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS sys09_code.selectByIcs23 — 사용 중인 중분류 콤보(대분류 id가 null이면 전체) */
    List<IcsChecklistClassCodeRes> selectMCodes(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                                                @Param("checklistLClassId") Long checklistLClassId);
}
