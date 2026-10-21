package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportEmp;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportResult;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsComplianceReportMapper;
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

    /** AS-IS insertComplianceState: 재직 사원마다 준수항목별 결과·미준수 사유 */
    public List<IcsComplianceReportRes> report(UserPrincipal user, LocalDate stdDate, String cycleType) {
        Long companyId = user.getCompanyId();
        List<IcsComplianceReportRes> rows = new ArrayList<>();
        long seq = 0;
        for (IcsComplianceReportEmp emp : mapper.selectInOffice(companyId, stdDate, EXCEPT_BIZ_CODE)) {
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
                rows.add(new IcsComplianceReportRes(seq, emp.personId(), emp.personName(), emp.orgName(), r.complianceType(), r.complianceTypeName(),
                        r.complianceResult(), reason));
            }
        }
        return rows;
    }

    /** AS-IS defaultApprName(): 그 달 상신 연결과 결재 상태. 연결이 없으면 null(미상신) */
    public IcsComplianceReportApprRes appr(UserPrincipal user, String yyyymm, String cycleType) {
        return mapper.selectAppr(user.getCompanyId(), yyyymm, cycleType);
    }
}
