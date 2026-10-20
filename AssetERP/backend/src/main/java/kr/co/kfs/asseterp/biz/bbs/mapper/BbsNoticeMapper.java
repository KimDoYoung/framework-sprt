package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.NoticeCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs02_notice.xml, bbs05_history.xml (H01 Bbs02_Tab_NoticeViewLaw) */
@Mapper
public interface BbsNoticeMapper {

    List<NoticeRes> selectByNoticeDetailCodePaging(@Param("c") NoticeCond cond);

    long selectByNoticeDetailCodeTotal(@Param("c") NoticeCond cond);

    /** bbs05_history.selectByNoticeId — 이 사원이 이 공지를 이미 "그만보기" 했는지 */
    int countHistory(@Param("noticeId") Long noticeId, @Param("personId") Long personId);

    Long selectNextId();

    /** bbs05_history.insert */
    int insertHistory(@Param("historyId") Long historyId, @Param("noticeId") Long noticeId, @Param("personId") Long personId);
}
