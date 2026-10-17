package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceAnswerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceAnswerSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceDateRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsComplianceMapper {

    /** AS-IS ics30_compliance.groupByStartDate — 기준 적용일마다 한 행 */
    List<IcsComplianceDateRes> selectDates(@Param("companyId") Long companyId);

    /** AS-IS ics30_compliance.selectByStartDate — 그 기준 적용일의 준수항목(준수구분 코드명 포함) */
    List<IcsComplianceRes> selectByStartDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("kindCode") String kindCode);

    /** AS-IS ics30_compliance.selectByMaxCompanyId — 오늘 이전 가장 늦은 기준 적용일의 준수항목(새 기준 적용일을 만들 때 복사) */
    List<IcsComplianceRes> selectLatest(@Param("companyId") Long companyId);

    /** AS-IS ics30_compliance.insert */
    int insert(@Param("companyId") Long companyId, @Param("complianceId") Long complianceId, @Param("startDate") LocalDate startDate,
               @Param("complianceType") String complianceType, @Param("subNum") String subNum, @Param("content") String content,
               @Param("naUseYn") String naUseYn, @Param("useYn") String useYn, @Param("useCloseDate") LocalDate useCloseDate,
               @Param("note") String note, @Param("dateFixYn") String dateFixYn);

    /** AS-IS Ics30_Compliance.updateList → UpdateDataModel(ics30_compliance) UPDATE — 로그인 회사 행만 */
    int update(@Param("companyId") Long companyId, @Param("row") IcsComplianceSaveReq.Row row);

    /** AS-IS Ics30_Compliance.updateList → UpdateDataModel.deleteModel — 로그인 회사 행만 */
    int deleteById(@Param("companyId") Long companyId, @Param("complianceId") Long complianceId);

    /** AS-IS ics30_compliance.updateDateFixYn */
    int updateDateFixYn(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("dateFixYn") String dateFixYn);

    /** AS-IS ics30_compliance.deleteByDate */
    int deleteByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** AS-IS ics31_compliance_write.selectByComplianceId 건수 — 작성 기록 */
    int countWriteByComplianceId(@Param("complianceId") Long complianceId);

    /** AS-IS ics31_compliance_write.selectByStartDate 건수 — 기준 적용일 이후 작성 기록 */
    int countWriteByStartDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    // ── Ics33 준수답변 ──

    /** AS-IS ics33_compliance_answer.selectByCompanyId */
    List<IcsComplianceAnswerRes> selectAnswers(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("complianceType") String complianceType);

    /** AS-IS ics33_compliance_answer.insert — 이전 기준 적용일의 답변을 새 기준 적용일로 복사(이미 있으면 건드리지 않음) */
    int copyAnswers(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("complianceType") String complianceType);

    /** AS-IS Ics33_ComplianceAnswer.update → UpdateDataModel UPDATE — 로그인 회사 행만 */
    int updateAnswer(@Param("companyId") Long companyId, @Param("row") IcsComplianceAnswerSaveReq row);

    /** AS-IS Ics33_ComplianceAnswer.update → UpdateDataModel INSERT */
    int insertAnswer(@Param("companyId") Long companyId, @Param("row") IcsComplianceAnswerSaveReq row);

    /** AS-IS Ics33_ComplianceAnswer.delete → UpdateDataModel.deleteModel — 로그인 회사 행만 */
    int deleteAnswerById(@Param("companyId") Long companyId, @Param("complianceAnswerId") Long complianceAnswerId);

    /** AS-IS ics33_compliance_answer.deleteByDate */
    int deleteAnswersByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);
}
