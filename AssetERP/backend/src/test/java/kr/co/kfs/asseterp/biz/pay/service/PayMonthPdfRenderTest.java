package kr.co.kfs.asseterp.biz.pay.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import kr.co.kfs.asseterp.biz.pay.dto.PayMonthListRow;
import kr.co.kfs.asseterp.biz.pay.mapper.PayMonthMapper;
import kr.co.kfs.asseterp.common.config.properties.PdfProperties;
import kr.co.kfs.asseterp.common.pdf.OpenPdfHtmlRenderer;

/** V25 급여대장 PDF — 실제 급여 내역으로 HTML을 만들어 OpenPDF + Flying Saucer로 PDF를 뽑는다(DB는 읽기만) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PayMonthPdfRenderTest {

    private static final String FONT = System.getProperty("user.home") + "/tmp/asseterp-data/fonts/NotoSansKR-Regular.ttf";

    @Autowired PayMonthMapper mapper;

    @Test
    void 급여대장_PDF를_만든다() throws Exception {
        List<PayMonthListRow> rows = mapper.selectList(28000L, "01", LocalDate.of(2026, 2, 20));
        assertThat(rows).isNotEmpty();
        String html = "<html><head><meta charset=\"UTF-8\"/><style>"
                + "@page { size: A4 landscape; margin: 10pt 10pt 24pt 10pt; @bottom-center { content: counter(page) \" / \" counter(pages); font-family: NotoCustom; font-size: 9pt; } }"
                + " body { margin: 0; font-family: NotoCustom; } table { table-layout: fixed; }</style></head><body>" + PayMonthListHtml.html(rows) + "</body></html>";
        byte[] pdf = new OpenPdfHtmlRenderer(new PdfProperties(FONT, Map.of())).render(html);
        assertThat(new String(pdf, 0, 5, java.nio.charset.StandardCharsets.ISO_8859_1)).isEqualTo("%PDF-");
        assertThat(pdf.length).isGreaterThan(10_000);
        String out = System.getenv("PAYMONTH_PDF_OUT");
        if (out != null) {
            Files.write(Path.of(out), pdf);
        }
    }

    @Test
    void 합계_행은_사원_줄의_합과_같다() {
        List<PayMonthListRow> rows = mapper.selectList(28000L, "01", LocalDate.of(2026, 2, 20));
        long pay = rows.stream().mapToLong(r -> r.paySum() == null ? 0 : r.paySum()).sum();
        String html = PayMonthListHtml.html(rows);
        assertThat(html).contains(new java.text.DecimalFormat("###,###,###").format(pay)).contains(" 합   계 ");
    }
}
