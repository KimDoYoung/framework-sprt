package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveManageRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpEtcLeaveMapper {

    List<EtcLeaveManageRes> selectByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                         @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText);

    EtcLeaveManageRes selectById(@Param("companyId") Long companyId, @Param("etcLeaveId") Long etcLeaveId);

    Long selectNextId();

    int insertEtcLeave(@Param("companyId") Long companyId, @Param("etcLeaveId") Long etcLeaveId,
                       @Param("reason") String reason, @Param("days") Long days, @Param("startDate") LocalDate startDate,
                       @Param("closeDate") LocalDate closeDate, @Param("note") String note);

    /** clearAppr 가 true 면 상신 ID 를 비운다(임시저장 문서를 지운 경우) */
    int updateEtcLeave(@Param("companyId") Long companyId, @Param("etcLeaveId") Long etcLeaveId,
                       @Param("reason") String reason, @Param("days") Long days, @Param("startDate") LocalDate startDate,
                       @Param("closeDate") LocalDate closeDate, @Param("note") String note,
                       @Param("clearAppr") boolean clearAppr);

    /** AS-IS apr01_appr.insertApprDel — 삭제하는 결재문서를 폐기문서로 옮김 */
    int insertApprDel(@Param("apprId") Long apprId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.deleteAppr */
    int deleteAppr(@Param("apprId") Long apprId);

    int deleteEtcLeaves(@Param("companyId") Long companyId, @Param("etcLeaveIds") List<Long> etcLeaveIds);
}
