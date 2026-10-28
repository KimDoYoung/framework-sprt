package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EvalWriteRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp44_eval_write.xml (getEvalTargetList·getEmpEvalGrade·checkEvalTarget·updateEvalGradeId) — 인사평가표 작성 */
@Mapper
public interface EmpEvalWriteMapper {
    /** AS-IS emp44_eval_write.getEvalTargetList */
    List<EvalWriteRes> selectEvalTargetList(@Param("evalListStdId") Long evalListStdId, @Param("evalTargetId") Long evalTargetId, @Param("personId") Long personId);

    /** AS-IS emp44_eval_write.getEmpEvalGrade — 내가 매긴 점수 합계의 등급 (없으면 null) */
    String selectEmpEvalGrade(@Param("evalListStdId") Long evalListStdId, @Param("evalTargetId") Long evalTargetId, @Param("personId") Long personId);

    /** AS-IS emp44_eval_write.checkEvalTarget (건수) */
    int countEvalWrite(@Param("personId") Long personId, @Param("evalTargetId") Long evalTargetId, @Param("evalListId") Long evalListId);

    /** 로그인 회사의 평가 대상자인가 (원본 SQL에는 없는 회사 조건) */
    int countTargetByCompany(@Param("evalTargetId") Long evalTargetId, @Param("companyId") Long companyId);

    /** AS-IS emp44_eval_write.updateEvalGradeId (환산점수 = 가중치 × 등급가중치, 소수 첫째 자리까지 버림) */
    int updateEvalGradeId(@Param("personId") Long personId, @Param("evalTargetId") Long evalTargetId, @Param("evalListId") Long evalListId,
                          @Param("evalGradeId") Long evalGradeId, @Param("orgHeadYn") String orgHeadYn);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS Emp44_EvalWrite.updateEvalGradeId의 INSERT 가지 (UpdateDataModel) — 환산점수 = 가중치 × 등급가중치(버림 없음) */
    int insertEvalWrite(@Param("evalWriteId") Long evalWriteId, @Param("personId") Long personId, @Param("evalTargetId") Long evalTargetId,
                        @Param("evalListId") Long evalListId, @Param("evalGradeId") Long evalGradeId, @Param("orgHeadYn") String orgHeadYn);
}
