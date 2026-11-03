package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.DevStepRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/scm/mapper/scm11_dev_step.xml (EE16) */
@Mapper
public interface ScmDevStepMapper {

    /** AS-IS scm11_dev_step.selectByDevId */
    List<DevStepRes> selectByDevId(@Param("devId") Long devId);

    /** AS-IS scm11_dev_step.inUpdateProgress — 있으면 순서·단계·담당자만 바꾸고, 없으면 새 번호로 넣는다 */
    int upsertProgress(@Param("devStepId") Long devStepId, @Param("devId") Long devId, @Param("devStepSeq") String devStepSeq,
                       @Param("devStepCode") String devStepCode, @Param("personId") Long personId);

    /** AS-IS scm11_dev_step.updateResult */
    int updateResult(@Param("devStepId") Long devStepId, @Param("result") String result);

    /** AS-IS Scm11_DevStep.delete (UpdateDataModel.deleteModel) */
    int deleteSteps(@Param("ids") List<Long> ids);
}
