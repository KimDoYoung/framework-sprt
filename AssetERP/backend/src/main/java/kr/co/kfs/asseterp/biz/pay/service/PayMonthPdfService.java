package kr.co.kfs.asseterp.biz.pay.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthListRow;
import kr.co.kfs.asseterp.biz.pay.mapper.PayMonthMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRelateApprMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.config.properties.PdfProperties;
import kr.co.kfs.asseterp.common.pdf.HtmlPdfRenderer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AS-IS utils.pdf.PDFCreate.createPayMonth10 → server/pay/Pay00_PDF7.getList10Document L125-190 (V25):
 * 급여대장 사원별 표를 A4 가로 PDF로 만들어 `{업로드 폴더}/{새 파일 ID}`로 두고 sys10_file에 상신 행(relateApprId)의 첨부로 올린다.
 * 파일명 `{접두사}_{yyyy_MM_dd}_급여대장.pdf`.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PayMonthPdfService {

    /** AS-IS PageSize.A4.rotate(), 여백 10(pt). 쪽 번호는 아래 가운데 `n / N` */
    private static final String PAGE_CSS = "@page { size: A4 landscape; margin: 10pt 10pt 24pt 10pt;"
            + " @bottom-center { content: counter(page) \" / \" counter(pages); font-family: NotoCustom; font-size: 9pt; } }"
            + " body { margin: 0; font-family: NotoCustom; } table { table-layout: fixed; }"; // 열 폭 고정(원본 표의 첫 빈 행이 정한 폭)

    private final PayMonthMapper monthMapper;
    private final PayRelateApprMapper relateApprMapper;
    private final HtmlPdfRenderer renderer;
    private final SysFileService sysFileService;
    private final PdfProperties pdfProperties;

    /**
     * @return 올린 파일 ID. 사원 내역이 없으면 null(AS-IS도 `month10List.get(0)`에서 실패해 파일을 만들지 않는다)
     */
    public Long createPayMonth10(UserPrincipal user, Long relateApprId, String payCode, LocalDate payDate) throws IOException {
        List<PayMonthListRow> rows = monthMapper.selectList(user.getCompanyId(), payCode, payDate);
        if (rows.isEmpty()) {
            log.warn("급여대장 PDF 건너뜀 — 사원 내역 없음 relateApprId={} payCode={} payDate={}", relateApprId, payCode, payDate);
            return null;
        }
        String html = "<html><head><meta charset=\"UTF-8\"/><style>" + PAGE_CSS + "</style></head><body>"
                + PayMonthListHtml.html(rows) + "</body></html>";
        byte[] pdf = renderer.render(html);

        String locName = relateApprMapper.selectLocName(user.getCompanyId());
        String fileNm = pdfProperties.prefixOf(locName) + "_" + payDate.format(DateTimeFormatter.ofPattern("yyyy_MM_dd")) + "_급여대장.pdf";
        File temp = Files.createTempFile("paymonth10-", ".pdf").toFile();
        try {
            Files.write(temp.toPath(), pdf);
            return sysFileService.registerRdFile(temp, relateApprId, locName, fileNm, "pdf");
        } finally {
            Files.deleteIfExists(temp.toPath()); // registerRdFile이 옮겼으면 이미 없다
        }
    }
}
