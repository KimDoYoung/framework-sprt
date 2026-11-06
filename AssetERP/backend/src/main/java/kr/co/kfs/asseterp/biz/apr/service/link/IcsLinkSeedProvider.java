package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.IcsWriterLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprIcsWriterLinkMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistConfirmMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * 내부통제 점검 상신 (Apr01_Edit_ApprDoc.insertLinkApproval)
 * - A27 법규통제 체크리스트 L2100-2111 · client/htmlData/ChecklistWriteHtmlData.getHtmlContent (호출 Ics16_Lookup_RelateAppr)
 * - A32 임직원 내부통제 준수 점검 L2113-2125 · client/htmlData/ComplianceWriteHtmlData.getHtmlContent (호출 Ics31_Tab_ComplianceReport)
 * 둘 다 제목을 고칠 수 있고(`title.setReadOnly(false)`) [저장]은 감춘다. 본문 표는 원본 문자열 순서 그대로 만든다(`tdStNone`의 `</strong>`도 그대로).
 * A52(부서장)는 호출 화면이 TOBE에 없어 다음 ID로 넘겼다.
 */
@Component
@RequiredArgsConstructor
public class IcsLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"Malgun Gothic\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private final IcsChecklistConfirmMapper checklistMapper;
    private final AprApprNewMapper newMapper;
    private final AprIcsWriterLinkMapper writerMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A27", "A32", "A52");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String orgName = orgName(user);
        String yyyy = arg(args, "yyyy");
        if ("A27".equals(linkCode)) {
            // 호출 화면의 행(Ics16_RelateApprModel) — 대분류 이름은 그 행을 만든 조회(ics16_relate_appr.selectByConfirmerId)와 같은 질의로 읽는다
            LocalDate stdDate = stdDate(args);
            String cycleType = arg(args, "cycleType");
            String mm = arg(args, "mm");
            IcsChecklistRelateApprRes row = refId == null ? null
                    : checklistMapper.selectRelateApprs(user.getCompanyId(), user.getUserId(), stdDate, cycleType).stream()
                            .filter(r -> refId.equals(r.checklistLClassId())).findFirst().orElse(null);
            if (row == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "체크리스트 대분류 정보를 찾을 수 없습니다.");
            }
            String title = row.checkLClassName() + " 체크리스트 (" + yyyy + "년 " + mm + " - " + orgName + ")";
            return new Seed(title, checklistHtml(yyyy, mm, orgName, row.checkLClassName()), null, false, false);
        }
        String cycleName = arg(args, "cycleName");
        if ("A52".equals(linkCode)) {
            // Apr01_Edit_ApprDoc L2206-2238: 제목 `yyyy년 주기이름_임직원 내부통제 준수확인서 - 조직명 사원명`(고칠 수 있음), 본문 ComplianceWriteHtmlData.getHtmlContent2
            List<IcsWriterLinkRow> list = writerMapper.selectWriterList(user.getCompanyId(), user.getUserId(), arg(args, "cycleType"), stdDate(args));
            String title52 = yyyy + "년 " + cycleName + "_임직원 내부통제 준수확인서 - " + orgName + " " + user.getName();
            return new Seed(title52, complianceWriteHtml2(list), null, false, false);
        }
        String title = yyyy + "년 " + cycleName + "_임직원 내부통제 준수보고";
        return new Seed(title, complianceHtml(yyyy, cycleName), null, false, false);
    }

    private String orgName(UserPrincipal user) {
        Long orgCodeId = newMapper.selectOrgCodeId(user.getUserId());
        return orgCodeId == null ? "" : newMapper.selectOrgName(orgCodeId);
    }

    private static String arg(Map<String, String> args, String key) {
        String v = args.get(key);
        if (v == null || v.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 분기(월) 정보가 없습니다: " + key);
        }
        return v;
    }

    private static LocalDate stdDate(Map<String, String> args) {
        try {
            return LocalDate.parse(arg(args, "stdDate"));
        } catch (DateTimeParseException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일자 형식이 올바르지 않습니다.", e);
        }
    }

    private static String tdStNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 5) + "%;\">"
                + "<span></span></td>";
    }

    private static final String TABLE_START_NOTO = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    /** ComplianceWriteHtmlData.getHtmlContent2 L83-119 (표 글꼴은 현재 원본의 NotoCustom) */
    private static String complianceWriteHtml2(List<IcsWriterLinkRow> list) {
        StringBuilder t = new StringBuilder(TABLE_START_NOTO + TBODY_START
                + TR_START + tdStNone(20, 1, "left", 14, "다음과 같이 임직원 내부통제 준수내역을 보고합니다.") + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdStNone(20, 1, "center", 14, "- 다 음 -") + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdColor(2, 1, 1, "center", 12, "이름", "#EAEFF4")
                + tdColor(5, 1, 1, "center", 12, "부서", "#EAEFF4")
                + tdColor(2, 1, 1, "center", 12, "직위", "#EAEFF4")
                + tdColor(7, 1, 1, "center", 12, "준수여부", "#EAEFF4")
                + tdColor(4, 1, 1, "center", 12, "비고", "#EAEFF4") + TR_CLOSE);
        for (IcsWriterLinkRow m : list) {
            t.append(TR_START + tdColor(2, 1, 1, "center", 12, String.valueOf(m.personName()), "none")
                    + tdColor(5, 1, 1, "left", 12, String.valueOf(m.orgName()), "none")
                    + tdColor(2, 1, 1, "center", 12, String.valueOf(m.posName()), "none")
                    + tdColor(7, 1, 1, "left", 12, String.valueOf(m.complianceResult()), "none")
                    + tdColor(4, 1, 1, "left", 12, "", "none") + TR_CLOSE);
        }
        return t.append(TBODY_CLOSE + TABLE_CLOSE).toString();
    }

    /** ChecklistWriteHtmlData.getHtmlContent L32-74 */
    private static String checklistHtml(String yyyy, String mm, String orgName, String checkLClassName) {
        String text = TABLE_START + TBODY_START
                + TR_START + tdStNone(20, 1, "left", 14, yyyy + "년 " + mm + " " + orgName + " " + checkLClassName + " 체크리스트를 다음과 같이 보고합니다.") + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdStNone(20, 1, "left", 14, "다음의 화면에서 체크현황을 확인하신 후 결재하여 주시기 바랍니다.") + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdStNone(20, 1, "center", 14, "- 다 음 -") + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdStNone(20, 1, "left", 14, "내부통제 > 03.내부통제 체크리스트 > 내부통제 체크리스트 현황 : 분기(월)별 체크리스트 작성여부 및 확인여부 조회") + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdStNone(20, 1, "left", 14, "내부통제 > 03.내부통제 체크리스트 > 내부통제 체크리스트 상세 : 담당자별 체크결과 조회") + TR_CLOSE;
        return text + TBODY_CLOSE + TABLE_CLOSE;
    }

    /** ComplianceWriteHtmlData.getHtmlContent L46-81 (주석 처리된 줄은 원본도 만들지 않는다) */
    private static String complianceHtml(String yyyy, String cycleName) {
        String text = TABLE_START + TBODY_START
                + TR_START + tdStNone(20, 1, "left", 14, yyyy + "년 " + cycleName + " 임직원 내부통제 준수 점검결과를 보고합니다.") + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE
                + TR_START + tdStNone(20, 1, "left", 14, "첨부파일을 참고하세요.") + TR_CLOSE
                + TR_START + tdEmpty(20, 1, 0) + TR_CLOSE;
        return text + TBODY_CLOSE + TABLE_CLOSE;
    }
}
