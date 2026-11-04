package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.BbsNoticeCompanyRes;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsNoticeTargetRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeInsertRow;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeMngCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeMngRes;
import kr.co.kfs.asseterp.biz.bbs.dto.TargetAddRow;
import kr.co.kfs.asseterp.biz.bbs.dto.TargetRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticePersonCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticePersonRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs02_notice.xml, bbs05_history.xml (H01 Bbs02_Tab_NoticeViewLaw) */
@Mapper
public interface BbsNoticeMapper {

    List<NoticeRes> selectByNoticeDetailCodePaging(@Param("c") NoticeCond cond);

    long selectByNoticeDetailCodeTotal(@Param("c") NoticeCond cond);

    List<NoticePersonRes> selectByPersonIdPaging(@Param("c") NoticePersonCond cond);

    long selectByPersonIdTotal(@Param("c") NoticePersonCond cond);

    // ── Z02 공지사항 등록 (Bbs02_Tab_NoticeManager·Bbs02_Edit_Notice·Bbs02_Lookup_LoadBbs) ──

    List<NoticeMngRes> selectByCompanyIdPaging(@Param("c") NoticeMngCond cond);

    long selectByCompanyIdTotal(@Param("c") NoticeMngCond cond);

    NoticeMngRes selectMngById(@Param("c") NoticeMngCond cond, @Param("noticeId") Long noticeId);

    /** 이 공지의 공지번호 (null이면 아직 번호 없음) */
    String selectNoticeNoById(@Param("companyId") Long companyId, @Param("noticeId") Long noticeId);

    /** bbs02_notice.getNoticeNo — f_create_notice_no(회사) 채번 */
    String getNoticeNo(@Param("companyId") Long companyId);

    int insertNotice(@Param("r") NoticeInsertRow row);

    int updateNotice(@Param("r") NoticeInsertRow row);

    int deleteNotice(@Param("companyId") Long companyId, @Param("noticeId") Long noticeId);

    /** emp00With(EmpTransInfoMapper)가 companyId·personId·transId·transDate를 모두 읽으므로 personId·transId는 null로 넘긴다 */
    List<TargetRes> selectTargets(@Param("companyId") Long companyId, @Param("noticeId") Long noticeId, @Param("fromDate") String fromDate,
                                  @Param("transDate") String transDate, @Param("personId") Long personId, @Param("transId") Long transId);

    int insertTarget(@Param("r") TargetAddRow row);

    int deleteTargets(@Param("noticeId") Long noticeId, @Param("targetIds") List<Long> targetIds);

    int deleteAllTargets(@Param("noticeId") Long noticeId);

    /** bbs05_history.selectByNoticeId — 이 사원이 이 공지를 이미 "그만보기" 했는지 */
    int countHistory(@Param("noticeId") Long noticeId, @Param("personId") Long personId);

    Long selectNextId();

    /** bbs05_history.insert */
    int insertHistory(@Param("historyId") Long historyId, @Param("noticeId") Long noticeId, @Param("personId") Long personId);

    /** AS-IS bbs02_notice.selectByTargetPerson — 나에게 온 읽지 않은 알림 공지 (EE55) */
    List<BbsNoticeTargetRes> selectByTargetPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS bbs05_history 날짜 갱신 (updatePersonId의 이미 있을 때) */
    void updateHistoryDate(@Param("noticeId") Long noticeId, @Param("personId") Long personId);

    /** AS-IS bbs02_notice.selectByTargetCompany — 로그인 때 뜨는 공지 목록 (EE83) */
    List<BbsNoticeCompanyRes> selectByTargetCompany(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
