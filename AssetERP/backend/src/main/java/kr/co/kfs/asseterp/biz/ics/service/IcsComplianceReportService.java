package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportEmp;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportResult;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsComplianceReportMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS Ics31_Tab_ComplianceReport → server/sys/Sys99_Print.insertComplianceState L324 (보고 데이터) + Ics32_RelateAppr.selectByCompanyId L25 (상신 상태) — K03 내부통제 준수보고(준감인).
 * 원본은 보고 행을 sys99_print에 쌓고 RD 리포트가 읽는다. TOBE는 쌓지 않고(조회가 DB를 바꾸지 않게) 같은 행을 바로 돌려준다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsComplianceReportService {

    /** AS-IS retrieve()의 예외업무코드 — 10: 내부통제 준수확인서 작성 */
    static final String EXCEPT_BIZ_CODE = "10";
    private static final String KIND_CODE = "IcsComplianceType";

    private final IcsComplianceReportMapper mapper;

    /** 보고 한 줄 + 준수항목 적용시작일(출력 자료 date02에만 쓴다) */
    public record ReportRow(IcsComplianceReportRes res, LocalDate startDate) {
    }

    /** AS-IS insertComplianceState: 재직 사원마다 준수항목별 결과·미준수 사유 (#1312 — 예외업무 10, 확인자 조건 없음) */
    public List<IcsComplianceReportRes> report(UserPrincipal user, LocalDate stdDate, String cycleType) {
        return rows(user.getCompanyId(), stdDate, cycleType, EXCEPT_BIZ_CODE, null).stream().map(ReportRow::res).toList();
    }

    /**
     * AS-IS Sys99_Print.insertComplianceState L325-413의 행 만들기. exceptBizCode·confirmerId는 부르는 화면이 넘기는 대로
     * (#1312 보고 = 예외업무 10 / #1311 RD 첨부 PDF = 예외업무 없음·확인자 = 로그인 사원)
     */
    public List<ReportRow> rows(Long companyId, LocalDate stdDate, String cycleType, String exceptBizCode, Long confirmerId) {
        List<ReportRow> rows = new ArrayList<>();
        long seq = 0;
        for (IcsComplianceReportEmp emp : mapper.selectInOffice(companyId, stdDate, exceptBizCode, cycleType, confirmerId)) {
            seq++;
            // 3-1. 제출한 작성이 없는 퇴사 예정자 — 퇴사일의 전월 말일이 기준일이면 뺀다(순번은 이미 올라갔다)
            if (mapper.countFixedWrite(emp.personId(), stdDate, cycleType) == 0) {
                LocalDate retireDate = mapper.selectRetireDate(emp.personId(), LocalDate.now());
                if (retireDate != null && stdDate.equals(retireDate.minusMonths(1).withDayOfMonth(retireDate.minusMonths(1).lengthOfMonth()))) {
                    continue;
                }
            }
            // 3-2. 준수결과
            for (IcsComplianceReportResult r : mapper.selectResults(companyId, emp.personId(), stdDate, cycleType, KIND_CODE)) {
                String reason = "준수".equals(r.complianceResult()) ? null
                        : mapper.selectNonComplianceReason(emp.personId(), stdDate, cycleType, r.complianceType());
                rows.add(new ReportRow(new IcsComplianceReportRes(seq, emp.personId(), emp.personName(), emp.orgName(), r.complianceType(), r.complianceTypeName(),
                        r.complianceResult(), reason), r.startDate()));
            }
        }
        return rows;
    }

    /** 상신 구분: 1 = 준수보고(A32, 사원 NULL), 2 = 부서장 준수확인서(A52, 로그인 사원). 비면 1 */
    private static String apprType(String apprType) {
        if (apprType == null || apprType.isBlank()) {
            return "1";
        }
        if (!"1".equals(apprType) && !"2".equals(apprType)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신 구분이 올바르지 않습니다.");
        }
        return apprType;
    }

    private static Long personId(UserPrincipal user, String apprType) {
        return "2".equals(apprType) ? user.getUserId() : null;
    }

    /** AS-IS defaultApprName(): 그 달 상신 연결과 결재 상태. 연결이 없으면 null(미상신) */
    public IcsComplianceReportApprRes appr(UserPrincipal user, String yyyymm, String cycleType, String apprType) {
        String type = apprType(apprType);
        return mapper.selectAppr(user.getCompanyId(), yyyymm, cycleType, type, personId(user, type));
    }

    /**
     * AS-IS ics.Ics32_RelateAppr.insert L61-94 (A32·A52 상신 전) — 그 달·구분·사원의 연결 행이 있으면 그 ID, 없으면 만들어 그 ID.
     * 구분 1(A32)은 사원 NULL, 구분 2(A52)는 로그인 사원 (V28에서 ics32_person_id·ics32_appr_type 열이 로컬 DB에 생겨 조건에 넣음)
     */
    @Transactional
    public Long createRelateAppr(UserPrincipal user, String yyyymm, String cycleType, String apprTypeCode) {
        String type = apprType(apprTypeCode);
        Long personId = personId(user, type);
        if (yyyymm == null || !yyyymm.matches("\\d{4}\\.\\d{2}") || cycleType == null || cycleType.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 분기(월) 정보가 올바르지 않습니다.");
        }
        Long id = mapper.selectRelateApprId(user.getCompanyId(), yyyymm, cycleType, type, personId);
        if (id != null) {
            return id;
        }
        id = mapper.selectNextId();
        mapper.insertRelateAppr(id, user.getCompanyId(), yyyymm, cycleType, personId, type);
        return id;
    }

    /** AS-IS ics.Ics32_RelateAppr.updateApprId L96-103 (A32 상신 뒤) */
    @Transactional
    public void updateRelateApprId(UserPrincipal user, Long relateApprId, Long apprId) {
        if (apprId == null || mapper.countAppr(user.getCompanyId(), apprId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신 문서를 찾을 수 없습니다.");
        }
        if (mapper.updateRelateApprId(user.getCompanyId(), relateApprId, apprId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신 연결 정보를 찾을 수 없습니다.");
        }
    }
}
