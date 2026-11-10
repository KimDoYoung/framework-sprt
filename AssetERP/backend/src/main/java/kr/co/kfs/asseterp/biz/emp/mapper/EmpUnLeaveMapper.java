package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveEtcRange;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveNoticeRow;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveSmsTarget;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface EmpUnLeaveMapper {

    List<UnLeaveRes> selectYearList(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                                    @Param("unLeaveCode") String unLeaveCode);

    List<UnLeaveRes> selectMonthList(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                                     @Param("unLeaveCode") String unLeaveCode);

    int insertYear(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                   @Param("unLeaveCode") String unLeaveCode);

    int insertMonth(@Param("companyId") Long companyId, @Param("stdYear") String stdYear);

    int updateUnLeave(@Param("companyId") Long companyId, @Param("unLeaveId") Long unLeaveId,
                      @Param("totalDays") Double totalDays, @Param("useDays") Double useDays,
                      @Param("remainDays") Double remainDays);

    int deleteUnLeaves(@Param("companyId") Long companyId, @Param("unLeaveIds") List<Long> unLeaveIds);

    // ───── [문자발송] ─────

    List<UnLeaveSmsTarget> selectSmsTargets(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    // ───── V39 [상신] ─────

    List<UnLeaveNoticeRow> selectNoticeYear(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                                            @Param("unLeaveCode") String unLeaveCode, @Param("ids") List<Long> ids);

    List<UnLeaveNoticeRow> selectNoticeMonth(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                                             @Param("unLeaveCode") String unLeaveCode, @Param("ids") List<Long> ids);

    String selectLeaveMonthCode(@Param("companyId") Long companyId);

    List<LocalDate> selectWorkDays(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                   @Param("closeDate") LocalDate closeDate);

    List<UnLeaveEtcRange> selectEtcLeaveRanges(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                               @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    long selectNextId();

    int insertNoticeAppr(@Param("apprId") Long apprId, @Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId,
                         @Param("classTreeId") Long classTreeId, @Param("regDate") LocalDateTime regDate,
                         @Param("effectDate") LocalDateTime effectDate, @Param("statusCode") String statusCode,
                         @Param("inOutTypeCode") String inOutTypeCode, @Param("title") String title,
                         @Param("content") String content);

    int insertNoticeStep(@Param("apprStepId") Long apprStepId, @Param("apprId") Long apprId,
                         @Param("stepTypeCode") String stepTypeCode, @Param("seq") String seq,
                         @Param("stepStatusCode") String stepStatusCode, @Param("apprDate") LocalDateTime apprDate,
                         @Param("stepEmpId") Long stepEmpId, @Param("apprEmpId") Long apprEmpId);

    int updateNoticeApprId(@Param("companyId") Long companyId, @Param("unLeaveId") Long unLeaveId,
                           @Param("apprId") Long apprId);
}
