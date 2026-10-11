package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EvaluationRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvaluationSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/emp09_evaluation.xml */
@Mapper
public interface EmpEvaluationMapper {

    List<EvaluationRes> selectEvaluations(@Param("companyId") Long companyId, @Param("personId") Long personId);

    EvaluationRes selectEvaluationById(@Param("evaluationId") Long evaluationId);

    Long selectNextEvaluationId();

    int insertEvaluation(@Param("evaluationId") Long evaluationId, @Param("companyId") Long companyId, EvaluationSaveReq req);

    int updateEvaluation(@Param("evaluationId") Long evaluationId, @Param("companyId") Long companyId, EvaluationSaveReq req);

    int deleteEvaluations(@Param("evaluationIds") List<Long> evaluationIds, @Param("companyId") Long companyId);
}
