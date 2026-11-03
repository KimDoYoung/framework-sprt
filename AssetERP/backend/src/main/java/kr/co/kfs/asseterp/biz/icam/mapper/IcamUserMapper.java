package kr.co.kfs.asseterp.biz.icam.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.icam.dto.IcamStopExcelRow;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopSaveReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserResultRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserResultSaveReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserSaveReq;

/** ICAM 사용자ID 관리 (AS-IS server/icam/mapper/icam55_icam_user.xml, Icam55_IcamUser, EE29) */
@Mapper
public interface IcamUserMapper {

    /** AS-IS icam55_icam_user.selectBySearchText (regType '1' = 사용자ID 신청) */
    List<IcamUserRes> selectBySearchText(@Param("searchText") String searchText, @Param("startDate") LocalDate startDate,
                                         @Param("closeDate") LocalDate closeDate, @Param("procResult") boolean procResult,
                                         @Param("regType") String regType);

    /** AS-IS icam55_icam_user.selectById */
    IcamUserRes selectById(@Param("icamUserId") Long icamUserId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** UpdateDataModel INSERT — 신청구분 '1' */
    int insertIcamUser(@Param("icamUserId") Long icamUserId, @Param("regEmpId") Long regEmpId, @Param("req") IcamUserSaveReq req);

    /** UpdateDataModel UPDATE */
    int updateIcamUser(@Param("req") IcamUserSaveReq req);

    /** AS-IS icam55_icam_user.updateApprId */
    int updateApprId(@Param("apprId") Long apprId, @Param("icamUserId") Long icamUserId);

    /** UpdateDataModel DELETE */
    int deleteIcamUser(@Param("icamUserId") Long icamUserId);

    /** AS-IS icam55_icam_user.selectByDate (EE30 처리결과 등록) */
    List<IcamUserResultRes> selectByDate(@Param("searchText") String searchText, @Param("startDate") LocalDate startDate,
                                         @Param("closeDate") LocalDate closeDate, @Param("procResult") boolean procResult,
                                         @Param("regType") String regType);

    /** UpdateDataModel UPDATE — 처리결과 그리드가 바꾸는 열 */
    int updateProcResult(@Param("req") IcamUserResultSaveReq req);

    /** AS-IS icam55_icam_user.updateResult */
    int updateResult(@Param("icamUserId") Long icamUserId, @Param("procStateCode") String procStateCode, @Param("procDate") LocalDate procDate,
                     @Param("procNote") String procNote, @Param("procEmpId") Long procEmpId);

    // ── EE31 미사용ID 권한정지 신청 (Icam55_Tab_UserStopAuthAppr) ──

    /** AS-IS icam55_icam_user.selectBySearchText (regType '2', procResult 없음) */
    List<IcamStopRes> selectStops(@Param("searchText") String searchText, @Param("startDate") LocalDate startDate,
                                  @Param("closeDate") LocalDate closeDate, @Param("regType") String regType);

    /** UpdateDataModel INSERT — 신청구분 '2', 정지 true */
    int insertStop(@Param("icamUserId") Long icamUserId, @Param("regEmpId") Long regEmpId, @Param("req") IcamStopSaveReq req);

    /** UpdateDataModel UPDATE */
    int updateStop(@Param("req") IcamStopSaveReq req);

    /** AS-IS icam55_icam_user.excelDelete */
    int excelDelete(@Param("row") IcamStopExcelRow row);

    /** AS-IS icam55_icam_user.excelInsert */
    int excelInsert(@Param("row") IcamStopExcelRow row);

    // ── EE32 미사용ID 기록관리 (Icam55_Tab_UserStopAuth) ──

    /** AS-IS icam55_icam_user.selectByProcStateCode (regType '2') */
    List<IcamStopAuthRes> selectByProcStateCode(@Param("searchText") String searchText, @Param("startDate") LocalDate startDate,
                                                @Param("closeDate") LocalDate closeDate, @Param("delTarget") boolean delTarget,
                                                @Param("procStateCode") String procStateCode);

    /** AS-IS icam55_icam_user.updateStopAuth */
    int updateStopAuth(@Param("icamUserId") Long icamUserId, @Param("delDate") LocalDate delDate, @Param("unstopDate") LocalDate unstopDate,
                       @Param("note") String note, @Param("mngEmpId") Long mngEmpId);
}
