package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.BizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyBizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyBizTripSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpBizTripMapper {

    List<BizTripRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                       @Param("closeDate") LocalDate closeDate, @Param("resultSkipYn") boolean resultSkipYn,
                                       @Param("searchText") String searchText);

    BizTripRes selectById(@Param("companyId") Long companyId, @Param("bizTripId") Long bizTripId);

    // ===== Y05 출장품의 및 결과보고 =====
    List<MyBizTripRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                        @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                        @Param("searchText") String searchText);

    MyBizTripRes selectMineById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bizTripId") Long bizTripId);

    long selectNextId();

    int insertBizTrip(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bizTripId") Long bizTripId,
                      @Param("req") MyBizTripSaveReq req);

    int updateBizTrip(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bizTripId") Long bizTripId,
                      @Param("req") MyBizTripSaveReq req);

    int updateApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bizTripId") Long bizTripId,
                     @Param("apprId") Long apprId);

    int updateResultApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bizTripId") Long bizTripId,
                           @Param("apprId") Long apprId);

    int updatePublicYn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bizTripId") Long bizTripId,
                       @Param("publicYn") Boolean publicYn);

    int deleteBizTrip(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bizTripId") Long bizTripId);

    int updateSkip(@Param("companyId") Long companyId, @Param("bizTripId") Long bizTripId,
                   @Param("resultSkipYn") Boolean resultSkipYn, @Param("skipReason") String skipReason);
}
