package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngCond;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationMngSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationRes;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsApplicationMapper;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** AS-IS server/bbs/Bbs11_Application.java (selectByAppStatus / selectByResultCheck L38 / modelUpdate L59 / update L81), sms/Sms02_History.sendMessage L100 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsApplicationService {

    private final BbsApplicationMapper mapper;
    private final SmsSender smsSender;

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
     * AS-IS Sms02_History.sendMessage — 신청자 휴대폰번호로 "[Asset-ERP] " + 문구를 보낸다.
     * 발송 연동(SmsSender)이 없으면 SmsSender가 거절한다
     */
    public void sendMessage(UserPrincipal user, Long personId, String msg) {
        smsSender.send(user.getCompanyId(), null, mapper.selectMobileTelNo(personId), "[Asset-ERP] " + msg, String.valueOf(personId));
    }
}
