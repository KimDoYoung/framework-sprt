package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteAnswerReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteCreateReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteFixReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteItem;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsComplianceWriteMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * AS-IS Ics31_Tab_ComplianceWrite·Ics31_Edit_Reason → server/ics/Ics30_Compliance.selectByPersonId L27 +
 * Ics31_ComplianceWrite (selectById L22 / updateAnswerCode L45 / updateFixYn L95 / modelUpdate L133 / deleteByPersonId L146)
 * + Sys99_Print.insertRdComplianceWrite L5153 (엑셀) — K01 내부통제 준수확인서 작성.
 * 회사·사원은 로그인 사용자로 채우고, 수정·삭제도 내 작성 행만(보안 보강). stdDate = 기준 분기(월)의 말일
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsComplianceWriteService {

    private static final String SEARCH_ALL = "%";

    private final IcsComplianceWriteMapper mapper;

    /** AS-IS settings()의 Sys01_Company.selectById — 체크주기 M(월)/Q(분기), 설정이 없으면 null */
    public String cycleType(UserPrincipal user) {
        return mapper.selectCycleType(user.getCompanyId());
    }

    /** AS-IS Ics30_Compliance.selectByPersonId (searchText "%") */
    public List<IcsComplianceWriteRes> list(UserPrincipal user, LocalDate stdDate, String cycleType, boolean checkBox) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), stdDate, SEARCH_ALL, checkBox, cycleType);
    }

    /**
     * AS-IS Ics31_ComplianceWrite.updateAnswerCode: 그 달 작성 행이 있으면 답변만 바꾸고, 없으면 새로 만든다.
     * 답변이 null이면 답변을 비운다('해당없음'을 못 쓰는 항목)
     */
    @Transactional
    public IcsComplianceWriteItem updateAnswerCode(UserPrincipal user, IcsComplianceWriteAnswerReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        IcsComplianceWriteItem found = mapper.selectByCompliance(companyId, personId, req.complianceId(), req.yyyymm(), req.cycleType());
        if (found != null) {
            mapper.updateAnswerCode(companyId, personId, found.complianceWriteId(), req.answerCode());
            return mapper.selectById(companyId, personId, found.complianceWriteId());
        }
        return insert(user, req.complianceId(), req.yyyymm(), req.cycleType(), req.answerCode());
    }

    /** AS-IS Ics31_Tab_ComplianceWrite 수정 아이콘: 작성 행이 없으면 답변 없이 먼저 만든다(modelUpdate) */
    @Transactional
    public IcsComplianceWriteItem create(UserPrincipal user, IcsComplianceWriteCreateReq req) {
        IcsComplianceWriteItem found = mapper.selectByCompliance(user.getCompanyId(), user.getUserId(), req.complianceId(), req.yyyymm(), req.cycleType());
        if (found != null) {
            return found;
        }
        return insert(user, req.complianceId(), req.yyyymm(), req.cycleType(), null);
    }

    /** AS-IS Ics31_ComplianceWrite.selectById — 사유 창을 열 때 */
    public IcsComplianceWriteItem get(UserPrincipal user, Long complianceWriteId) {
        return required(mapper.selectById(user.getCompanyId(), user.getUserId(), complianceWriteId));
    }

    /** AS-IS Ics31_Edit_Reason.update → modelUpdate */
    @Transactional
    public IcsComplianceWriteItem updateReason(UserPrincipal user, Long complianceWriteId, String reason) {
        required(mapper.selectById(user.getCompanyId(), user.getUserId(), complianceWriteId));
        mapper.updateReason(user.getCompanyId(), user.getUserId(), complianceWriteId, reason);
        return mapper.selectById(user.getCompanyId(), user.getUserId(), complianceWriteId);
    }

    /** AS-IS Ics31_ComplianceWrite.updateFixYn — 그리드 행들의 작성 행을 제출('true')·제출취소('false') */
    @Transactional
    public int updateFixYn(UserPrincipal user, IcsComplianceWriteFixReq req) {
        String fixYn = Boolean.TRUE.equals(req.fixYn()) ? "true" : "false";
        int count = 0;
        for (Long id : req.writeIds() == null ? List.<Long>of() : req.writeIds()) {
            count += mapper.updateFixYn(user.getCompanyId(), user.getUserId(), id, fixYn);
        }
        return count;
    }

    /** AS-IS Ics31_ComplianceWrite.deleteByPersonId — 제출한 내역이 있으면 지우지 않는다 */
    @Transactional
    public int deleteByPersonId(UserPrincipal user, LocalDate stdDate, String cycleType) {
        List<IcsComplianceWriteItem> list = mapper.selectWrite(user.getCompanyId(), user.getUserId(), stdDate, cycleType);
        for (IcsComplianceWriteItem model : list) {
            if (Boolean.TRUE.equals(model.fixYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "제출한 내역이 존재합니다. 제출취소 후 시도하세요");
            }
        }
        int count = 0;
        for (IcsComplianceWriteItem model : list) {
            count += mapper.deleteById(user.getCompanyId(), user.getUserId(), model.complianceWriteId());
        }
        return count;
    }

    /**
     * 엑셀다운로드 — AS-IS는 Sys99_Print.insertRdComplianceWrite(sys99_print에 쌓음) + RD 리포트 Ics31_Rd_ComplianceWrite.
     * RD 서버가 없으므로 같은 항목(구분·내용·예·아니오·해당없음·사유·제출여부·확인여부·확인자, 체크는 ✓)을 한 시트에 쓴다
     */
    public byte[] download(UserPrincipal user, LocalDate stdDate, String cycleType, boolean checkBox) {
        List<List<Object>> rows = list(user, stdDate, cycleType, checkBox).stream()
                .map(r -> row(r.complianceTypeName(), r.content(),
                        mark("Y".equals(r.answerCode())), mark("N".equals(r.answerCode())), mark("X".equals(r.answerCode())),
                        r.reason(), mark(Boolean.TRUE.equals(r.fixYn())), mark(Boolean.TRUE.equals(r.confirmYn())), r.confirmerName()))
                .toList();
        return IcsExcelWriter.write("내부통제 준수확인서",
                List.of("구분", "내용", "예", "아니오", "해당없음", "사유", "제출여부", "확인여부", "확인자"), rows);
    }

    private IcsComplianceWriteItem insert(UserPrincipal user, Long complianceId, String yyyymm, String cycleType, String answerCode) {
        long id = mapper.selectNextId();
        mapper.insert(user.getCompanyId(), user.getUserId(), id, complianceId, yyyymm, answerCode, cycleType);
        return mapper.selectById(user.getCompanyId(), user.getUserId(), id);
    }

    private static IcsComplianceWriteItem required(IcsComplianceWriteItem item) {
        if (item == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "작성 내역을 찾을 수 없습니다");
        }
        return item;
    }

    private static String mark(boolean on) {
        return on ? "✓" : "";
    }

    private static List<Object> row(Object... values) {
        return Arrays.asList(values);
    }
}
