package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMineRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMineSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngCond;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationNoticeTarget;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/bbs/mapper/bbs11_application.xml */
@Mapper
public interface BbsApplicationMapper {
    /** AS-IS selectByAppStatus (증명서 신청 10·11·12) */
    List<ApplicationRes> selectByAppStatus(@Param("companyId") Long companyId, @Param("appStatus") String appStatus);

    /** AS-IS selectByResultCheck (T22) */
    List<ApplicationMngRes> selectByResultCheck(@Param("cond") ApplicationMngCond cond);

    ApplicationMngRes selectById(@Param("companyId") Long companyId, @Param("applicationId") Long applicationId);

    int updateStatus(@Param("companyId") Long companyId, @Param("req") ApplicationMngSaveReq req);

    int updateContent(@Param("companyId") Long companyId, @Param("applicationId") Long applicationId, @Param("content") String content);

    String selectMobileTelNo(@Param("personId") Long personId);

    /** AS-IS selectByPersonId (Y13) */
    List<ApplicationMineRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                              @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                              @Param("appTypeCode") String appTypeCode);

    ApplicationMineRes selectMineById(@Param("companyId") Long companyId, @Param("applicationId") Long applicationId);

    Long selectNextId();

    int insertMine(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("applicationId") Long applicationId,
                   @Param("req") ApplicationMineSaveReq req);

    int updateMine(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") ApplicationMineSaveReq req);

    int updateAppStatus(@Param("companyId") Long companyId, @Param("personId") Long personId,
                        @Param("applicationId") Long applicationId, @Param("appStatus") String appStatus);

    int deleteMine(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("applicationId") Long applicationId);

    /** AS-IS emp00_trans_info.selectSmsNoticeTarget */
    List<ApplicationNoticeTarget> selectSmsNoticeTarget(@Param("companyId") Long companyId, @Param("smsNoticeCode") String smsNoticeCode);
}
