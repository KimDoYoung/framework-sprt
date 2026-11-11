package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprNoticePerson;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveSendTargetRow;
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
import java.util.Map;

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
    private final kr.co.kfs.asseterp.biz.apr.service.AlertService alert;

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
     * AS-IS sendMessage L310-338 — 알림 미발송 승인·반려 건이 있는 사원마다 통합알림 A01 "[Asset-ERP] 임직원 매매 사전신청 N건이 완료되었습니다."를 보내고
     * confirm_sms_yn을 'true'로 바꾼다(원본 98d5afdd6, CH-0259 — 앱알림 제목 "임직원매매 사전신고 승인완료", 메일도 회사 설정에 따라).
     * 원본은 건수(Long)를 글자로 꺼내다 ClassCastException으로 멈춘다(원본-이상한점 235) — TOBE는 건수를 글자로 바꿔 보낸다.
     * 끝나면 "N건이 발송완료되었습니다"(N = 대상 사원 수).
     */
    @Transactional
    public String sendMessage(UserPrincipal user) {
        Long companyId = user.getCompanyId();
        List<PreApproveSendTargetRow> targets = mapper.selectSendMessageList(companyId);
        for (PreApproveSendTargetRow t : targets) {
            AprNoticePerson p = noticeMapper.selectPerson(t.personId());
            if (p == null) {
                continue;
            }
            alert.alert(NOTICE_CODE, p.personId(), p.companyId(), Map.of("count", String.valueOf(t.count())));
            mapper.updateConfirmSmsYn(companyId, t.personId());
        }
        return targets.size() + "건이 발송완료되었습니다";
    }
}
