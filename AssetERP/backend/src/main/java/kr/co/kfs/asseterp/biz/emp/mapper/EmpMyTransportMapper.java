package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.MyTransportApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpMyTransportMapper {

    List<MyTransportRes> selectByYearMonth(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("yyyymm") String yyyymm);

    MyTransportRes selectMineById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("id") Long id);

    long selectNextId();

    int insertRow(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("id") Long id, @Param("req") MyTransportSaveReq req);

    int updateRow(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") MyTransportSaveReq req);

    int deleteRow(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("id") Long id);

    // ===== Emp51_RelateAppr (본인 신청서) =====
    List<MyTransportApprRes> selectApprByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("yyyymm") String yyyymm);

    String selectCloseYn(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm);

    String selectRegNo(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("yyyymm") String yyyymm);

    int deleteAppr(@Param("companyId") Long companyId, @Param("relateApprId") Long relateApprId);

    int insertAppr(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("relateApprId") Long relateApprId,
                   @Param("yyyymm") String yyyymm, @Param("regNo") String regNo, @Param("regDate") LocalDate regDate, @Param("regAmt") Long regAmt);

    int updateApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("relateApprId") Long relateApprId,
                     @Param("apprId") Long apprId);
}
