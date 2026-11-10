package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprNoticePerson;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveSendTargetRow;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import kr.co.kfs.asseterp.common.notice.NoticeResult;
import kr.co.kfs.asseterp.common.notice.NoticeSender;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveConfirmerReq;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveReasonReq;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveRes;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveSettingRes;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveStatusReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltPreApproveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/flt/Flt10_Tr.java (selectByCompanyId L39 / updateStatusCode L512 / updateAddConfirmer L615 / sendMessage L318),
 * Flt01_CompanyStd.selectByDate L36 — 준법감시 사전승인(J02). 회사 전체 사원의 사전신고를 다룬다(로그인 회사)
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltPreApproveService {

    /** emp92_sms_notice A01 : 임직원 매매 사전신청 완료알림 */
    private static final String NOTICE_CODE = "A01";

    private final FltPreApproveMapper mapper;
    private final AprNoticeMapper noticeMapper;
    private final NoticeSender noticeSender;
    private final NoticeProperties props;
    private final SmsSender smsSender;

    /** AS-IS selectByCompanyId — personId null = 전체 사원(`%`), apprYn `%`(전체)·`true`(승인)·`false`(미승인) */
    public List<PreApproveRes> search(UserPrincipal user, Long personId, String apprYn, String trType,
                                      String startDate, String closeDate, String searchText, boolean noLimitYn) {
        String personIdStr = personId == null ? "%" : String.valueOf(personId);
        return mapper.selectPreApproves(user.getCompanyId(), personIdStr, apprYn, trType, startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%", noLimitYn);
    }

    /** setInitData() L693-742 — 투자한도 열 숨김(기준관리, 기준일 = 조회 종료일) · 협의승인 회사 여부 */
    public PreApproveSettingRes setting(UserPrincipal user, String toDay) {
        Boolean unvisible = mapper.selectInvestLimitUnvisibleYn(user.getCompanyId(), toDay);
        Boolean addConfirm = mapper.selectAddConfirmYn(user.getCompanyId());
        return new PreApproveSettingRes(Boolean.TRUE.equals(unvisible), Boolean.TRUE.equals(addConfirm));
    }

    /** AS-IS updateStatusCode — 승인('20')이면 매매유효일을 기준관리의 승인유효일로 다시 정한다(서버 오늘 기준) */
    @Transactional
    public int updateStatus(UserPrincipal user, PreApproveStatusReq req) {
        String expectTrDate = mapper.selectExpectTrDate2(user.getCompanyId(), LocalDate.now().toString());
        int count = 0;
        for (Long trId : req.trIds()) {
            count += mapper.updateStatusCode(user.getCompanyId(), user.getUserId(), trId, req.statusCode(), req.rejectReason(), expectTrDate);
        }
        return count;
    }

    /** AS-IS updateAddConfirmer */
    @Transactional
    public int updateAddConfirmer(UserPrincipal user, PreApproveConfirmerReq req) {
        int count = 0;
        for (Long trId : req.trIds()) {
            count += mapper.updateAddConfirmer(user.getCompanyId(), trId, req.addConfirmerId());
        }
        return count;
    }

    /** Flt10_Lookup_RejectReasonWrite.update() — 사유만 바뀐 행 저장 */
    @Transactional
    public int updateReason(UserPrincipal user, Long trId, PreApproveReasonReq req) {
        int count = mapper.updateRejectReason(user.getCompanyId(), trId, req.rejectReason());
        if (count == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return count;
    }

    /**
     * AS-IS sendMessage L318-431 — 알림 미발송 승인·반려 건이 있는 사원마다 앱알림·SMS를 보내고 confirm_sms_yn을 'true'로 바꾼다.
     * 앱알림: 이메일이 있고 수신거부(emp92 A01)가 아니면. SMS: 회사가 문자발신 서비스를 신청했고(SMSok) 번호가 있고 수신거부가 아니면.
     * 메일: AS-IS는 비밀번호 변수(password)가 늘 null이라 보내지 않는다 — TOBE도 보내지 않는다.
     * 발송 실패는 AS-IS처럼 로그만 남기고 계속한다(앱알림·SMS 모두 예외를 삼켰다). 끝나면 "N건이 발송완료되었습니다"(N = 대상 사원 수).
     */
    @Transactional
    public String sendMessage(UserPrincipal user) {
        Long companyId = user.getCompanyId();
        String loc = noticeMapper.selectCompanyLoc(companyId);
        String companyUrl = "\r\n\r\n https://" + loc + ".k-fs.co.kr:5151/";
        List<PreApproveSendTargetRow> targets = mapper.selectSendMessageList(companyId);
        for (PreApproveSendTargetRow t : targets) {
            AprNoticePerson p = noticeMapper.selectPerson(t.personId());
            if (p == null) {
                continue;
            }
            String body = "임직원 매매 사전신청 " + t.count() + "건이 완료되었습니다.";
            if (p.emailAddress() != null && noticeMapper.countTalkBlocked(p.personId(), NOTICE_CODE) == 0) {
                NoticeResult r = noticeSender.sendTalk(p.emailAddress(), "임직원 매매 사전신청 완료알림", body);
                if (!r.ok()) {
                    log.warn("사전신청 완료 앱알림 실패: personId={}, {}", p.personId(), r.message());
                }
            }
            if (props.smsEnabled(loc) && p.mobileTelNo() != null && noticeMapper.countSmsBlocked(p.personId(), NOTICE_CODE) == 0) {
                try {
                    smsSender.send(companyId, null, p.mobileTelNo(), "[Asset-ERP] " + body + companyUrl, p.korName());
                } catch (BusinessException e) {
                    log.warn("사전신청 완료 문자 실패: personId={}, {}", p.personId(), e.getMessage());
                }
            }
            mapper.updateConfirmSmsYn(companyId, t.personId());
        }
        return targets.size() + "건이 발송완료되었습니다";
    }
}
