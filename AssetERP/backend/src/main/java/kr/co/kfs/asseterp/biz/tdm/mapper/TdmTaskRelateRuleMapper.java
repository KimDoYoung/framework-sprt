package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.TaskRelateRuleRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/tdm/mapper/tdm11_task_relate_rule.xml — 직무 연관규정 매핑 창 Tdm11_Lookup_TaskRelateRule (EE43) */
@Mapper
public interface TdmTaskRelateRuleMapper {

    /** AS-IS selectBySearchText: 법규('1', 시스템 코드 TdmLawCode)와 내규('2', getCompanyRule)를 이어 구분·검색어로 거른다 */
    List<TaskRelateRuleRes> selectBySearchText(@Param("companyId") Long companyId, @Param("taskId") Long taskId,
                                               @Param("relateType") String relateType, @Param("searchText") String searchText);

    /** 책무가 로그인 회사 것인지 */
    int countTask(@Param("companyId") Long companyId, @Param("taskId") Long taskId);

    /** AS-IS countUseByRuleCode: 이미 연결된 같은 규정이 있는지(새 행은 id를 -1로 비교) */
    int countUseByRuleCode(@Param("taskRelateRuleId") Long taskRelateRuleId, @Param("taskId") Long taskId,
                           @Param("relateType") String relateType, @Param("ruleCode") String ruleCode);

    long selectNextId();

    /** UpdateDataModel INSERT */
    int insertRule(@Param("id") Long id, @Param("companyId") Long companyId, @Param("taskId") Long taskId,
                   @Param("relateType") String relateType, @Param("ruleCode") String ruleCode, @Param("updName") String updName);

    /** UpdateDataModel.deleteModel — 로그인 회사의 연결만 */
    int deleteRules(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
