package kr.co.kfs.asseterp.biz.icam.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
}
