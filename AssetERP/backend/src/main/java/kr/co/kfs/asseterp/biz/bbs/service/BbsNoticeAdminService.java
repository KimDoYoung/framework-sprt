package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminCond;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminInsertRow;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeHistoryRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeSmsTarget;
import kr.co.kfs.asseterp.biz.bbs.dto.TargetCompanyRes;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsNoticeAdminMapper;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * KFS공지등록 (AS-IS Bbs02_Tab_NoticeAdmin·Bbs02_Edit_NoticeAdmin·Bbs09_Lookup_History → server/bbs/Bbs02_Notice·Bbs04_TargetCompany·Bbs09_NoticeHistory, Z04).
 * KFS 공지는 회사 ID 0에 쌓이고(화면의 companyId = 0), KFS 관리자 메뉴라 sys admin만 쓴다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsNoticeAdminService {

    /** AS-IS 화면의 companyId = 0l */
    private static final Long KFS_COMPANY_ID = 0L;
    /** 탭이 보내는 typeCode */
    private static final String TYPE_CODE = "NoticeType002";

    private final BbsNoticeAdminMapper mapper;
    private final SmsSender smsSender;

    /**
     * AS-IS Bbs02_Notice.selectByPublicYnPaging·Total. 구분이 전체('%')일 때만 공지기간(startDate~closeDate)을 건다(화면 retrieve() L254-293: 아니면 null).
     * 상태(openYn)는 '알림'·'대기' 외에는 '%'
     */
    public PageRes<NoticeAdminRes> search(UserPrincipal user, String openYn, String noticeType, String noticeDetail, String searchText,
                                          String startDate, String closeDate, long offset, long limit) {
        requireSysAdmin(user);
        boolean all = "%".equals(noticeType);
        NoticeAdminCond cond = new NoticeAdminCond(KFS_COMPANY_ID,
                "알림".equals(openYn) || "대기".equals(openYn) ? openYn : "%", noticeType, noticeDetail, TYPE_CODE,
                "%" + (searchText == null ? "" : searchText) + "%",
                all && startDate != null && !startDate.isEmpty() ? startDate : null,
                all && closeDate != null && !closeDate.isEmpty() ? closeDate : null, limit, offset);
        return new PageRes<>(mapper.selectByPublicYnTotal(cond), mapper.selectByPublicYnPaging(cond));
    }

    /** 새 공지의 ID (AS-IS DBUtil.setSeq) — f_create_seq()가 시퀀스를 갱신하므로 쓰기 트랜잭션 */
    @Transactional
    public Long nextId(UserPrincipal user) {
        requireSysAdmin(user);
        return mapper.selectNextId();
    }

    /**
     * AS-IS Bbs02_Edit_NoticeAdmin.update L617-656 → [상태나 본문이 열 때와 다르면] bbs.Bbs09_NoticeHistory.insert(변경 전 본문) →
     * bbs.Bbs02_Notice.modelUpdate(번호 채번 포함) → bbs.Bbs04_TargetCompany.update(새 고객사 INSERT).
     * 새 공지도 noticeId가 이미 있으므로 AS-IS는 열 때 상태(null)와 달라 기록을 한 줄 남긴다(그대로)
     */
    @Transactional
    public NoticeAdminRes save(UserPrincipal user, NoticeAdminSaveReq req) {
        requireSysAdmin(user);
        boolean statusChanged = !Objects.equals(req.openYn(), req.latestOpenYn());
        boolean contentChanged = !Objects.equals(req.notice(), req.latestNotice());
        if (statusChanged || contentChanged) {
            // 상태만 바뀌고 본문이 같으면 변경 전 본문은 남기지 않는다(latestNotice = null)
            String before = statusChanged && !contentChanged ? null : req.latestNotice();
            mapper.insertHistory(req.noticeId(), user.getUserId(), req.openYn(), before);
        }
        NoticeAdminCond one = new NoticeAdminCond(KFS_COMPANY_ID, "%", "%", "%", TYPE_CODE, "%", null, null, 1, 0);
        boolean exists = mapper.selectAdminById(one, req.noticeId()) != null;
        String noticeNo = exists ? mapper.selectNoticeNoById(req.noticeId()) : null;
        if (noticeNo == null) {
            noticeNo = mapper.getNoticeNo(KFS_COMPANY_ID);   // updateModel.getNoticeNo() == null → bbs02_notice.getNoticeNo
        }
        NoticeAdminInsertRow row = new NoticeAdminInsertRow(req.noticeId(), KFS_COMPANY_ID, user.getUserId(), user.getName(), req.title(), req.notice(),
                req.fromDate(), req.toDate(), req.openYn(), req.note(), req.noticeType(),
                req.noticeDetailCode() == null || req.noticeDetailCode().isEmpty() ? null : req.noticeDetailCode(), noticeNo,
                req.publicYn(), req.publicCompanyYn());
        if (exists) {
            mapper.updateNotice(row);
        } else {
            mapper.insertNotice(row);
        }
        if (req.newTargetCompanyIds() != null) {
            for (Long companyId : req.newTargetCompanyIds()) {
                mapper.insertTargetCompany(mapper.selectNextId(), req.noticeId(), companyId);
            }
        }
        return mapper.selectAdminById(one, req.noticeId());
    }

    /** AS-IS bbs.Bbs02_Notice.delete — 대상 고객사는 화면이 이어서 deleteAllTargetCompanies를 부른다(E14) */
    @Transactional
    public void delete(UserPrincipal user, Long noticeId) {
        requireSysAdmin(user);
        mapper.deleteNotice(KFS_COMPANY_ID, noticeId);
    }

    /** AS-IS bbs.Bbs04_TargetCompany.selectByNoticeId */
    public List<TargetCompanyRes> searchTargetCompanies(UserPrincipal user, Long noticeId) {
        requireSysAdmin(user);
        return mapper.selectTargetCompanies(noticeId);
    }

    /** AS-IS bbs.Bbs04_TargetCompany.delete (체크한 고객사) */
    @Transactional
    public int deleteTargetCompanies(UserPrincipal user, Long noticeId, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteTargetCompanies(noticeId, ids);
    }

    /** AS-IS bbs.Bbs04_TargetCompany.deleteAllTarget */
    @Transactional
    public void deleteAllTargetCompanies(UserPrincipal user, Long noticeId) {
        requireSysAdmin(user);
        mapper.deleteAllTargetCompanies(noticeId);
    }

    /** AS-IS bbs.Bbs09_NoticeHistory.selectByNoticeId */
    public List<NoticeHistoryRes> searchHistories(UserPrincipal user, Long noticeId) {
        requireSysAdmin(user);
        return mapper.selectHistories(noticeId);
    }

    /**
     * AS-IS sms.Sms03_GroupSend.sendNoticeMessage: 고른 사원마다 "[Asset-ERP] " + 내용을 보낸다(회사 ID 0).
     * 실제 발송은 {@link SmsSender}가 하고 기본 구현은 보내지 않는다(사용자 지시). 번호가 없는 사원은 건너뛴다
     */
    public void sendNoticeMessage(UserPrincipal user, String message, List<Long> personIds) {
        requireSysAdmin(user);
        if (personIds == null || personIds.isEmpty()) {
            return;
        }
        for (NoticeSmsTarget target : mapper.selectSmsTargets(personIds)) {
            if (target.mobileTelNo() == null || target.mobileTelNo().isBlank()) {
                log.warn("공지 문자 건너뜀: 휴대폰 번호 없음 personId={}", target.personId());
                continue;
            }
            smsSender.send(KFS_COMPANY_ID, null, target.mobileTelNo(), "[Asset-ERP] " + message, target.korName());
        }
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
