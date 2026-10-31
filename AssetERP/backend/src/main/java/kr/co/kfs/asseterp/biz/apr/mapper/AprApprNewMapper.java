package kr.co.kfs.asseterp.biz.apr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprGroupMemberRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewClassRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewCompanyRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewDocTypeRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewLawRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprOrgHeadRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampInfoRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepPersonRow;

/** 새 문서 열기·기본 결재선 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc.insertApproval + server/apr/Apr04_ApprStep.createApprovalTypeCd, V06) */
@Mapper
public interface AprApprNewMapper {

    long selectNextId();

    java.time.LocalDate selectToday();

    Long selectOrgCodeId(@Param("personId") Long personId);

    AprNewClassRow selectClassTree(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId);

    AprNewDocTypeRow selectDefaultDocType(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId);

    AprNewCompanyRow selectCompany(@Param("companyId") Long companyId);

    List<AprOrgHeadRow> selectOrgHeads(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("orgId") Long orgId,
                                       @Param("approvalTypeCode") String approvalTypeCode);

    AprStepPersonRow selectPersonLine(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("orgId") Long orgId);

    /** flag: comp(준법감시) | risk(위험관리) | mngm(경영관리) */
    List<AprStepPersonRow> selectOfficers(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("classTreeId") Long classTreeId,
                                          @Param("gradeCd") String gradeCd, @Param("flag") String flag);

    List<AprGroupMemberRow> selectGroupMembers(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("classTreeId") Long classTreeId);

    List<AprNewLawRes> selectIcsLines(@Param("classTreeId") Long classTreeId);

    List<AprNewLawRes> selectIcrLines(@Param("classTreeId") Long classTreeId);

    /** AS-IS apr10_stamp.selectById (V12) */
    AprStampInfoRow selectStampById(@Param("stampId") Long stampId);

    /** AS-IS apr10_stamp.checkCloseDate — 오늘이 사용기간 안이면 1 (V12) */
    int countStampOpen(@Param("stampId") Long stampId);

    /** AS-IS org10_role_stamp.checkRole — 전체사용이거나 부서에 허용된 인감이면 1 이상 (V12) */
    int countStampRole(@Param("stampId") Long stampId, @Param("orgId") Long orgId);

    /** AS-IS emp00_trans_info.selectByStampEmpId · selectOneEmpInfo — 사원의 오늘 발령 (V12) */
    AprStepPersonRow selectStampEmp(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
