package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp42_eval_grade.xml + UpdateDataModel(emp42_eval_grade) — 평가등급 */
@Mapper
public interface EmpEvalGradeMapper {
    /** AS-IS emp42_eval_grade.selectByEvalListStdId */
    List<EvalGradeRes> selectByEvalListStdId(@Param("evalListStdId") Long evalListStdId);

    /** AS-IS emp42_eval_grade.selectByMaxCompanyId */
    List<EvalGradeRes> selectByMaxCompanyId(@Param("companyId") Long companyId);

    /** AS-IS emp42_eval_grade.selectByMaxCompanyIdAdmin */
    List<EvalGradeRes> selectByMaxCompanyIdAdmin();

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS emp42_eval_grade.insert / UpdateDataModel INSERT */
    int insert(@Param("evalGradeId") Long evalGradeId, @Param("evalListStdId") Long evalListStdId, @Param("req") EvalGradeSaveReq.Row req);

    /** UpdateDataModel UPDATE (적용기준을 조건에 더했다) */
    int update(@Param("evalListStdId") Long evalListStdId, @Param("req") EvalGradeSaveReq.Row req);

    /** UpdateDataModel.deleteModel (ID로 DELETE, 적용기준을 조건에 더했다) */
    int deleteByIds(@Param("evalListStdId") Long evalListStdId, @Param("ids") List<Long> ids);

    /** AS-IS emp42_eval_grade.deleteByEvalListStdId */
    int deleteByEvalListStdId(@Param("evalListStdId") Long evalListStdId);
}
