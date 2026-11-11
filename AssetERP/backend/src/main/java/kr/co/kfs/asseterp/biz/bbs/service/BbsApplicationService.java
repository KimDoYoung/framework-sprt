package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMineRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMineSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngCond;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationNoticeTarget;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationStatusRes;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsApplicationMapper;
import kr.co.kfs.asseterp.biz.apr.service.AlertService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** AS-IS server/bbs/Bbs11_Application.java (selectByAppStatus / selectByResultCheck L38 / modelUpdate L59 / update L81), sms/Sms02_History.sendMessage L100 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsApplicationService {

    private final BbsApplicationMapper mapper;
    private final AlertService alert;

    /** AS-IS selectByAppStatus(companyId, appStatus) */
    public List<ApplicationRes> searchByAppStatus(UserPrincipal user, String appStatus) {
        return mapper.selectByAppStatus(user.getCompanyId(), appStatus);
    }

    /** AS-IS selectByResultCheck(companyId, startDate, closeDate, appTypeCode, resultCheck) — resultCheck = 미완료건만(완료일 없음) */
    public List<ApplicationMngRes> searchByResultCheck(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String appTypeCode, boolean resultCheck) {
        String typeCode = (appTypeCode == null || appTypeCode.isBlank()) ? null : appTypeCode;
        return mapper.selectByResultCheck(new ApplicationMngCond(user.getCompanyId(), startDate, closeDate, typeCode, resultCheck));
    }

    /** AS-IS update → UpdateDataModel(bbs11_application). 변경 행(신청상태·완료일·비고)을 다시 읽어 요청 순서로 돌려준다 */
    @Transactional
    public List<ApplicationMngRes> updateStatus(UserPrincipal user, List<ApplicationMngSaveReq> rows) {
        List<ApplicationMngRes> result = new ArrayList<>();
        for (ApplicationMngSaveReq req : rows) {
            if (mapper.updateStatus(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            result.add(mapper.selectById(user.getCompanyId(), req.applicationId()));
        }
        return result;
    }

    /** AS-IS modelUpdate — 선택한 신청의 내용(편집기 HTML) */
    @Transactional
    public void updateContent(UserPrincipal user, Long applicationId, String content) {
        if (mapper.updateContent(user.getCompanyId(), applicationId, content) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /**
     * AS-IS bbs.Bbs11_Application.sendMessage(원본 98d5afdd6 새 메서드, CH-0250·0267·0268 — 전엔 sms.Sms02_History.sendMessage):
     * 신청자에게 통합알림 B03 "[Asset-ERP] " + 문구. 회사 문자발신 신청 검사(-1)는 없어지고 회사 발송 설정에 따라 메일·SMS, 앱알림은 늘
     */
    @Transactional
    public void sendMessage(UserPrincipal user, Long personId, String msg) {
        alert.alert("B03", personId, user.getCompanyId(), Map.of("content", "[Asset-ERP] " + msg));
    }

    // ---- Y13 기타신청서 작성 (Bbs11_Tab_Application · Bbs11_Edit_Application) ----

    /** AS-IS selectByPersonId(companyId, personId, startDate, closeDate, appTypeCode) */
    public List<ApplicationMineRes> searchMine(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String appTypeCode) {
        String typeCode = (appTypeCode == null || appTypeCode.isBlank()) ? null : appTypeCode;
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), startDate, closeDate, typeCode);
    }

    /** AS-IS modelUpdate — ID가 없으면 getSeq로 채번해 INSERT, 있으면 UPDATE 뒤 selectById로 다시 읽는다 */
    @Transactional
    public ApplicationMineRes saveMine(UserPrincipal user, ApplicationMineSaveReq req) {
        // Bbs11_Edit_Application.update L266-269
        if (req.appType() == null || req.appType().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "신청구분을 선택하세요");
        }
        Long id = req.applicationId();
        if (id == null) {
            id = mapper.selectNextId();
            mapper.insertMine(user.getCompanyId(), user.getUserId(), id, req);
        } else if (mapper.updateMine(user.getCompanyId(), user.getUserId(), req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectMineById(user.getCompanyId(), id);
    }

    /**
     * AS-IS updateAppStatus + sendMessage — type P(신청)이면 상태 10, C(신청취소)면 상태를 비운다.
     * 상태를 바꾼 뒤 알림 수신자(B03 기타신청서 신청요청)에게 문자를 보낸다.
     */
    @Transactional
    public ApplicationStatusRes changeStatus(UserPrincipal user, Long applicationId, String type) {
        boolean apply = "P".equals(type);
        if (!apply && !"C".equals(type)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        if (mapper.updateAppStatus(user.getCompanyId(), user.getUserId(), applicationId, apply ? "10" : null) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        ApplicationMineRes row = mapper.selectMineById(user.getCompanyId(), applicationId);
        return new ApplicationStatusRes(row, sendNotice(user, row, apply));
    }

    /** Bbs11_Edit_Application.sendMessage L352-391 — 1 발송, 0 수신자 없음, -1 발송 실패 */
    private int sendNotice(UserPrincipal user, ApplicationMineRes row, boolean apply) {
        List<ApplicationNoticeTarget> targets = mapper.selectSmsNoticeTarget(user.getCompanyId(), "B03");
        if (targets.isEmpty()) {
            return 0;
        }
        String msg = "'" + user.getName() + "'님이 " + row.appTypeName() + "을(를) " + (apply ? "하였습니다." : "취소하였습니다.");
        // 원본 98d5afdd6(CH-0266): bbs.Bbs11_Application.sendMessage — 받는 사람마다 통합알림 B03, 늘 상태 1
        for (ApplicationNoticeTarget t : targets) {
            alert.alert("B03", t.personId(), user.getCompanyId(), Map.of("content", "[Asset-ERP] " + msg));
        }
        return 1;
    }

    /** AS-IS delete — 진행된 신청서(상태가 있는 것)와 남의 것은 지울 수 없다(Bbs11_Tab_Application.delete L245-253) */
    @Transactional
    public int deleteMine(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            ApplicationMineRes row = mapper.selectMineById(user.getCompanyId(), id);
            if (row == null) {
                continue;
            }
            if (row.appStatus() != null && !row.appStatus().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "진행된 신청서는 삭제할 수 없습니다.");
            }
            if (!user.getUserId().equals(row.appEmpId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "본인 것만 삭제 가능합니다.");
            }
            count += mapper.deleteMine(user.getCompanyId(), user.getUserId(), id);
        }
        return count;
    }
}
