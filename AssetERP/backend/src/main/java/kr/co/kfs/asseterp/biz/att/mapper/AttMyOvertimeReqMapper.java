package kr.co.kfs.asseterp.biz.att.mapper;

import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeInfoRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeReqRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimePolicyRow;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeTimeConfigRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 연장근무신청 창(Att03_Lookup_OvertimeReq) — 내 신청만 다룬다 */
@Mapper
public interface AttMyOvertimeReqMapper {

    /** AS-IS att03_overtime_req.selectByPersonId */
    List<AttMyOvertimeReqRes> selectByPersonId(@Param("personId") Long personId, @Param("baseDate") LocalDate baseDate);

    /** 저장·삭제 검사용 — 내 신청 몇 건 (상태 포함) */
    List<AttMyOvertimeReqRes> selectByIds(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    /** AS-IS att03_overtime_req.notInOvertimeReqIdList */
    List<AttMyOvertimeReqRes> notInOvertimeReqIdList(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    /** AS-IS att03_overtime_req.selectByYearMonth — 근무일자(yyyy-MM-dd) 목록 */
    List<String> selectWorkDatesByYearMonth(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("yyyyMM") String yyyyMM);

    /** AS-IS att03_overtime_req.getInfo */
    AttMyOvertimeInfoRes getInfo(@Param("personId") Long personId, @Param("baseDate") LocalDate baseDate);

    /** AS-IS att01_work_policy.getModel(useYn true, startDate) — 정책 목록 */
    List<AttMyOvertimePolicyRow> selectPolicies(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate);

    /** AS-IS pay34_work_time_config.getModel — 없으면 null */
    AttMyOvertimeTimeConfigRow selectTimeConfig(@Param("companyId") Long companyId);

    /** AS-IS att05_pm_work.getWorkDateInfo — 결재 중·완료 오후근무 건수 */
    int countPmWorkOnDate(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("workDate") LocalDate workDate);

    Long selectNextId();

    int update(@Param("overtimeReqId") Long overtimeReqId, @Param("companyId") Long companyId, @Param("personId") Long personId,
               @Param("workDate") LocalDate workDate, @Param("overtimeMin") Long overtimeMin, @Param("reason") String reason,
               @Param("workTypeCode") String workTypeCode, @Param("workRewardTypeCode") String workRewardTypeCode);

    int insert(@Param("overtimeReqId") Long overtimeReqId, @Param("companyId") Long companyId, @Param("personId") Long personId,
               @Param("workDate") LocalDate workDate, @Param("overtimeMin") Long overtimeMin, @Param("reason") String reason,
               @Param("workTypeCode") String workTypeCode, @Param("workRewardTypeCode") String workRewardTypeCode);

    int delete(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    int updateApprId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                     @Param("overtimeReqId") Long overtimeReqId, @Param("apprId") Long apprId);
}
