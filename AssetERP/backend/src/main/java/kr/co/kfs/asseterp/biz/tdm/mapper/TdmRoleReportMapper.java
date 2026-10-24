package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportAttachRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleReportRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmRoleReportMapper {

    /** 책무구조도 제출의 회사 (없으면 null) — 수정·삭제·첨부 목록의 회사 범위 검사용 */
    Long selectCompanyId(@Param("roleReportId") Long roleReportId);

    /** AS-IS tdm36_role_report.selectByDate */
    List<RoleReportRes> selectByDate(RoleReportParam param);

    /** AS-IS tdm36_role_report.getAttachList */
    List<RoleReportAttachRes> getAttachList(@Param("roleReportId") Long roleReportId);

    /** AS-IS dbConfig.getSeq */
    Long selectNextId();

    /** AS-IS UpdateDataModel 동적 INSERT (tdm36_role_report) */
    int insertRoleReport(@Param("roleReportId") Long roleReportId, @Param("companyId") Long companyId,
                         @Param("boardOpenDate") LocalDate boardOpenDate, @Param("allcStdDate") LocalDate allcStdDate, @Param("reportDate") LocalDate reportDate,
                         @Param("boardOpenLoc") String boardOpenLoc, @Param("membTotCnt") Long membTotCnt, @Param("membAttendCnt") Long membAttendCnt,
                         @Param("boardOpenAgenda") String boardOpenAgenda, @Param("membYesName") String membYesName, @Param("updName") String updName);

    /** AS-IS UpdateDataModel 동적 UPDATE (tdm36_role_report) */
    int updateRoleReport(@Param("roleReportId") Long roleReportId, @Param("companyId") Long companyId,
                         @Param("boardOpenDate") LocalDate boardOpenDate, @Param("allcStdDate") LocalDate allcStdDate, @Param("reportDate") LocalDate reportDate,
                         @Param("boardOpenLoc") String boardOpenLoc, @Param("membTotCnt") Long membTotCnt, @Param("membAttendCnt") Long membAttendCnt,
                         @Param("boardOpenAgenda") String boardOpenAgenda, @Param("membYesName") String membYesName, @Param("updName") String updName);

    /** AS-IS UpdateDataModel.deleteModel (tdm36_role_report) */
    int deleteRoleReports(@Param("companyId") Long companyId, @Param("roleReportIds") List<Long> roleReportIds);
}
