package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralMessageRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralMessageSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralMessageSendReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestNewRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralTitleHolderRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestStatusReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralShareRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralShareSaveReq;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsFloralRequestMapper;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS Bbs20_Tab_FloralRequestMng → server/bbs/Bbs20_FloralRequest.java (selectByTextAdmin L44 / selectById L23 / update L88 / sendMessage L58),
 * Bbs21_FloralRequestShare.java (selectByFloralRequestId L22 / selectShareInfo L28 / update L47 / delete L52), Bbs22_FloralMessage.java (selectByCompanyId L24 / checkOccasionsCode L39 / update L49)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsFloralRequestService {

    private final BbsFloralRequestMapper mapper;
    private final SmsSender smsSender;

    /** AS-IS selectByTextAdmin(companyId, startDate, closeDate, "%"+searchText+"%", confirmYn) */
    public List<FloralRequestRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText, boolean confirmYn) {
        return mapper.selectByTextAdmin(user.getCompanyId(), startDate, closeDate, "%" + (searchText == null ? "" : searchText) + "%", confirmYn);
    }

    /** Y12 AS-IS Bbs20_Tab_FloralRequest.retrieve → selectByText(companyId, personId, startDate, closeDate, "%"+searchText+"%", confirmYn) */
    public List<FloralRequestRes> searchMine(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText, boolean confirmYn) {
        return mapper.selectByText(user.getCompanyId(), user.getUserId(), startDate, closeDate, "%" + (searchText == null ? "" : searchText) + "%", confirmYn);
    }

    /**
     * Y12 AS-IS Bbs20_Edit_FloralRequest.insert L107-161 — 새 신청의 기본값. 번호를 먼저 받는다(증빙 파일·거래처 공유를 저장 전에 붙이기 때문, DBUtil.setSeq).
     * 보내는 사람: 대표이사(직책 100) 발령의 첫 행이 있으면 "직책명 성명"·그 직위, 없으면 "내 직위 내 이름"
     */
    @Transactional
    public FloralRequestNewRes newRequest(UserPrincipal user) {
        FloralTitleHolderRes holder = mapper.selectTitleHolder(user.getCompanyId(), "100");
        FloralTitleHolderRes me = mapper.selectPersonDefault(user.getUserId());
        String sendEmp = holder != null ? holder.titleName() + " " + holder.korName() : me.posName() + " " + me.korName();
        String sendPos = holder != null ? holder.posName() : me.posName();
        return new FloralRequestNewRes(mapper.selectNextId(), LocalDate.now(), user.getUserId(), me.korName(),
                mapper.selectCompanyName(user.getCompanyId()), sendEmp, sendPos);
    }

    /** Y12 AS-IS Bbs22_FloralMessage.getMessage — 경조구분의 문구 (없으면 null) */
    public String getMessage(UserPrincipal user, String code) {
        return mapper.selectMessage(user.getCompanyId(), code);
    }

    /** Y12 AS-IS Bbs20_FloralRequest.modelUpdate — 이미 있는 번호면 수정, 없으면 등록(신청상태 10). 저장한 번호 */
    @Transactional
    public long saveRequest(UserPrincipal user, FloralRequestSaveReq req) {
        if (req.floralRequestId() == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        String privateYn = String.valueOf(req.privateYn());
        if (mapper.countRequest(user.getCompanyId(), req.floralRequestId()) == 0) {
            mapper.insertRequest(user.getCompanyId(), user.getUserId(), privateYn, req);
        } else {
            mapper.updateRequest(user.getCompanyId(), privateYn, req);
        }
        return req.floralRequestId();
    }

    /** Y12 AS-IS Bbs20_FloralRequest.delete → UpdateDataModel.deleteModel (완료·접수·본인 검사는 화면 deleteRow) */
    @Transactional
    public int deleteRequests(UserPrincipal user, List<Long> ids) {
        for (Long id : ids) {
            if (mapper.deleteRequest(user.getCompanyId(), id) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return ids.size();
    }

    /** Y12 AS-IS Bbs21_FloralRequestShare.deleteDefaultShare — 그 신청의 공유 전부를 지운다 */
    @Transactional
    public void deleteDefaultShare(UserPrincipal user, Long floralRequestId) {
        mapper.deleteSharesByRequest(user.getCompanyId(), floralRequestId);
    }

    /** Y12 AS-IS Bbs21_FloralRequestShare.insertDefaultShare — 거래처 기본 공유를 복사하고, 복사한 것이 있으면 "신청공유" 문구를 돌려준다(없으면 null) */
    @Transactional
    public String insertDefaultShare(UserPrincipal user, Long floralRequestId, Long contactId) {
        int cnt = mapper.insertDefaultShare(floralRequestId, contactId);
        return cnt > 0 ? mapper.selectShareInfo(floralRequestId) : null;
    }

    /** AS-IS selectById(floralRequestId) */
    public FloralRequestRes get(UserPrincipal user, Long floralRequestId) {
        FloralRequestRes res = mapper.selectById(user.getCompanyId(), floralRequestId);
        if (res == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return res;
    }

    /** AS-IS update → UpdateDataModel(bbs20_floral_request). 변경 행(신청상태·완료일·비고·반려사유)을 다시 읽어 요청 순서로 돌려준다 */
    @Transactional
    public List<FloralRequestRes> updateStatus(UserPrincipal user, List<FloralRequestStatusReq> rows) {
        List<FloralRequestRes> result = new ArrayList<>();
        for (FloralRequestStatusReq req : rows) {
            if (mapper.updateStatus(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            result.add(mapper.selectById(user.getCompanyId(), req.floralRequestId()));
        }
        return result;
    }

    /**
     * AS-IS Bbs20_FloralRequest.sendMessage — 받는 사원마다 휴대폰번호로 SendSMSAPIFunction.sendPromoMessage.
     * 발송 연동(SmsSender)이 없으면 SmsSender가 거절한다
     */
    public int sendMessage(UserPrincipal user, FloralMessageSendReq req) {
        int sent = 0;
        for (Long personId : req.personIds()) {
            smsSender.send(user.getCompanyId(), null, mapper.selectMobileTelNo(personId), req.content(), String.valueOf(personId));
            sent++;
        }
        return sent;
    }

    /** AS-IS Bbs22_Lookup_FloralMessage.open → checkOccasionsCode(insertCode·deleteCode) 뒤 selectByCompanyId */
    @Transactional
    public List<FloralMessageRes> searchMessages(UserPrincipal user) {
        mapper.insertMessageCodes(user.getCompanyId(), "OccasionsCode");
        mapper.deleteMessageCodes(user.getCompanyId(), "OccasionsCode");
        return mapper.selectMessages(user.getCompanyId());
    }

    /** AS-IS Bbs22_FloralMessage.update → UpdateDataModel. 다시 읽은 목록 */
    @Transactional
    public List<FloralMessageRes> updateMessages(UserPrincipal user, List<FloralMessageSaveReq> rows) {
        for (FloralMessageSaveReq req : rows) {
            if (mapper.updateMessage(user.getCompanyId(), req.floralMessageId(), req.message()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return mapper.selectMessages(user.getCompanyId());
    }

    /** AS-IS Bbs21_FloralRequestShare.selectByFloralRequestId */
    public List<FloralShareRes> searchShares(UserPrincipal user, Long floralRequestId) {
        return mapper.selectShares(user.getCompanyId(), floralRequestId);
    }

    /**
     * AS-IS Bbs21_Lookup_FloralRequestShare.update — 지운 행(delete) 뒤 새 행(update). 저장 뒤 selectShareInfo 문구(신청공유 칸)를 돌려준다
     */
    @Transactional
    public String saveShares(UserPrincipal user, Long floralRequestId, FloralShareSaveReq req) {
        if (mapper.selectById(user.getCompanyId(), floralRequestId) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            mapper.deleteShares(user.getCompanyId(), floralRequestId, req.deleteIds());
        }
        if (req.rows() != null) {
            for (FloralShareSaveReq.Row row : req.rows()) {
                mapper.insertShare(mapper.selectNextId(), floralRequestId, row.shareCode(), row.personId(), row.orgId());
            }
        }
        String info = mapper.selectShareInfo(floralRequestId);
        return info == null ? "" : info;
    }
}
