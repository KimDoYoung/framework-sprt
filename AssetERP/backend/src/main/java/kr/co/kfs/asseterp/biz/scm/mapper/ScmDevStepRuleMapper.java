package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.DevStepRuleRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/scm/mapper/scm12_dev_step_rule.xml (EE16) */
@Mapper
public interface ScmDevStepRuleMapper {

    /** AS-IS scm12_dev_step_rule.getList */
    List<DevStepRuleRes> getList();

    /** UpdateDataModel — 있으면 UPDATE, 없으면 새 번호로 INSERT */
    int upsert(@Param("id") Long id, @Param("seq") String seq, @Param("cd") String cd);

    int delete(@Param("ids") List<Long> ids);
}
