package kr.co.kfs.asseterp.biz.car.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import kr.co.kfs.asseterp.biz.car.dto.CarJournalRes;
import kr.co.kfs.asseterp.biz.car.mapper.CarJournalMapper;
import kr.co.kfs.asseterp.common.config.properties.PdfProperties;
import kr.co.kfs.asseterp.common.pdf.OpenPdfHtmlRenderer;

/** V35 차량 운행일지 PDF — 실제 운행일지로 HTML을 만들어 OpenPDF + Flying Saucer로 PDF를 뽑는다(DB는 읽기만) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CarJournalPdfRenderTest {

    private static final String FONT = System.getProperty("user.home") + "/tmp/asseterp-data/fonts/NotoSansKR-Regular.ttf";
    private static final long INFO = 202207080259701L;
    private static final String YM = "2025.09";

    @Autowired CarJournalMapper mapper;

    @Test
    void 운행일지_PDF를_만든다() throws Exception {
        List<CarJournalRes> rows = mapper.selectByJournal(28000L, INFO, YM);
        assertThat(rows).isNotEmpty();
        String html = "<html><head><meta charset=\"UTF-8\"/><style>"
                + "@page { size: A4 landscape; margin: 10pt 10pt 24pt 10pt; @bottom-center { content: counter(page) \" / \" counter(pages); font-family: NotoCustom; font-size: 9pt; } }"
                + " body { margin: 0; font-family: NotoCustom; } table { table-layout: fixed; }</style></head><body>" + CarJournalHtml.html(rows) + "</body></html>";
        byte[] pdf = new OpenPdfHtmlRenderer(new PdfProperties(FONT, Map.of())).render(html);
        assertThat(new String(pdf, 0, 5, java.nio.charset.StandardCharsets.ISO_8859_1)).isEqualTo("%PDF-");
        assertThat(pdf.length).isGreaterThan(10_000);
        String out = System.getenv("CARJOURNAL_PDF_OUT");
        if (out != null) {
            Files.write(Path.of(out), pdf);
        }
    }

    @Test
    void 같은_서버에서_두_번_만들어도_합계가_같다() {
        List<CarJournalRes> rows = mapper.selectByJournal(28000L, INFO, YM);
        long total = rows.stream().mapToLong(CarJournalRes::mileage).sum();
        String first = CarJournalHtml.html(rows);
        String second = CarJournalHtml.html(rows);   // AS-IS는 static 합계를 null로 둬서 두 번째 호출이 NullPointerException (이상한점 #84)
        assertThat(second).isEqualTo(first);
        assertThat(first).contains("차 량 운 행 일 지").contains("1.기본사항").contains("2.운행기록")
                .contains(new java.text.DecimalFormat("###,###,###").format(total));
        // 빈 칸 36개 줄 1 + 빈 줄 1 + 제목 1 + 빈 줄 3 + 1.기본사항 1 + 머리 2 + 값 1 + 빈 줄 1 + 2.운행기록 1 + 머리 3 = 15, 그 뒤 운행 N줄 + 주석 2줄
        assertThat(first.split("<tr>", -1).length - 1).isEqualTo(15 + rows.size() + 2);
    }

    @Test
    void 주행거리가_비면_표를_만들지_못한다() {
        List<CarJournalRes> rows = mapper.selectByJournal(28000L, INFO, YM);
        CarJournalRes r = rows.get(0);
        CarJournalRes blank = new CarJournalRes(r.journalId(), r.companyId(), r.infoId(), r.date(), r.personId(), null, r.beforeMileage(), r.afterMileage(),
                r.commuteMileage(), r.bizMileage(), r.unBizMileage(), r.destination(), r.reason(), r.note(), r.bookingId(), r.fixYn(), r.closeYn(),
                r.businessMileage(), r.infoNm(), r.infoPersonNm());
        org.junit.jupiter.api.Assertions.assertThrows(NullPointerException.class, () -> CarJournalHtml.html(List.of(blank)));
    }
}
