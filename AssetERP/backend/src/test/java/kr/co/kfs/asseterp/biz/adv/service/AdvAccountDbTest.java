package kr.co.kfs.asseterp.biz.adv.service;

import kr.co.kfs.asseterp.biz.adv.dto.AccountRes;
import kr.co.kfs.asseterp.biz.adv.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** Q01 일임계좌 등록: 조회(페이징)·저장(INSERT / UPDATE / 관리코드 중복)·엑셀 업로드를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AdvAccountService.class, AdvAccountUploadService.class})
class AdvAccountDbTest {

    @Autowired AdvAccountService service;
    @Autowired AdvAccountUploadService uploadService;

    private final UserPrincipal user = UserPrincipal.builder().userId(-1L).companyId(28000L).name("시험자").roles(List.of("ROLE_ADMIN")).build();

    private AccountSaveReq req(Long id, String code, String accountNo) {
        return new AccountSaveReq(id, code, "시험계좌", "00017", "KB증권", accountNo, LocalDate.of(2026, 10, 26), null, LocalDateTime.of(2026, 10, 26, 0, 0), "시험자");
    }

    @Test
    void 조회는_페이지_행과_전체_건수를_돌려주고_검색어는_관리코드와_계좌명을_본다() {
        PageRes<AccountRes> all = service.searchAccounts(user, "", 0, 5);
        assertThat(all.rows()).hasSize(5);
        assertThat(all.total()).isGreaterThan(5);
        PageRes<AccountRes> one = service.searchAccounts(user, "BR0029", 0, 500);
        assertThat(one.rows()).extracting(AccountRes::manageCode).contains("BR0029");
        assertThat(one.rows().get(0).accountNoDec()).isNotBlank();
    }

    @Test
    void 저장하면_새_행은_새_id로_들어가고_있는_행은_고쳐진다_계좌번호는_복호화해_돌려준다() {
        AccountRes inserted = service.saveAccount(user, req(null, "ZQ0001", "123-456"));
        assertThat(inserted.accountId()).isPositive();
        assertThat(inserted.companyId()).isEqualTo(28000L);
        assertThat(inserted.accountNoDec()).isEqualTo("123-456");

        AccountRes updated = service.saveAccount(user, req(inserted.accountId(), "ZQ0002", "999"));
        assertThat(updated.accountId()).isEqualTo(inserted.accountId());
        assertThat(updated.manageCode()).isEqualTo("ZQ0002");
        assertThat(updated.accountNoDec()).isEqualTo("999");
    }

    @Test
    void 다른_계좌가_쓰는_관리코드로_고치면_거절한다_새_행은_원본처럼_검사가_0건이다() {
        AccountRes a = service.saveAccount(user, req(null, "ZQ0010", "1"));
        AccountRes b = service.saveAccount(user, req(null, "ZQ0011", "2"));
        assertThatThrownBy(() -> service.saveAccount(user, req(b.accountId(), "ZQ0010", "2")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("이미 사용중인 관리코드입니다");
        // AS-IS `adv02_account_id != NULL` → 새 행은 같은 코드여도 저장된다(작업기록 제안)
        assertThat(service.saveAccount(user, req(null, a.manageCode(), "3")).accountId()).isNotEqualTo(a.accountId());
    }

    private MockMultipartFile xlsx(Object[]... rows) throws Exception {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("관리코드");
            for (int i = 0; i < rows.length; i++) {
                Row row = sheet.createRow(i + 1);
                for (int c = 0; c < rows[i].length; c++) {
                    if (rows[i][c] != null) {
                        row.createCell(c).setCellValue(rows[i][c].toString());
                    }
                }
            }
            wb.write(out);
            return new MockMultipartFile("excelUpload", "a.xlsx", "application/octet-stream", out.toByteArray());
        }
    }

    @Test
    void 엑셀업로드는_증권사명으로_코드를_찾아_등록하고_모르는_증권사나_중복_코드는_거절한다() throws Exception {
        assertThat(uploadService.upload(user, xlsx(new Object[]{"ZU0001", "업로드계좌", "777", "KB증권", "20260101", "20261231"}))).isEqualTo(1);
        AccountRes row = service.searchAccounts(user, "ZU0001", 0, 10).rows().get(0);
        assertThat(row.trCorpName()).isEqualTo("KB증권");
        assertThat(row.accountNoDec()).isEqualTo("777");
        assertThat(row.startDate()).isEqualTo(LocalDate.of(2026, 1, 1));
        assertThat(row.closeDate()).isEqualTo(LocalDate.of(2026, 12, 31));
        assertThat(row.worker()).isEqualTo("시험자");

        assertThatThrownBy(() -> uploadService.upload(user, xlsx(new Object[]{"ZU0002", "x", "1", "없는증권", "20260101"})))
                .isInstanceOf(BusinessException.class).hasMessage("등록되지않은 증권사명(없는증권)이 포함되어있습니다");
        assertThatThrownBy(() -> uploadService.upload(user, xlsx(new Object[]{"ZU0001", "x", "1", "KB증권", "20260101"})))
                .isInstanceOf(BusinessException.class).hasMessage("중복되는 관리코드(ZU0001)가 포함되어있습니다");
    }
}
