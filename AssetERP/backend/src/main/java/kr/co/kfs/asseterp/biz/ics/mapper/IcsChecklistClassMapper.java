package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistLClassRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistLClassSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistMClassRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistMClassSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsChecklistClassMapper {

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    // ── 대분류 (Ics21_Lookup_CheckList) ──

    /** AS-IS ics21_checklist_l_class.selectByCompanyId — 공통(0)·로그인 회사 대분류, 고객사별 설정(ics22)이 있으면 그 사용여부·종료일 */
    List<IcsChecklistLClassRes> selectLClasses(@Param("companyId") Long companyId);

    /** 저장 대상 행의 회사 (없으면 null) */
    Long selectLClassCompany(@Param("checklistLClassId") Long checklistLClassId);

    int insertLClass(@Param("checklistLClassId") Long checklistLClassId, @Param("companyId") Long companyId, @Param("req") IcsChecklistLClassSaveReq req);

    int updateLClass(@Param("companyId") Long companyId, @Param("req") IcsChecklistLClassSaveReq req);

    /** AS-IS ics22_checklist_l_class_company.insertUpdate — 고객사별 사용여부·종료일 UPSERT */
    int upsertLClassCompany(@Param("companyId") Long companyId, @Param("checklistLClassId") Long checklistLClassId, @Param("useYn") String useYn,
                            @Param("closeDate") LocalDate closeDate);

    /** AS-IS ics15_checklist_write.deleteLClassIdCheck — 이 대분류의 체크리스트를 쓴 작성 기록 수 */
    int countLClassWrites(@Param("checklistLClassId") Long checklistLClassId, @Param("companyId") Long companyId);

    int deleteLClass(@Param("checklistLClassId") Long checklistLClassId, @Param("companyId") Long companyId);

    // ── 중분류 (Ics23_TabPage_CheckList) ──

    /** AS-IS ics23_checklist_m_class.selectByCompanyId */
    List<IcsChecklistMClassRes> selectMClasses(@Param("companyId") Long companyId, @Param("checklistLClassId") Long checklistLClassId);

    Long selectMClassCompany(@Param("checklistMClassId") Long checklistMClassId);

    int insertMClass(@Param("checklistMClassId") Long checklistMClassId, @Param("companyId") Long companyId, @Param("req") IcsChecklistMClassSaveReq req);

    int updateMClass(@Param("companyId") Long companyId, @Param("req") IcsChecklistMClassSaveReq req);

    int upsertMClassCompany(@Param("companyId") Long companyId, @Param("checklistMClassId") Long checklistMClassId, @Param("useYn") String useYn,
                            @Param("closeDate") LocalDate closeDate);

    /** AS-IS ics15_checklist_write.deleteMClassIdCheck */
    int countMClassWrites(@Param("checklistMClassId") Long checklistMClassId, @Param("companyId") Long companyId);

    int deleteMClass(@Param("checklistMClassId") Long checklistMClassId, @Param("companyId") Long companyId);
}
