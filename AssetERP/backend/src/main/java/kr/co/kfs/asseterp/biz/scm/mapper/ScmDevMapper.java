package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.DevRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRuleRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/scm/mapper/scm10_dev.xml + scm11_dev_step.xml(checkDevStep·deleteByDevId) — 개발자 그리드 (EE16) */
@Mapper
public interface ScmDevMapper {

    /** AS-IS scm10_dev.selectBySrId */
    List<DevRes> selectBySrId(@Param("srId") Long srId);

    /** 이미 있는 개발자인가 (UpdateDataModel: 있으면 UPDATE, 없으면 INSERT) */
    int countById(@Param("devId") Long devId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    int insertDev(@Param("devId") long devId, @Param("req") DevSaveReq req);

    int updateDev(@Param("req") DevSaveReq req);

    /** AS-IS scm11_dev_step.checkDevStep — 그 개발자의 진행단계 개수 */
    int countStepsByDevId(@Param("devId") Long devId);

    /** AS-IS scm12_dev_step_rule.getList */
    List<DevStepRuleRes> selectRules();

    int insertDevStep(@Param("devStepId") long devStepId, @Param("devId") Long devId, @Param("seq") String seq,
                      @Param("cd") String cd, @Param("personId") Long personId);

    /** AS-IS scm11_dev_step.deleteByDevId */
    int deleteStepsByDevId(@Param("devId") Long devId);

    /** AS-IS Scm10_Dev.delete (UpdateDataModel.deleteModel) */
    int deleteDevs(@Param("devIds") List<Long> devIds);

    /** AS-IS scm10_dev.selectByText (EE17) */
    List<DevRes> selectByText(@Param("startDate") java.time.LocalDate startDate, @Param("closeDate") java.time.LocalDate closeDate,
                              @Param("searchText") String searchText, @Param("systemCode") String systemCode,
                              @Param("devStatus") String devStatus, @Param("checkBox01") boolean checkBox01,
                              @Param("checkBoxMyDev") boolean checkBoxMyDev, @Param("personId") Long personId);

    /** AS-IS scm10_dev.updateDate (EE17) */
    int updateDate(@Param("devId") Long devId, @Param("startDate") java.time.LocalDate startDate, @Param("dueDate") java.time.LocalDate dueDate);

    /** AS-IS sys.Sys00_Common.selectDevStatus (EE17) */
    List<kr.co.kfs.asseterp.biz.scm.dto.DevStatusRes> selectDevStatus();
}
