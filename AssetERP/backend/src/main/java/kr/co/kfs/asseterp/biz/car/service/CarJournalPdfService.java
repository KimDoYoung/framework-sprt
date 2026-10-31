package kr.co.kfs.asseterp.biz.car.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalRes;
import kr.co.kfs.asseterp.biz.car.mapper.CarJournalMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRelateApprMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.config.properties.PdfProperties;
import kr.co.kfs.asseterp.common.pdf.HtmlPdfRenderer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AS-IS utils.pdf.PDFCreate.createCarJournal → server/car/Car00_PDF7.getListDocument (V35):
 * 차량 운행일지 표를 A4 가로 PDF로 만들어 `{업로드 폴더}/{새 파일 ID}`로 두고 sys10_file에 상신 행(relateApprId)의 첨부로 올린다.
 * 파일명 `{접두사}_차량운행일지({차량번호}).pdf`.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CarJournalPdfService {

    /** AS-IS PageSize.A4.rotate(), 여백 10(pt). 쪽 번호는 아래 가운데 `n / N` (AS-IS는 세로 폭 기준 x라 가로 용지에서 왼쪽으로 치우쳐 찍힌다 — 이상한점 #48과 같다) */
    private static final String PAGE_CSS = "@page { size: A4 landscape; margin: 10pt 10pt 24pt 10pt;"
            + " @bottom-center { content: counter(page) \" / \" counter(pages); font-family: NotoCustom; font-size: 9pt; } }"
            + " body { margin: 0; font-family: NotoCustom; } table { table-layout: fixed; }";

    private final CarJournalMapper journalMapper;
    private final PayRelateApprMapper relateApprMapper;
    private final HtmlPdfRenderer renderer;
    private final SysFileService sysFileService;
    private final PdfProperties pdfProperties;

    /**
     * @return 올린 파일 ID. 운행일지가 없거나 주행거리가 비어 있으면 null(AS-IS도 `get(0)`·언박싱에서 실패해 파일을 만들지 않는다)
     */
    public Long createCarJournal(UserPrincipal user, Long relateApprId, Long infoId, String stdMonth) throws IOException {
        List<CarJournalRes> rows = journalMapper.selectByJournal(user.getCompanyId(), infoId, stdMonth);
        if (rows.isEmpty()) {
            log.warn("차량 운행일지 PDF 건너뜀 — 운행일지 없음 relateApprId={} infoId={} stdMonth={}", relateApprId, infoId, stdMonth);
            return null;
        }
        String body;
        try {
            body = CarJournalHtml.html(rows);
        } catch (NullPointerException e) {
            log.warn("차량 운행일지 PDF 건너뜀 — 주행거리가 비어 있음 relateApprId={} infoId={} stdMonth={}", relateApprId, infoId, stdMonth);
            return null;
        }
        String html = "<html><head><meta charset=\"UTF-8\"/><style>" + PAGE_CSS + "</style></head><body>" + body + "</body></html>";
        byte[] pdf = renderer.render(html);

        String locName = relateApprMapper.selectLocName(user.getCompanyId());
        String fileNm = pdfProperties.prefixOf(locName) + "_차량운행일지(" + rows.get(0).infoNm() + ").pdf";
        File temp = Files.createTempFile("carjournal-", ".pdf").toFile();
        try {
            Files.write(temp.toPath(), pdf);
            return sysFileService.registerRdFile(temp, relateApprId, locName, fileNm, "pdf");
        } finally {
            Files.deleteIfExists(temp.toPath());
        }
    }
}
