package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleLastCheck;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleParam;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs15_company_rule.xml + UpdateDataModel(bbs15_company_rule) + tdm11_task_relate_rule.countRelateByRuleCode */
@Mapper
public interface BbsCompanyRuleMapper {

    List<CompanyRuleRes> selectBySearchTextManager(@Param("companyId") Long companyId, @Param("ruleType") String ruleType,
                                                   @Param("searchText") String searchText);

    CompanyRuleRes selectById(@Param("companyRuleId") Long companyRuleId);

    int countUseByCompanyRuleCode(@Param("companyId") Long companyId, @Param("companyRuleCode") String companyRuleCode,
                                  @Param("revisionNo") Long revisionNo, @Param("companyRuleId") Long companyRuleId);

    int countRelateByRuleCode(@Param("companyId") Long companyId, @Param("relateType") String relateType, @Param("ruleCode") String ruleCode);

    CompanyRuleLastCheck countLastCheck(@Param("companyId") Long companyId, @Param("companyRuleCode") String companyRuleCode);

    int countRelateTask(@Param("companyId") Long companyId, @Param("relateType") String relateType, @Param("ruleCode") String ruleCode,
                        @Param("revisionDate") String revisionDate);

    Long selectNextId();

    int insertCompanyRule(CompanyRuleParam p);

    int updateCompanyRule(CompanyRuleParam p);

    int deleteCompanyRule(@Param("companyRuleId") Long companyRuleId);

    /** bbs15_company_rule.insertRequest (내보내기) */
    int insertRequest(CompanyRuleParam p);

    /** bbs15_company_rule.excelInsert (엑셀 업로드) */
    int excelInsert(CompanyRuleParam p);
}
