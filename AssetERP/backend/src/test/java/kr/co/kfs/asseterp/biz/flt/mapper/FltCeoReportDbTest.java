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

/** J08 책임자보고(읽기 전용)를 asseterpdb에서 돌린다. 회사 28000, 2026년 9월 재직자. 기대 행 수는 AS-IS SQL 값(yunhee mapper-run --compare, 2026-11-13 복원 DB: 계좌 13·13, 신고대상 5, 매매명세 6 — DB를 바꾸면 다시 구한다). 엑셀·상신상태는 DB 사본에 기대지 않게 조회 결과와 비교 */
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

        // 매매명세는 신고 계좌가 없는 사원을 뺀다(noAccountSkipYnCheck=true) — AS-IS 6행
        List<CeoTrRes> trs = service.searchTrs(user, "2026-09-30", "2026-09-01", "100");
        assertThat(trs).hasSize(6).extracting(CeoTrRes::trId).doesNotHaveDuplicates();
    }

    @Test
    void 상신상태는_기준월의_A72_문서가_읽힌다() {
        // A72 문서가 있는 달을 찾는다(DB 사본마다 다르다). 상신 문서는 상태 코드·이름이 다 있다
        java.time.YearMonth ym = java.time.YearMonth.of(2027, 12);
        List<CeoApprRes> apprs = List.of();
        for (int i = 0; i < 72 && apprs.isEmpty(); i++, ym = ym.minusMonths(1)) {
            apprs = service.searchApprs(user, ym.atDay(1).toString());
        }
        assertThat(apprs).allMatch(r -> r.statusCode() != null && r.statusName() != null);
        assertThat(service.searchApprs(user, "1999-01-01")).isEmpty();
    }

    @Test
    void 엑셀은_시트_세_개가_나온다() throws IOException {
        // 시트마다 머리 1줄 + 그 탭 조회 행 수
        int accounts = service.searchAccounts(user, "2026-09-30", "2026-09-01", "100").size();
        int persons = service.searchReportPersons(user, "2026-09-30", "2026-09-01", "100").size();
        int trs = service.searchTrs(user, "2026-09-30", "2026-09-01", "100").size();
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(service.download(user, "2026-09-30", "2026-09-01", "100")))) {
            assertThat(wb.getNumberOfSheets()).isEqualTo(3);
            assertThat(wb.getSheetAt(0).getLastRowNum()).isEqualTo(accounts);
            assertThat(wb.getSheetAt(1).getLastRowNum()).isEqualTo(persons);
            assertThat(wb.getSheetAt(2).getLastRowNum()).isEqualTo(trs);
            assertThat(wb.getSheetAt(2).getRow(0).getLastCellNum()).isEqualTo((short) 17);
        }
    }
}
