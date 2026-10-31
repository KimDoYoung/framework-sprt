package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalCheckRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalConfirmEmpRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticePerson;
import kr.co.kfs.asseterp.biz.apr.dto.AprOrgHeadRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprExtraMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprDisposalListMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

/** [문서폐기 신청] (AS-IS client/vi/apr/Apr90_Lookup_DisposalList · Apr90_Lookup_ConfirmEmp, server Apr90_DisposalList.checkDisposal·modelUpdate, V09) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprDisposalService {

    private final AprApprExtraMapper mapper;
    private final AprDisposalListMapper disposalMapper;
    private final AprApprNewMapper newMapper;
    private final AprNoticeMapper noticeMapper;
    private final AprApprDetailService detailService;
    private final AprNoticeService notice;

    /** AS-IS apr.Apr90_DisposalList.checkDisposal L53-79 — 이미 신청했거나, 자금집행결의서가 있거나, 증빙자료로 연결돼 있으면 문구와 함께 안 된다 */
    public AprDisposalCheckRes check(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return doCheck(apprId);
    }

    private AprDisposalCheckRes doCheck(Long apprId) {
        if (mapper.countDisposal(apprId) > 0) {
            return new AprDisposalCheckRes(false, "해당문서는 이미 폐기신청이 완료되었습니다");
        }
        if (mapper.countSettledExpense(apprId) > 0) {
            return new AprDisposalCheckRes(false, "자금집행결의서가 존재하여 폐기할 수 없습니다");
        }
        if (mapper.countRelateUse(apprId) != 0) {
            return new AprDisposalCheckRes(false, "증빙자료로 연결되어 있어 폐기할 수 없습니다");
        }
        return new AprDisposalCheckRes(true, null);
    }

    /** AS-IS Apr90_Lookup_ConfirmEmp.getApprStep L113-132 → att.Att03_OvertimeReq.selectApprStepByType(approvalTypeCode "20") — 내 조직의 결재 단계 조직장 중 나 아닌 첫 사람. 없으면 null */
    public AprDisposalConfirmEmpRes getConfirmEmp(UserPrincipal user) {
        Long orgId = newMapper.selectOrgCodeId(user.getUserId());
        for (AprOrgHeadRow h : newMapper.selectOrgHeads(user.getCompanyId(), null, orgId, "20")) {
            if (!Objects.equals(h.personId(), user.getUserId())) {
                AprNoticePerson p = noticeMapper.selectPerson(h.personId());
                if (p != null) {
                    return new AprDisposalConfirmEmpRes(p.personId(), p.korName());
                }
            }
        }
        return null;
    }

    /**
     * AS-IS Apr90_Lookup_DisposalList.updateChk/update L108-158 → apr.Apr90_DisposalList.modelUpdate L123-226: 폐기이력(10) + 신청서(구분 10) 저장, 승인자에게 알림.
     * 서버는 [문서폐기 신청] 단추가 켜지는 조건(완료·반려 문서의 상신자 본인)도 다시 검사한다
     */
    @Transactional
    public void submit(UserPrincipal user, Long apprId, AprDisposalReq req) {
        AprApprDetailRes doc = detailService.getDetail(user, apprId);
        boolean statusOk = "30".equals(doc.statusCode()) || "40".equals(doc.statusCode());
        if (!statusOk || !Objects.equals(doc.regEmpId(), user.getUserId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        AprDisposalCheckRes check = doCheck(apprId);
        if (!check.ok()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, check.message());
        }
        if (req.reason() == null || req.reason().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사유는 필수입력항목입니다");
        }
        if (req.confirmEmpId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "승인자는 필수선택항목입니다");
        }
        disposalMapper.insertHistory(user.getCompanyId(), user.getUserId(), LocalDateTime.now(), apprId, "10");
        mapper.insertDisposal(mapper.selectNextId(), user.getCompanyId(), user.getUserId(), req.reason(), req.confirmEmpId(), apprId);
        notice.dispatchAfterCommit(notice.planDisposalRequest(user.getCompanyId(), req.confirmEmpId(), doc.title()));
    }
}
