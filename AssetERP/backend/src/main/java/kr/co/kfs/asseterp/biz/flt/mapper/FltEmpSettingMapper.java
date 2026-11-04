package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.EmpOathRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpSettingRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/flt/mapper/flt02_emp.xml(selectByPersonId) · flt04_oath.xml(selectByPersonId·updateApprId) · flt07_family_consent.xml + UpdateDataModel 저장·삭제 (EE45) */
@Mapper
public interface FltEmpSettingMapper {
    Long selectNextId();

    /** AS-IS flt02_emp.selectByPersonId */
    List<EmpSettingRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    EmpSettingRes selectById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("empId") Long empId);

    int insert(@Param("id") Long id, @Param("companyId") Long companyId, @Param("personId") Long personId,
               @Param("startDate") LocalDate startDate, @Param("yearInvestLimit") Long yearInvestLimit, @Param("checkCycle") String checkCycle);

    int update(@Param("id") Long id, @Param("companyId") Long companyId, @Param("personId") Long personId,
               @Param("startDate") LocalDate startDate, @Param("yearInvestLimit") Long yearInvestLimit, @Param("checkCycle") String checkCycle);

    int deleteByIds(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    /** AS-IS flt04_oath.selectByPersonId — 여러 행이면 화면이 마지막 행을 쓴다(정렬이 없어 시작일 순으로 정했다) */
    List<EmpOathRes> selectOathByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS flt04_oath.selectByStratDate (같은 시작일 서약서 행 수) */
    int countOathByStartDate(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("regDate") LocalDate regDate);

    /** AS-IS flt04_oath.insertApprId */
    int insertOathApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("regDate") LocalDate regDate, @Param("apprId") Long apprId);

    /** AS-IS flt04_oath.updateApprId */
    int updateOathApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("regDate") LocalDate regDate, @Param("apprId") Long apprId);

    /** 상신한 문서의 상신일 (AS-IS는 화면이 apprModel.getRegDate()를 넘겼다) */
    LocalDate selectApprRegDate(@Param("companyId") Long companyId, @Param("apprId") Long apprId);

    /** AS-IS FileUpload.uploadFlt07: 파일마다 flt07_family_consent 한 행 */
    int insertFamilyConsent(@Param("id") Long id, @Param("personId") Long personId);

    /** AS-IS flt07_family_consent.deleteByFamilyConsentId — 본인 행만 */
    int deleteFamilyConsent(@Param("id") Long id, @Param("personId") Long personId);
}
