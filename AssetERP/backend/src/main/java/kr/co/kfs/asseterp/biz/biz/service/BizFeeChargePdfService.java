package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeDtlRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizFeeChargeMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.pdf.HtmlPdfRenderer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.List;

/**
 * 최저보수 청구서 PDF (EE33, AS-IS utils.pdf.PDFCreate.createFeePDF → Biz21_PDF.getPDF L47-231).
 * 자료생성·엑셀 생성 뒤 운용사(계약사) 행마다 `{운용사}_{연도}년도_{분기}분기_사무관리보수.pdf` 를 청구보수 ID 의 첨부로 올린다
 * (운영구분 '1' 은 펀드별 발생액 요약, 그 밖은 일별 보수현황). 앞 단계(엑셀)가 기존 파일을 지우므로 여기서는 지우지 않는다.
 * AS-IS 와 같이 행 하나가 실패해도 로그만 남기고 다음 행으로 간다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BizFeeChargePdfService {

    /** AS-IS A4, 여백 위40·오른쪽50·아래40·왼쪽50(pt), 쪽 번호는 아래 가운데 `n / N` */
    private static final String PAGE_CSS = "@page { size: A4; margin: 40pt 50pt 40pt 50pt;"
            + " @bottom-center { content: counter(page) \" / \" counter(pages); font-family: NotoCustom; font-size: 9pt; } }"
            + " body { margin: 0; font-family: NotoCustom; }";

    private final BizFeeChargeMapper mapper;
    private final BizFeeChargeExcelService excelService;
    private final BizRelateApprMapper relateApprMapper;
    private final HtmlPdfRenderer renderer;
    private final SysFileService sysFileService;

    /**
     * @param contCorpId 있으면 그 계약사의 행만, 확정된 행은 제외(엑셀과 같은 조건)
     * @return 만든 파일 수
     */
    public int createFeePdf(UserPrincipal user, LocalDate chargeDate, String quarterStr, Long contCorpId) {
        int made = 0;
        String locName = relateApprMapper.selectLocName(user.getCompanyId());
        for (BizFeeChargeRes model : excelService.targets(user.getCompanyId(), chargeDate, contCorpId)) {
            try {
                String body;
                if ("1".equals(model.manageType())) {
                    List<BizFeeChargeDtlRes> list = mapper.selectDtlGroupFundName(model.realFeeChargeId());
                    body = FeeChargeHtml.content1(quarterStr, model, list);
                } else {
                    List<BizFeeChargeDtlRes> list = mapper.selectDtlByFeeChargeId(model.realFeeChargeId());
                    body = FeeChargeHtml.content2(model, list);
                }
                String html = "<html><head><meta charset=\"UTF-8\"/><style>" + PAGE_CSS + "</style></head><body>" + body + "</body></html>";
                byte[] pdf = renderer.render(html);
                File temp = Files.createTempFile("feecharge-pdf-", ".pdf").toFile();
                try {
                    Files.write(temp.toPath(), pdf);
                    String fileNm = model.corpNm() + "_" + chargeDate.getYear() + "년도_" + quarterStr + "분기_사무관리보수.pdf";
                    sysFileService.registerRdFile(temp, model.realFeeChargeId(), locName, fileNm, "pdf");
                    made++;
                } finally {
                    Files.deleteIfExists(temp.toPath());
                }
            } catch (Exception e) {
                log.error("최저보수 청구서 PDF 생성 실패 feeChargeId={}", model.realFeeChargeId(), e);
            }
        }
        return made;
    }
}
