package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveConfirmerReq;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveReasonReq;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveRes;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveSettingRes;
import kr.co.kfs.asseterp.biz.flt.dto.PreApproveStatusReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltPreApproveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/flt/Flt10_Tr.java (selectByCompanyId L39 / updateStatusCode L512 / updateAddConfirmer L615 / sendMessage L318),
 * Flt01_CompanyStd.selectByDate L36 — 준법감시 사전승인(J02). 회사 전체 사원의 사전신고를 다룬다(로그인 회사)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltPreApproveService {

    private final FltPreApproveMapper mapper;

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
     * AS-IS sendMessage L318 — 알림 미발송 승인·반려 건이 있는 사원별로 Talk·메일·SMS를 보내고 confirm_sms_yn을 'true'로 바꾼다.
     * TOBE에는 Talk·메일·SMS 발송 연동이 없다(SmsSender는 DisabledSmsSender) — 보내지 않은 건을 보냈다고 표시하지 않도록
     * 대상이 있으면 발송 없이 안내 오류로 끝낸다(플래그 변경 없음). 대상이 없으면 AS-IS와 같이 0건 메시지.
     */
    public String sendMessage(UserPrincipal user) {
        int targets = mapper.selectSendMessageCount(user.getCompanyId());
        if (targets > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "알림(Talk·메일·SMS) 발송 연동이 아직 없어 " + targets + "명에게 발송하지 않았습니다");
        }
        return "0건이 발송완료되었습니다";
    }
}
