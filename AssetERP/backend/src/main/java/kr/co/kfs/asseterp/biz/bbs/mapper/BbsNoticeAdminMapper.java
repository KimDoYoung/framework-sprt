package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminInsertRow;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeHistoryRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeSmsTarget;
import kr.co.kfs.asseterp.biz.bbs.dto.TargetCompanyRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs02_notice.xml(selectByPublicYn…) · bbs04_target_company.xml · bbs09_notice_history.xml (Z04 KFS공지등록) */
@Mapper
public interface BbsNoticeAdminMapper {

    List<NoticeAdminRes> selectByPublicYnPaging(@Param("c") NoticeAdminCond cond);

    long selectByPublicYnTotal(@Param("c") NoticeAdminCond cond);

    /** 저장 뒤 한 줄 다시 읽기·존재 확인 (회사 0의 공지 종류 그룹 안) */
    NoticeAdminRes selectAdminById(@Param("c") NoticeAdminCond cond, @Param("noticeId") Long noticeId);

    Long selectNextId();

    String selectNoticeNoById(@Param("noticeId") Long noticeId);

    String getNoticeNo(@Param("companyId") Long companyId);

    int insertNotice(@Param("r") NoticeAdminInsertRow row);

    int updateNotice(@Param("r") NoticeAdminInsertRow row);

    int deleteNotice(@Param("companyId") Long companyId, @Param("noticeId") Long noticeId);

    List<TargetCompanyRes> selectTargetCompanies(@Param("noticeId") Long noticeId);

    int insertTargetCompany(@Param("id") Long id, @Param("noticeId") Long noticeId, @Param("companyId") Long companyId);

    int deleteTargetCompanies(@Param("noticeId") Long noticeId, @Param("ids") List<Long> ids);

    int deleteAllTargetCompanies(@Param("noticeId") Long noticeId);

    List<NoticeHistoryRes> selectHistories(@Param("noticeId") Long noticeId);

    int insertHistory(@Param("noticeId") Long noticeId, @Param("personId") Long personId, @Param("openYn") String openYn, @Param("notice") String notice);

    List<NoticeSmsTarget> selectSmsTargets(@Param("personIds") List<Long> personIds);
}
