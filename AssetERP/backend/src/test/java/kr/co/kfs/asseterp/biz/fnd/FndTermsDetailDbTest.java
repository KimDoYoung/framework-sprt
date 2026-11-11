package kr.co.kfs.asseterp.biz.fnd;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRevisionSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsUpdateReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndTermsDetailService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * #1503 펀드규약 등록 · #1504 펀드규약 (원본 2026-10-28 "펀드규약수정", CH-0030~0035·0117·0172~0177)을 asseterpdb에서 돌리고 롤백한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FndTermsDetailService.class)
class FndTermsDetailDbTest {

    private static final long FUND_A = 34218L;   // 시험 DB 28000 펀드(정식명 글로벌일반사모부동산투자신탁5호)

    @Autowired FndTermsDetailService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_ADMIN")).build();

    private TermsRevisionSaveReq req(String mode, Long termsId, Long fundId) {
        return new TermsRevisionSaveReq(mode, null, null, null, termsId, "1", null, 99L, fundId, null, "<p>내용</p>", "비고",
                LocalDate.of(2026, 10, 1), 900L, true);
    }

    @Test
    void 규약목록은_개정이_없는_규약도_나오고_펀드정식명과_만기일을_준다() {
        int terms = jdbc.queryForObject("select count(*) from fnd25_terms where fnd25_company_id = 28000", Integer.class);
        // 원본: 개정 INNER JOIN → LEFT JOIN. 사용 중인 개정이 없는 규약을 하나 만든다
        jdbc.update("update fnd26_terms_detail set fnd26_use_yn = 'false' where fnd26_terms_id = (select min(fnd25_terms_id) from fnd25_terms where fnd25_company_id = 28000)");
        assertThat(service.searchTerms(user, "", "")).hasSize(terms);

        service.saveRevision(user, req("insert", null, FUND_A));
        TermsRes row = service.searchTerms(user, "", "").stream().filter(r -> Long.valueOf(FUND_A).equals(r.fundId())).findFirst().orElseThrow();
        assertThat(row.fundFullName()).isEqualTo("글로벌일반사모부동산투자신탁5호");
        assertThat(service.searchTermsView(user, "", "")).anyMatch(v -> "글로벌일반사모부동산투자신탁5호".equals(v.fundFullName()));
    }

    @Test
    void 예탁원펀드코드는_필수이고_중복검사는_새_규약만() {
        assertThatThrownBy(() -> service.saveRevision(user, req("insert", null, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("예탁원펀드코드는 필수선택사항입니다.");

        service.saveRevision(user, req("insert", null, FUND_A));
        Long termsId = jdbc.queryForObject("select fnd25_terms_id from fnd25_terms where fnd25_company_id = 28000 and fnd25_fund_id = ?", Long.class, FUND_A);

        // 다른 새 규약에 같은 펀드 → 막는다(insert만 ksdFundCheck)
        assertThatThrownBy(() -> service.saveRevision(user, req("insert", null, FUND_A)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("사용중인 예탁원코드입니다.");
        // 다른 규약에 개정 추가(new)는 같은 펀드여도 검사하지 않는다(원본 2026-10-28)
        Long other = jdbc.queryForObject("select min(fnd25_terms_id) from fnd25_terms where fnd25_company_id = 28000 and fnd25_terms_id <> ?", Long.class, termsId);
        service.saveRevision(user, new TermsRevisionSaveReq("new", null, null, null, other, "1", null, 99L, FUND_A, null, "x", null,
                LocalDate.of(2026, 10, 2), 901L, true));

        assertThatThrownBy(() -> service.updateTerms(user, termsId, new TermsUpdateReq("1", 1L, null, null, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("펀드코드는 필수 선택입니다.");
    }

    @Test
    void 엑셀은_회사의_모든_개정을_원본_열_순서로_쓴다() throws Exception {
        int details = jdbc.queryForObject("select count(*) from fnd26_terms_detail join fnd25_terms on fnd25_terms_id = fnd26_terms_id where fnd25_company_id = 28000", Integer.class);
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(service.download(user)))) {
            Sheet sheet = wb.getSheetAt(0);
            assertThat(sheet.getRow(0).getCell(0).getStringCellValue()).isEqualTo("구분");
            assertThat(sheet.getRow(0).getCell(2).getStringCellValue()).isEqualTo("펀드명");
            assertThat(sheet.getRow(0).getCell(12).getStringCellValue()).isEqualTo("작성(변경)일");
            assertThat(sheet.getLastRowNum()).isEqualTo(details);
        }
    }
}
