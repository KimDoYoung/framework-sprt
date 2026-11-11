package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsComplianceReportMapper;
import kr.co.kfs.asseterp.biz.rd.service.RdFileSaver;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/**
 * #1311 내부통제 준수점검(준감인) [상신]의 RD 첨부 PDF "내부통제 준수보고(yyyy년 주기).pdf" (CH-0018·0109, 사용자 결정 2026-11-11: RD가 만드는 PDF는 TOBE도 RD로).
 * AS-IS: Ics31_Tab_ComplianceConfirm.createRd L575 → Sys99_Print.insertComplianceState(confirmerId = 로그인 사원, window Ics31_Tab_ComplianceConfirm)
 *        → RDUtil.download(CommonInvoker.jsp · mrd Ics31_Tab_ComplianceReport · options "/rexportopt [6] /rxlsopt [100]" · pdf · rv companyId·personId·rdGroupId)
 *        → 결재창 저장 때 Apr01_Grid_ApprFile.ics32RelateApprFileSetting L495: checkFileStatus → fileReName("내부통제 준수보고(" + yyyy + "년 " + 주기이름 + ")", pdf).
 * RD가 꺼졌거나 실패하면 첨부 없이 넘어간다(AS-IS 개발계와 같음).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IcsComplianceRdPdfService {

    static final String WINDOW = "Ics31_Tab_ComplianceConfirm";
    static final String MRD = "Ics31_Tab_ComplianceReport";
    static final String OPTIONS = "/rexportopt [6] /rxlsopt [100]";
    private static final String FILE_TYPE = "pdf";

    private final IcsComplianceReportMapper mapper;
    private final IcsComplianceReportService reportService;
    private final BizRelateApprMapper relateApprMapper;
    private final RdFileSaver rdFileSaver;
    private final SysFileService sysFileService;

    /** AS-IS Sys99_Print.insertComplianceState(#1311) — 별도 트랜잭션으로 커밋해야 RD 서버(다른 접속)가 읽는다. 돌려주는 값 = 출력 그룹 ID */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public long insertComplianceState(UserPrincipal user, LocalDate stdDate, String cycleType) {
        if (stdDate == null || cycleType == null || cycleType.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 분기(월) 정보가 올바르지 않습니다.");
        }
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, WINDOW);
        for (IcsComplianceReportService.ReportRow row : reportService.rows(companyId, stdDate, cycleType, null, personId)) {
            mapper.insertPrintState(mapper.selectNextId(), companyId, personId, WINDOW, groupId, stdDate, row.startDate(), row.res());
        }
        return groupId;
    }

    /** @return 첨부한 파일 ID. RD가 꺼졌거나 실패하면 비어 있다 */
    public Optional<Long> attach(UserPrincipal user, long groupId, Long apprId, String yyyy, String cycleName) {
        Map<String, String> rv = new LinkedHashMap<>();
        rv.put("companyId", String.valueOf(user.getCompanyId()));
        rv.put("personId", String.valueOf(user.getUserId()));
        rv.put("rdGroupId", String.valueOf(groupId));
        Optional<File> pdf = rdFileSaver.save(user, MRD, OPTIONS, FILE_TYPE, "compliance_" + groupId, rv);
        if (pdf.isEmpty()) {
            return Optional.empty();
        }
        try {
            String locName = relateApprMapper.selectLocName(user.getCompanyId());
            String fileNm = "내부통제 준수보고(" + yyyy + "년 " + cycleName + ")." + FILE_TYPE;
            return Optional.of(sysFileService.registerRdFile(pdf.get(), apprId, locName, fileNm, FILE_TYPE));
        } catch (IOException e) {
            log.error("준수보고 RD PDF 첨부 실패 apprId={}", apprId, e);
            return Optional.empty();
        }
    }
}
