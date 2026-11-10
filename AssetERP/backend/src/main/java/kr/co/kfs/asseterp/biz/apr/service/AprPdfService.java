package kr.co.kfs.asseterp.biz.apr.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprPdfDocRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprPdfPreviewReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprPdfMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.config.properties.MailSignProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.pdf.HtmlPdfRenderer;
import lombok.RequiredArgsConstructor;

/**
 * 결재문서 PDF 시뮬레이터 — AS-IS apr.Apr10_StampPDF7(iText7, 1,440줄: 회사 머리글·수신·제목·본문·대표명의·인감 그림·로고를 양식별로 합성)를 대신한다.
 * 원본 PDF와 같은 모양이 아니다. 같은 자리(미리보기 단추 → PDF Viewer)에서 같은 입력(문서 칸·양식·기본양식 여부)으로 간이 PDF를 만들어 흐름을 확인하는 용도다.
 * 원본과 다른 점:
 *  - 원본 미리보기는 임시 문서(apr.Apr01_ApprTemp.insert, 상태 99)를 DB에 넣고 그 문서로 PDF를 만든다. 시뮬레이터는 화면 값을 그대로 받아 DB에 쓰지 않는다.
 *  - 결재완료 대외문서에 제목 파일이 없으면 원본은 createPDF7로 만들어 sys10_file에 올린다. 시뮬레이터는 만들기만 하고 올리지 않는다.
 *  - 인감 그림·회사 로고 대신 인장명 글자를 찍는다. 머리글 주소·전화·팩스는 asseterp.mail.sign.{회사위치}.* (메일 서명과 같은 값, AS-IS IdmsConfig).
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AprPdfService {

    private static final String PAGE_CSS = "@page { size: A4; margin: 40pt 38pt 40pt 38pt;"
            + " @bottom-center { content: counter(page) \" / \" counter(pages); font-family: NotoCustom; font-size: 8pt; } }"
            + " body { margin: 0; font-family: NotoCustom; font-size: 10pt; } table { border-collapse: collapse; }"
            + " .sim { border: 1px dashed #c00; color: #c00; font-size: 8pt; padding: 3pt 6pt; margin-bottom: 10pt; }"
            + " .head { text-align: center; font-size: 18pt; font-weight: bold; margin: 6pt 0 14pt 0; }"
            + " .meta td { padding: 3pt 6pt; vertical-align: top; } .meta td.k { width: 60pt; font-weight: bold; }"
            + " .body { border-top: 2px solid #333; border-bottom: 1px solid #333; padding: 10pt 0; margin: 8pt 0; min-height: 300pt; }"
            + " .sign { text-align: center; font-size: 16pt; font-weight: bold; margin-top: 24pt; }"
            + " .stamp { display: inline-block; border: 2px solid #c00; color: #c00; font-size: 9pt; padding: 4pt; margin-left: 8pt; }"
            + " .foot { border-top: 1px solid #999; margin-top: 18pt; padding-top: 4pt; font-size: 8pt; color: #555; }"
            + " .steps td { border: 1px solid #555; text-align: center; padding: 3pt; width: 60pt; font-size: 8pt; } .steps td.h { background: #eee; }";

    private final AprPdfMapper mapper;
    private final HtmlPdfRenderer renderer;
    private final MailSignProperties signProps;

    /** makePreviewPDF L5545-5556: dcr30_link 첫 행 링크코드의 첫 글자, 없으면 "A" */
    public String getFormType(UserPrincipal user, Long classTreeId) {
        String link = classTreeId == null ? null : mapper.selectLinkCode(classTreeId, user.getCompanyId());
        return link == null || link.isEmpty() ? "A" : link.substring(0, 1);
    }

    /** 결재완료 대외문서의 제목 파일(apr10_stamp.selectByPDFId) — 있으면 그 파일을 그대로 보여 준다(viewPDF type=readFile) */
    public Long getTitleFileId(UserPrincipal user, Long apprId) {
        return mapper.selectTitleFileId(apprId, user.getCompanyId());
    }

    /** 화면의 현재 값으로 미리보기 (makePreviewPDF L5521-5590 → Apr10_StampPDF7 getTempDocument) */
    public byte[] preview(UserPrincipal user, AprPdfPreviewReq req) {
        String formType = req.formType() == null || req.formType().isBlank() ? getFormType(user, req.classTreeId()) : req.formType();
        Doc d = new Doc(req.inOutTypeCode(), formType, Boolean.TRUE.equals(req.checkFlag()), req.title(), req.content(), req.effectDate(),
                req.regDate(), req.receiveName(), req.referenceName(), req.signCompany(), req.signCeo(), req.stampName(), req.steps(), "미리보기(임시 문서)");
        return renderer.render(html(user, d));
    }

    /** 저장된 문서 (createPDF7 → viewPDF 자리). 제목 파일이 없을 때만 부른다 */
    public byte[] docPdf(UserPrincipal user, Long apprId, String formType) {
        AprPdfDocRow r = mapper.selectDoc(apprId, user.getCompanyId());
        if (r == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "결재문서를 찾을 수 없습니다.");
        }
        String ft = formType != null && !formType.isBlank() ? formType
                : r.formType() != null && !r.formType().isBlank() ? r.formType() : getFormType(user, r.classTreeId());
        Doc d = new Doc(r.inOutTypeCode(), ft, false, r.title(), r.content(), r.effectDate(), r.regDate(), r.receiveName(),
                r.referenceName(), r.signCompany(), r.signCeo(), r.stampName(), null, "문서 " + r.apprId() + " (상태 " + r.statusCode() + ", 제목 파일 없음 — 저장하지 않음)");
        return renderer.render(html(user, d));
    }

    private record Doc(String inOut, String formType, boolean checkFlag, String title, String content, String effectDate, String regDate,
                       String receive, String reference, String signCompany, String signCeo, String stampName, List<AprPdfPreviewReq.Step> steps,
                       String source) {
    }

    private String html(UserPrincipal user, Doc d) {
        boolean out = "10".equals(d.inOut());
        String loc = mapper.selectCompanyLoc(user.getCompanyId());
        MailSignProperties.Sign sign = signProps.of(loc);
        StringBuilder b = new StringBuilder();
        b.append("<div class=\"sim\">PDF 시뮬레이터 — 원본(Apr10_StampPDF7)과 모양이 다릅니다. 양식 ").append(esc(d.formType()))
                .append(" · ").append(out ? "대외문서" : "사내문서").append(out ? "" : (d.checkFlag() ? " · 시스템 기본 양식" : " · 본문만"))
                .append(" · ").append(esc(d.source())).append("</div>");
        if (out) {
            // 대외문서: 회사 머리글 · 수신/참조/제목 · 본문 · 대표명의 + 인감 · 주소·전화·팩스
            b.append("<div class=\"head\">").append(esc(nz(d.signCompany()))).append("</div>");
            b.append("<table class=\"meta\">")
                    .append(row("수신", d.receive())).append(row("참조", d.reference())).append(row("시행일자", d.effectDate()))
                    .append(row("제목", d.title())).append("</table>");
            b.append("<div class=\"body\">").append(body(d.content())).append("</div>");
            b.append("<div class=\"sign\">").append(esc(nz(d.signCompany()))).append(" ").append(esc(nz(d.signCeo())));
            if (d.stampName() != null && !d.stampName().isBlank()) {
                b.append("<span class=\"stamp\">").append(esc(d.stampName())).append("</span>");
            }
            b.append("</div>");
            b.append("<div class=\"foot\">").append(esc(nz(sign.address()))).append(" · 전화 ").append(esc(nz(sign.tel())))
                    .append(" · 팩스 ").append(esc(nz(sign.fax()))).append("</div>");
        } else if (d.checkFlag()) {
            // 사내문서 + 시스템 기본 양식: 결재란 · 기안 칸 · 본문
            b.append("<div class=\"head\">기 안 문</div>");
            if (d.steps() != null && !d.steps().isEmpty()) {
                b.append("<table class=\"steps\" align=\"right\"><tr>");
                for (AprPdfPreviewReq.Step s : d.steps()) {
                    b.append("<td class=\"h\">").append(esc(nz(s.stepTypeName()))).append("</td>");
                }
                b.append("</tr><tr>");
                for (AprPdfPreviewReq.Step s : d.steps()) {
                    b.append("<td>").append(esc(nz(s.titleName()))).append("<br/>").append(esc(nz(s.empName()))).append("</td>");
                }
                b.append("</tr></table><div style=\"clear: both;\"></div>");
            }
            b.append("<table class=\"meta\">").append(row("시행일자", d.effectDate())).append(row("상신일자", d.regDate()))
                    .append(row("제목", d.title())).append("</table>");
            b.append("<div class=\"body\">").append(body(d.content())).append("</div>");
        } else {
            b.append("<div class=\"body\">").append(body(d.content())).append("</div>");
        }
        return "<html><head><meta charset=\"UTF-8\"/><style>" + PAGE_CSS + "</style></head><body>" + b + "</body></html>";
    }

    private static String row(String k, String v) {
        return "<tr><td class=\"k\">" + k + "</td><td>" + esc(nz(v)) + "</td></tr>";
    }

    /** 본문은 HTML 편집기 값 — 원본처럼 그대로 넣는다(<br> → <br/>는 렌더러가 정리) */
    private static String body(String html) {
        return html == null ? "" : html;
    }

    private static String nz(String s) {
        return s == null ? "" : s;
    }

    private static String esc(String s) {
        return s == null ? "" : s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
