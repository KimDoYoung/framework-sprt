package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.CeoAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoReportPersonRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoTrRes;
import kr.co.kfs.asseterp.biz.flt.service.FltCeoReportService;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** J08 책임자보고(읽기 전용)를 asseterpdb에서 돌린다. 회사 28000, 2026년 9월 재직자. 기대 행 수는 `yunhee analysis sql … --count`(AS-IS SQL) 값 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FltCeoReportService.class)
class FltCeoReportDbTest {

    @Autowired FltCeoReportService service;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    @Test
    void 세_탭은_AS_IS_SQL과_같은_행_수가_읽힌다() {
        List<CeoAccountRes> accounts = service.searchAccounts(user, "2026-09-30", "2026-09-01", "100");
        assertThat(accounts).hasSize(13).allMatch(r -> r.personName() != null && r.apprEffectDate() != null);
        assertThat(service.searchAccounts(user, "2026-09-30", "2026-09-01", "000")).hasSize(13);

        List<CeoReportPersonRes> persons = service.searchReportPersons(user, "2026-09-30", "2026-09-01", "100");
        assertThat(persons).hasSize(5).extracting(CeoReportPersonRes::trId).doesNotHaveDuplicates();

        // 매매명세는 신고 계좌가 없는 사원을 뺀다(noAccountSkipYnCheck=true) — AS-IS 7행 (끄면 13행)
        List<CeoTrRes> trs = service.searchTrs(user, "2026-09-30", "2026-09-01", "100");
        assertThat(trs).hasSize(7).extracting(CeoTrRes::trId).doesNotHaveDuplicates();
    }

    @Test
    void 상신상태는_기준월의_A72_문서가_읽힌다() {
        List<CeoApprRes> apprs = service.searchApprs(user, "2026-02-01");
        assertThat(apprs).hasSize(2).allMatch(r -> r.statusCode() != null && r.statusName() != null);
        assertThat(service.searchApprs(user, "2026-09-01")).isEmpty();
    }

    @Test
    void 엑셀은_시트_세_개가_나온다() throws IOException {
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(service.download(user, "2026-09-30", "2026-09-01", "100")))) {
            assertThat(wb.getNumberOfSheets()).isEqualTo(3);
            assertThat(wb.getSheetAt(0).getLastRowNum()).isEqualTo(13);
            assertThat(wb.getSheetAt(1).getLastRowNum()).isEqualTo(5);
            assertThat(wb.getSheetAt(2).getLastRowNum()).isEqualTo(7);
            assertThat(wb.getSheetAt(2).getRow(0).getLastCellNum()).isEqualTo((short) 17);
        }
    }
}
