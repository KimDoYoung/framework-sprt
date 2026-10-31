package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.CertMappingRow;
import kr.co.kfs.asseterp.biz.emp.dto.CertRes;
import kr.co.kfs.asseterp.biz.emp.dto.CertRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/emp/mapper/emp15_cert.xml */
@Mapper
public interface EmpCertMapper {
    /** AS-IS selectByCompanyId */
    List<CertRes> selectCerts(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS dbConfig.getSeq (= f_create_seq) */
    Long selectNextId();

    /** 사원이 로그인 회사 소속인가 (TOBE 추가) */
    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS UpdateDataModel(emp15_cert) 동적 INSERT */
    int insertCert(CertRow row);

    /** AS-IS UpdateDataModel(emp15_cert) 동적 DELETE */
    int deleteCert(@Param("companyId") Long companyId, @Param("certId") Long certId);

    /** AS-IS emp15_cert.update(apprId) — 회사 조건 추가 (V22) */
    int updateApprId(@Param("companyId") Long companyId, @Param("certId") Long certId, @Param("apprId") Long apprId);

    /** 결재창 양식 치환 열 (Emp15_Tab_Cert.createMapping L418-443, V22) */
    CertMappingRow selectCertMapping(@Param("companyId") Long companyId, @Param("certId") Long certId);
}
