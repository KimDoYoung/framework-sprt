package kr.co.kfs.asseterp.biz.att.mapper;

import kr.co.kfs.asseterp.biz.att.dto.AttPmWorkRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/att/mapper/att05_pm_work.xml (selectByWorkDate · notInPmWorkIdList · update · delete · updateApprId) */
@Mapper
public interface AttPmWorkMapper {

    /** AS-IS selectByWorkDate */
    List<AttPmWorkRes> selectByWorkDate(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("workDate") LocalDate workDate);

    /** AS-IS selectById 성격 — 저장·삭제 전 상태 확인용(내 것만) */
    List<AttPmWorkRes> selectByIds(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    /** AS-IS notInPmWorkIdList — 화면에 없는 내 오후근무 */
    List<AttPmWorkRes> notInPmWorkIdList(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    /** AS-IS att03_overtime_req.selectByPersonId(baseDate) — 그날 연장근무 신청 건수 */
    int countOvertimeByDate(@Param("personId") Long personId, @Param("baseDate") LocalDate baseDate);

    Long selectNextId();

    /** AS-IS UpdateDataModel: ID가 DB에 있으면 UPDATE */
    int update(@Param("pmWorkId") Long pmWorkId, @Param("workDate") LocalDate workDate, @Param("reason") String reason);

    /** AS-IS UpdateDataModel: ID가 DB에 없으면 INSERT */
    int insert(@Param("pmWorkId") Long pmWorkId, @Param("companyId") Long companyId, @Param("personId") Long personId,
               @Param("workDate") LocalDate workDate, @Param("reason") String reason);

    int delete(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    /** 상신 문서 ID를 행에 기록 (Att05_Lookup_PmWork.updateApprId → att.Att05_PmWork.update) */
    int updateApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("pmWorkId") Long pmWorkId, @Param("apprId") Long apprId);
}
