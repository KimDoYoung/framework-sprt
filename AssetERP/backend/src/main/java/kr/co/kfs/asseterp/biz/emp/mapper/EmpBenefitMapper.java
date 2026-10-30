package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.BenefitPayRequestRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitTypeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/emp/mapper/emp17_benefit.xml + apr01_appr(insertApprDel·deleteAppr) + sys00_common.selectBenefit — 복리후생비 관리 (U05) */
@Mapper
public interface EmpBenefitMapper {
    /** AS-IS emp17_benefit.selectByText */
    List<BenefitRes> selectByText(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                  @Param("benefitCode") String benefitCode, @Param("searchText") String searchText);

    /** AS-IS emp17_benefit.selectByBenefitCode */
    List<BenefitRes> selectByBenefitCode(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("benefitCode") String benefitCode,
                                         @Param("benefitYnStr") String benefitYnStr, @Param("searchText") String searchText);

    /** AS-IS emp17_benefit.selectByYyyymm (LIMIT 1) */
    BenefitPayRequestRes selectByYyyymm(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("benefitCode") String benefitCode);

    /** payRequestApprCheck가 행마다 읽는 신청구분 코드·이름 (고른 행의 ID로) */
    List<BenefitRes> selectCodesByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS sys.Sys00_Common.selectBenefit */
    List<BenefitTypeRes> selectBenefitTypes(@Param("companyId") Long companyId);

    /** emp17_benefit.updateModel 중 지출결의 기준년월만 */
    int updatePayRequestYm(@Param("companyId") Long companyId, @Param("ids") List<Long> ids, @Param("payRequestYyyymm") String payRequestYyyymm);

    /** emp17_benefit.updateModel 중 지출결의서 상신ID만 */
    int updatePayRequestApprId(@Param("companyId") Long companyId, @Param("ids") List<Long> ids, @Param("apprId") Long apprId);

    /** UpdateDataModel(emp17_benefit) 중 지급여부만 */
    int updateBenefitYn(@Param("companyId") Long companyId, @Param("ids") List<Long> ids, @Param("benefitYn") String benefitYn);

    /** modelUpdate 중 알림 내용(비고)만 */
    int updateNote(@Param("companyId") Long companyId, @Param("benefitId") Long benefitId, @Param("note") String note);

    /** 문서폐기: 신청 문서의 상신ID와 사원 */
    BenefitRes selectById(@Param("companyId") Long companyId, @Param("benefitId") Long benefitId);

    /** AS-IS apr01_appr.insertApprDel */
    int insertApprDel(@Param("apprId") Long apprId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.deleteAppr */
    int deleteAppr(@Param("apprId") Long apprId);

    /** AS-IS emp17_benefit.deleteApprId */
    int deleteApprId(@Param("companyId") Long companyId, @Param("benefitId") Long benefitId);

    /** emp01_person.selectById 중 휴대폰번호 (sendMessage) */
    String selectMobileTelNo(@Param("personId") Long personId);
}
