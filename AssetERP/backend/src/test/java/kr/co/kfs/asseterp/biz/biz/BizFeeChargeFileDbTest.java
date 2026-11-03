package kr.co.kfs.asseterp.biz.biz;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeCalc;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizFeeChargeMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeChargeExcelService;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeChargePdfService;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeChargeService;
import kr.co.kfs.asseterp.biz.sys.mapper.SysFileMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.config.properties.PdfProperties;
import kr.co.kfs.asseterp.common.pdf.OpenPdfHtmlRenderer;

/**
 * EE33 최저보수 청구 후처리 — 운용사별 엑셀·PDF, 통합 엑셀, 계산상세 엑셀, zip 목록.
 * DB(asseterpdb)는 읽기만 한다. 파일 저장(SysFileService)은 가짜로 바꿔 만든 파일을 임시 폴더에 모아 열어 본다(03 원칙 2).
 * 눈으로 보려면 환경변수 FEECHARGE_OUT 에 폴더를 주면 그 폴더에도 복사한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({BizFeeChargeExcelService.class})
class BizFeeChargeFileDbTest {

    private static final LocalDate Q = LocalDate.of(2024, 6, 30);
    private static final String FONT = System.getProperty("user.home") + "/tmp/asseterp-data/fonts/NotoSansKR-Regular.ttf";

    @Autowired BizFeeChargeExcelService excelService;
    @Autowired BizFeeChargeMapper mapper;
    @Autowired BizRelateApprMapper relateApprMapper;
    @Autowired SysFileMapper sysFileMapper;
    @MockitoBean SysFileService sysFileService;

    private Path outDir;
    private final List<String> registered = new ArrayList<>();
    private final List<Long> parents = new ArrayList<>();

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @BeforeEach
    void fakeStorage() throws Exception {
        String out = System.getenv("FEECHARGE_OUT");
        outDir = out != null ? Path.of(out) : Files.createTempDirectory("feecharge-test");
        Files.createDirectories(outDir);
        when(sysFileService.registerRdFile(any(File.class), anyLong(), anyString(), anyString(), anyString())).thenAnswer(inv -> {
            File generated = inv.getArgument(0);
            String fileNm = inv.getArgument(3);
            Files.copy(generated.toPath(), outDir.resolve(fileNm), StandardCopyOption.REPLACE_EXISTING);
            registered.add(fileNm);
            parents.add(inv.getArgument(1));
            return 1L;
        });
    }

    private List<BizFeeChargeRes> targets(Long contCorpId) {
        return excelService.targets(28000L, Q, contCorpId);
    }

    @Test
    void 대상은_청구보수가_있고_확정되지_않은_행이다() {
        List<BizFeeChargeRes> all = targets(null);
        assertThat(all).isNotEmpty();
        assertThat(all).allSatisfy(r -> {
            assertThat(r.realFeeChargeId()).isNotNull();
            assertThat(r.fixYn()).isIn(null, "false");
        });
        long one = all.get(0).contCorpId();
        assertThat(targets(one)).isNotEmpty().allSatisfy(r -> assertThat(r.contCorpId()).isEqualTo(one));
    }

    @Test
    void 운영구분_1인_행마다_엑셀을_만든다() throws Exception {
        List<BizFeeChargeRes> all = targets(null);
        long type1 = all.stream().filter(r -> "1".equals(r.manageType())).count();
        int made = excelService.createFeeExcel(user(), Q, "2", null);
        assertThat(made).isEqualTo((int) type1);
        assertThat(registered).hasSize((int) type1).allSatisfy(n -> assertThat(n).endsWith("_2024년도_2분기_사무관리보수.xls"));

        // 한 파일을 열어 요약 칸이 청구 금액과 같은지 본다
        BizFeeChargeRes m = all.stream().filter(r -> "1".equals(r.manageType())).findFirst().orElseThrow();
        Path file = outDir.resolve(m.corpNm() + "_2024년도_2분기_사무관리보수.xls");
        assertThat(file).exists();
        try (HSSFWorkbook wb = new HSSFWorkbook(new ByteArrayInputStream(Files.readAllBytes(file)))) {
            HSSFSheet s = wb.getSheetAt(0);
            int f = mapper.selectDtlFundCodes(m.realFeeChargeId()).size();
            assertThat(s.getRow(0).getCell(0).getStringCellValue()).isEqualTo("No.");
            assertThat(s.getRow(1).getCell(f * 5 + 1).getStringCellValue()).isEqualTo("발생기간");
            assertThat(s.getRow(2).getCell(f * 5 + 2).getNumericCellValue()).isEqualTo((double) (nz(m.chargeFee()) + nz(m.occFee())));
            assertThat(s.getRow(3).getCell(f * 5 + 2).getNumericCellValue()).isEqualTo((double) nz(m.occFee()));
            assertThat(s.getRow(4).getCell(f * 5 + 2).getNumericCellValue()).isEqualTo((double) nz(m.chargeFee()));
            // 첫 펀드의 합계 칸 = 그 펀드 발생액의 합
            if (f > 0) {
                var dtl = mapper.selectDtlByFundCode(m.realFeeChargeId(), mapper.selectDtlFundCodes(m.realFeeChargeId()).get(0));
                long sum = dtl.stream().mapToLong(d -> nz(d.occFee())).sum();
                assertThat(s.getRow(dtl.size() + 1).getCell(4).getNumericCellValue()).isEqualTo((double) sum);
            }
        }
    }

    @Test
    void 계약사를_주면_그_계약사의_행만_만든다() {
        BizFeeChargeRes first = targets(null).stream().filter(r -> "1".equals(r.manageType())).findFirst().orElseThrow();
        int made = excelService.createFeeExcel(user(), Q, "2", first.contCorpId());
        assertThat(made).isPositive();
        assertThat(parents).allSatisfy(p -> assertThat(targets(first.contCorpId()).stream().map(BizFeeChargeRes::realFeeChargeId)).contains(p));
    }

    @Test
    void 운용사별_PDF를_만든다() throws Exception {
        BizFeeChargePdfService pdfService = new BizFeeChargePdfService(mapper, excelService, relateApprMapper,
                new OpenPdfHtmlRenderer(new PdfProperties(FONT, Map.of())), sysFileService);
        List<BizFeeChargeRes> all = targets(null);
        int made = pdfService.createFeePdf(user(), Q, "2", null);
        assertThat(made).isEqualTo(all.size());
        assertThat(registered).hasSize(all.size()).allSatisfy(n -> assertThat(n).endsWith("_2024년도_2분기_사무관리보수.pdf"));
        for (String n : registered) {
            byte[] pdf = Files.readAllBytes(outDir.resolve(n));
            assertThat(new String(pdf, 0, 5, java.nio.charset.StandardCharsets.ISO_8859_1)).isEqualTo("%PDF-");
        }
    }

    @Test
    void 통합_엑셀은_분기마다_네_칸씩_담는다() throws Exception {
        excelService.createTotalFeeExcel(user(), 999L, Q, "2");
        assertThat(registered).containsExactly("2024년도_2분기_사무관리보수.xls");
        assertThat(parents).containsExactly(999L);
        try (HSSFWorkbook wb = new HSSFWorkbook(new ByteArrayInputStream(Files.readAllBytes(outDir.resolve("2024년도_2분기_사무관리보수.xls"))))) {
            HSSFSheet s = wb.getSheetAt(0);
            assertThat(s.getRow(0).getLastCellNum()).isEqualTo((short) 8);
            assertThat(s.getRow(0).getCell(1).getStringCellValue()).contains("2분기");
            assertThat(s.getRow(0).getCell(5).getStringCellValue()).contains("1분기");
            // 2분기 블록: 운용사 줄 수 + 합계 줄, 합계 = 줄의 합
            List<BizFeeChargeRes> list = mapper.selectByChargeDate(28000L, Q, "%");
            long occ = list.stream().mapToLong(r -> nz(r.occFee())).sum();
            assertThat(s.getRow(list.size() + 1).getCell(1).getNumericCellValue()).isEqualTo((double) occ);
        }
    }

    @Test
    void 계산상세_엑셀은_머리_두_줄과_합계_행을_가진다() throws Exception {
        BizFeeChargeRes r = targets(null).get(0);
        List<BizFeeChargeCalc> calcs = mapper.selectCalcs(28000L, r.contCorpId(), Q);
        byte[] xls = excelService.calcExcel(user(), r.contCorpId(), Q);
        try (HSSFWorkbook wb = new HSSFWorkbook(new ByteArrayInputStream(xls))) {
            HSSFSheet s = wb.getSheetAt(0);
            assertThat(s.getNumMergedRegions()).isEqualTo(7);
            assertThat(s.getRow(0).getCell(3).getStringCellValue()).isEqualTo("운용보수");
            assertThat(s.getLastRowNum()).isEqualTo(calcs.size() + 2);
            assertThat(s.getRow(calcs.size() + 2).getCell(0).getStringCellValue()).isEqualTo("합계");
            assertThat(s.getRow(calcs.size() + 2).getCell(2).getNumericCellValue())
                    .isEqualTo((double) calcs.stream().mapToLong(c -> nz(c.termDays)).sum());
        }
    }

    @Test
    void zip_목록은_행마다_청구보수_첨부를_모은다() {
        BizFeeChargeService service = new BizFeeChargeService(mapper, sysFileService);
        List<Long> expected = new ArrayList<>();
        for (BizFeeChargeRes r : mapper.selectByChargeDate(28000L, Q, "%")) {
            if (r.realFeeChargeId() != null) {
                expected.addAll(mapper.selectFileIds(r.realFeeChargeId()));
            }
        }
        service.zipEntries(user(), Q);
        org.mockito.Mockito.verify(sysFileService).getZipEntries(any(), eq(expected));
    }

    private static long nz(Long v) {
        return v == null ? 0 : v;
    }
}
