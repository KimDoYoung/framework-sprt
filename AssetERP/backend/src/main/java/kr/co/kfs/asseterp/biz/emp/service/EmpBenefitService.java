package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitPayRequestRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitTypeRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpBenefitMapper;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/emp/Emp17_Benefit.java (selectByText L42 / selectByBenefitCode L56 / selectByYyyymm L84 / selectApprId L100 / payRequestApprCheck L112
 * / deleteApprId L146 / sendMessage L163 / modelUpdate L180 / updatePayRequestApprId L202 / updatePayRequestYm L215 / update L237) — 복리후생비 관리 (U05)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpBenefitService {

    private final EmpBenefitMapper mapper;
    private final SmsSender smsSender;

    /** 화면의 콤보가 비어 있으면(전체) 조건을 모두 통과시키는 "%" — AS-IS retrieve() */
    private static String codeOrAll(String code) {
        return code == null || code.isEmpty() ? "%" : code;
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    /** AS-IS selectByText: 상신·결재중·완료(10·20·30), 지출결의 미등록, 미지급 신청 */
    public List<BenefitRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String benefitCode, String searchText) {
        return mapper.selectByText(user.getCompanyId(), startDate, closeDate, codeOrAll(benefitCode), like(searchText));
    }

    /** AS-IS selectByBenefitCode: benefitYn은 "true"(지급완료)·"false"(미지급)·없으면 전체("%") */
    public List<BenefitRes> searchPayRequests(UserPrincipal user, String yyyymm, String benefitCode, String benefitYn, String searchText) {
        String yn = benefitYn == null || benefitYn.isEmpty() ? "%" : benefitYn;
        return mapper.selectByBenefitCode(user.getCompanyId(), yyyymm, codeOrAll(benefitCode), yn, like(searchText));
    }

    /** AS-IS selectByYyyymm (apprChk) — 없으면 null(미상신) */
    public BenefitPayRequestRes getPayRequest(UserPrincipal user, String yyyymm, String benefitCode) {
        return mapper.selectByYyyymm(user.getCompanyId(), yyyymm, codeOrAll(benefitCode));
    }

    /** AS-IS selectApprId: 기준년월·신청구분의 지출결의서 상신ID (행이 없으면 원본은 NPE) */
    public Long getPayRequestApprId(UserPrincipal user, String yyyymm, String benefitCode) {
        BenefitPayRequestRes r = getPayRequest(user, yyyymm, benefitCode);
        if (r == null || r.payRequestApprId() == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return r.payRequestApprId();
    }

    /** AS-IS sys.Sys00_Common.selectBenefit */
    public List<BenefitTypeRes> searchTypes(UserPrincipal user) {
        return mapper.selectBenefitTypes(user.getCompanyId());
    }

    /**
     * AS-IS payRequestApprCheck: 고른 행마다 기준년월·신청구분의 지출결의서가 있으면 막는 메시지를 돌려준다(처음 걸린 하나). 문제가 없으면 null.
     * 상신·결재중·완료(10·20·30)면 "이미 생성", 그 밖(반려·임시저장)이면 "삭제 후 등록"
     */
    public String checkPayRequest(UserPrincipal user, String year, String month, List<Long> benefitIds) {
        for (BenefitRes row : mapper.selectCodesByIds(user.getCompanyId(), requireIds(benefitIds))) {
            BenefitPayRequestRes found = mapper.selectByYyyymm(user.getCompanyId(), year + "." + month, row.benefitCode());
            if (found != null && found.payRequestApprStatusCode() != null) {
                String s = found.payRequestApprStatusCode();
                if ("10".equals(s) || "20".equals(s) || "30".equals(s)) {
                    return year + "년 " + month + "월 " + row.benefitName() + " 지출결의서가 이미 생성되어 있습니다. 확인 후 진행바랍니다.";
                }
                return "반려/임시저장 문서를 삭제 후 등록이 가능합니다.";
            }
        }
        return null;
    }

    /** AS-IS updatePayRequestYm: 고른 신청의 지출결의 기준년월을 쓴다(null이면 제거) */
    @Transactional
    public int updatePayRequestYm(UserPrincipal user, List<Long> benefitIds, String payRequestYyyymm) {
        return mapper.updatePayRequestYm(user.getCompanyId(), requireIds(benefitIds), payRequestYyyymm);
    }

    /** AS-IS updatePayRequestApprId: 지출결의서 상신 뒤 상신ID를 쓴다 */
    @Transactional
    public int updatePayRequestApprId(UserPrincipal user, List<Long> benefitIds, Long apprId) {
        return mapper.updatePayRequestApprId(user.getCompanyId(), requireIds(benefitIds), apprId);
    }

    /** AS-IS update(UpdateDataModel): [지급확인]·[지급취소] — 지급여부만 'true'/'false' */
    @Transactional
    public int updateBenefitYn(UserPrincipal user, List<Long> benefitIds, boolean benefitYn) {
        return mapper.updateBenefitYn(user.getCompanyId(), requireIds(benefitIds), String.valueOf(benefitYn));
    }

    /**
     * AS-IS deleteApprId(문서폐기): 결재 문서를 삭제 이력(apr99)에 남기고 지운 뒤 신청의 상신ID를 비운다.
     * 화면이 결재상태 30(완료)인 행만 부르므로 서버도 같은 조건을 확인한다(원본은 서버에서 검사하지 않는다)
     */
    @Transactional
    public void discardAppr(UserPrincipal user, Long benefitId) {
        BenefitRes row = mapper.selectById(user.getCompanyId(), benefitId);
        if (row == null || row.apprId() == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        mapper.insertApprDel(row.apprId(), user.getUserId());
        mapper.deleteAppr(row.apprId());
        mapper.deleteApprId(user.getCompanyId(), benefitId);
    }

    /** AS-IS modelUpdate(알림 등록 창 [저장]): 알림 내용(비고)을 쓴다 */
    @Transactional
    public void updateNote(UserPrincipal user, Long benefitId, String note) {
        if (mapper.updateNote(user.getCompanyId(), benefitId, note) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
    }

    /**
     * AS-IS sendMessage(알림 등록 창 [문자발송]): 신청한 사원 휴대폰번호로 알림 내용을 문자로 보낸다(회사 0).
     * 발송 연동(SmsSender)이 없으면 SmsSender가 거절한다
     */
    public void sendMessage(UserPrincipal user, Long benefitId, String note) {
        BenefitRes row = mapper.selectById(user.getCompanyId(), benefitId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        smsSender.send(0L, null, mapper.selectMobileTelNo(row.personId()), note, String.valueOf(row.personId()));
    }

    private static List<Long> requireIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        return ids;
    }
}
