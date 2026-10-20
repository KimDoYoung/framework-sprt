package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeRes;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsNoticeMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/bbs/Bbs02_Notice.java · Bbs05_History.java (H01 법규공지) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsNoticeService {

    private final BbsNoticeMapper mapper;

    /** AS-IS Bbs02_Notice.selectByNoticeDetailCodePaging L143. 검색어는 서비스가 %…%로 만든다(빈 글자면 %%) */
    public PageRes<NoticeRes> searchByNoticeDetailCode(UserPrincipal user, String noticeType, String noticeDetailCode, String searchText,
                                                       long offset, long limit) {
        NoticeCond cond = new NoticeCond(user.getCompanyId(), noticeType, noticeDetailCode,
                "%" + (searchText == null ? "" : searchText) + "%", limit, offset);
        return new PageRes<>(mapper.selectByNoticeDetailCodeTotal(cond), mapper.selectByNoticeDetailCodePaging(cond));
    }

    /** AS-IS Bbs05_History.updatePersonId L32 — 이 사원의 기록이 아직 없을 때만 1건 넣는다("해당 공지사항 그만보기") */
    @Transactional
    public void updatePersonId(UserPrincipal user, Long noticeId) {
        if (mapper.countHistory(noticeId, user.getUserId()) == 0) {
            mapper.insertHistory(mapper.selectNextId(), noticeId, user.getUserId());
        }
    }
}
