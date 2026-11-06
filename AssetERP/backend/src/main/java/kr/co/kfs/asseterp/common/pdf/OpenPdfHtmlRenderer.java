package kr.co.kfs.asseterp.common.pdf;

import java.io.ByteArrayOutputStream;
import java.io.File;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.lowagie.text.pdf.BaseFont;

import kr.co.kfs.asseterp.common.config.properties.PdfProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * OpenPDF + Flying Saucer 구현. Flying Saucer는 XHTML만 읽으므로 먼저 jsoup으로 XML 문법으로 정리한다
 * (AS-IS 본문의 {@code border=2}·{@code &nbsp;}·{@code <br>}).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OpenPdfHtmlRenderer implements HtmlPdfRenderer {

    /** AS-IS HTML이 쓰는 글꼴 이름 */
    static final String FONT_FAMILY = "NotoCustom";

    private final PdfProperties pdfProperties;

    @Override
    public byte[] render(String html) {
        Document doc = Jsoup.parse(html == null ? "" : html);
        doc.outputSettings()
                .syntax(Document.OutputSettings.Syntax.xml)
                .escapeMode(org.jsoup.nodes.Entities.EscapeMode.xhtml)
                .charset("UTF-8");
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            addFont(renderer);
            renderer.setDocumentFromString(doc.html());
            renderer.layout();
            renderer.createPDF(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("PDF 생성 실패", e);
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "PDF를 만들지 못했습니다.", e);
        }
    }

    private void addFont(ITextRenderer renderer) throws Exception {
        String path = pdfProperties.fontFile();
        if (path == null || path.isBlank() || !new File(path.split(",")[0]).isFile()) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "PDF 글꼴 파일이 없습니다: " + path);
        }
        renderer.getFontResolver().addFont(path, FONT_FAMILY, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, null);
    }
}
