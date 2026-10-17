package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineTemplateRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SchDeadlineMapper {

    /** AS-IS sch03_deadline.selectByClassTreeId — 로그인 회사의 기한만(보안 보강) */
    List<Sch03DeadlineRes> selectByClassTreeId(@Param("infoId") Long infoId, @Param("companyId") Long companyId);

    /** AS-IS sch03_deadline.selectById — 저장 결과 한 행 */
    Sch03DeadlineRes selectById(@Param("deadlineId") Long deadlineId);

    /** AS-IS sys00_common.selectDeadLine — 기본 기한(회사 0·정보 0) 목록 */
    List<Sch03DeadlineTemplateRes> selectTemplates();

    /** AS-IS sch03_deadline.selectDeadlineName — 법규의 기한 이름(여럿이면 "… 외 n건") */
    String selectDeadlineName(@Param("infoId") Long infoId, @Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS sch03_deadline.insert */
    int insert(@Param("deadlineId") Long deadlineId, @Param("companyId") Long companyId, @Param("req") Sch03DeadlineSaveReq req);

    /** AS-IS Sch03_Deadline.insertModel → UpdateDataModel(sch03_deadline) UPDATE — 로그인 회사 행만 */
    int update(@Param("deadlineId") Long deadlineId, @Param("companyId") Long companyId, @Param("req") Sch03DeadlineSaveReq req);

    /** AS-IS Sch03_Deadline.updateModel — 기본 기한을 복사해 새 행으로(메모 비움·시작일 오늘) */
    int insertCopy(@Param("newId") Long newId, @Param("sourceId") Long sourceId, @Param("infoId") Long infoId,
                   @Param("companyId") Long companyId, @Param("scheduleCode") String scheduleCode);

    /** AS-IS Sch03_Deadline.delete(UpdateDataModel.deleteModel) — 로그인 회사 행만 */
    int deleteById(@Param("deadlineId") Long deadlineId, @Param("companyId") Long companyId);
}
