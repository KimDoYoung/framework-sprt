package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsNoticeCompanyRes;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsNoticeTargetRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeInsertRow;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeMngCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeMngRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.TargetAddRow;
import kr.co.kfs.asseterp.biz.bbs.dto.TargetRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticePersonCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticePersonRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeRes;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsNoticeMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import java.util.List;
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

    /**
     * AS-IS Bbs02_Notice.selectByPersonIdPaging·Total (Z03 Bbs02_Tab_NoticeView). 구분이 전체('%')일 때만 공지일 기간(startDate~closeDate)을 건다
     * (화면 retrieve() L244-280: 아니면 null)
     */
    public PageRes<NoticePersonRes> searchByPersonId(UserPrincipal user, String noticeType, String noticeDetailCode, String searchText,
                                                     String startDate, String closeDate, long offset, long limit) {
        boolean all = "%".equals(noticeType);
        NoticePersonCond cond = new NoticePersonCond(user.getCompanyId(), user.getUserId(), noticeType, noticeDetailCode,
                "%" + (searchText == null ? "" : searchText) + "%",
                all && startDate != null && !startDate.isEmpty() ? startDate : null,
                all && closeDate != null && !closeDate.isEmpty() ? closeDate : null, limit, offset);
        return new PageRes<>(mapper.selectByPersonIdTotal(cond), mapper.selectByPersonIdPaging(cond));
    }

    /** AS-IS Bbs05_History.updatePersonId L32 — 이 사원의 기록이 아직 없을 때만 1건 넣는다("해당 공지사항 그만보기"; 있으면 날짜 갱신) */
    @Transactional
    public void updatePersonId(UserPrincipal user, Long noticeId) {
        if (mapper.countHistory(noticeId, user.getUserId()) == 0) {
            mapper.insertHistory(mapper.selectNextId(), noticeId, user.getUserId());
        } else {
            // L44-52 이미 있으면 날짜만 오늘로 고친다 (noticeId 0 "오늘 하루 열지 않음"을 다음 날 다시 누를 때)
            mapper.updateHistoryDate(noticeId, user.getUserId());
        }
    }

    // ── Z02 공지사항 등록 (Bbs02_Tab_NoticeManager·Bbs02_Edit_Notice·Bbs02_Lookup_LoadBbs) ──

    /**
     * AS-IS Bbs02_Notice.selectByCompanyIdPaging·Total (회사의 공지 목록). 구분·구분상세는 코드('%'면 전체), 검색어는 서비스가 %…%로 만든다.
     * systemNoticeYn=true는 불러오기 창이 시스템공지(90)까지 합쳐 볼 때
     */
    public PageRes<NoticeMngRes> searchByCompanyId(UserPrincipal user, String noticeType, String noticeDetail, String searchText,
                                                   boolean systemNoticeYn, long offset, long limit) {
        NoticeMngCond cond = new NoticeMngCond(user.getCompanyId(), user.getUserId(), noticeType, noticeDetail,
                "%" + (searchText == null ? "" : searchText) + "%", systemNoticeYn, limit, offset);
        return new PageRes<>(mapper.selectByCompanyIdTotal(cond), mapper.selectByCompanyIdPaging(cond));
    }

    /** 새 공지의 ID (AS-IS GridInsertRow가 받는 setSeq) — f_create_seq()가 시퀀스를 갱신하므로 쓰기 트랜잭션 */
    @Transactional
    public Long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS Bbs02_Edit_Notice.update L648-680 → bbs.Bbs02_Notice.update(번호 채번 포함) + bbs.Bbs03_Target.update(새 대상자 INSERT) */
    @Transactional
    public NoticeMngRes save(UserPrincipal user, NoticeSaveReq req) {
        if (req.topNoticeYn() && (req.topNoticeCloseDate() == null || req.topNoticeCloseDate().isBlank())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상단고정을 설정하면, 종료일은 필수선택 항목입니다");
        }
        Long companyId = user.getCompanyId();
        NoticeMngCond one = new NoticeMngCond(companyId, user.getUserId(), "%", "%", "%", false, 1, 0);
        boolean exists = mapper.selectMngById(one, req.noticeId()) != null;
        String noticeNo = exists ? mapper.selectNoticeNoById(companyId, req.noticeId()) : null;
        if (noticeNo == null) {
            noticeNo = mapper.getNoticeNo(companyId);   // updateModel.getNoticeNo() == null → bbs02_notice.getNoticeNo
        }
        String closeDate = req.topNoticeYn() ? req.topNoticeCloseDate() : null;
        NoticeInsertRow row = new NoticeInsertRow(req.noticeId(), companyId, user.getUserId(), user.getName(), req.title(), req.notice(),
                req.fromDate(), req.toDate(), req.openYn(), req.note(), req.noticeType(),
                req.noticeDetailCode() == null || req.noticeDetailCode().isEmpty() ? null : req.noticeDetailCode(), noticeNo,
                req.commentYn(), req.topNoticeYn(), closeDate);
        if (exists) {
            mapper.updateNotice(row);
        } else {
            mapper.insertNotice(row);
        }
        if (req.newTargetPersonIds() != null) {
            for (Long personId : req.newTargetPersonIds()) {
                mapper.insertTarget(new TargetAddRow(mapper.selectNextId(), req.noticeId(), personId));
            }
        }
        return mapper.selectMngById(one, req.noticeId());
    }

    /** AS-IS bbs.Bbs02_Notice.delete — 개별 대상자는 화면이 이어서 deleteAllTargets를 부른다(E15) */
    @Transactional
    public void delete(UserPrincipal user, Long noticeId) {
        mapper.deleteNotice(user.getCompanyId(), noticeId);
    }

    /** AS-IS bbs.Bbs03_Target.selectByNoticeId (공지일 기준 조직·직책) */
    public List<TargetRes> searchTargets(UserPrincipal user, Long noticeId, String fromDate) {
        return mapper.selectTargets(user.getCompanyId(), noticeId, fromDate, fromDate, null, null);
    }

    /** AS-IS bbs.Bbs03_Target.delete (체크한 대상자) */
    @Transactional
    public int deleteTargets(Long noticeId, List<Long> targetIds) {
        return targetIds == null || targetIds.isEmpty() ? 0 : mapper.deleteTargets(noticeId, targetIds);
    }

    /** AS-IS bbs.Bbs03_Target.deleteAllTarget */
    @Transactional
    public void deleteAllTargets(Long noticeId) {
        mapper.deleteAllTargets(noticeId);
    }

    /** AS-IS Bbs02_Notice.selectByTargetPerson L111-123 (Frm01_Lookup_NoticeList, EE55) */
    public List<BbsNoticeTargetRes> searchByTargetPerson(UserPrincipal user) {
        return mapper.selectByTargetPerson(user.getCompanyId(), user.getUserId());
    }

    /** AS-IS Bbs02_Notice.selectByTargetCompany (Bbs02_Lookup_NoticeAdmin, EE83) */
    public List<BbsNoticeCompanyRes> searchByTargetCompany(UserPrincipal user) {
        return mapper.selectByTargetCompany(user.getCompanyId(), user.getUserId());
    }
}
