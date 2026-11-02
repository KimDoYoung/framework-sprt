package kr.co.kfs.asseterp.biz.act;

import kr.co.kfs.asseterp.biz.act.dto.JournalDtlListRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRdReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubRdReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubRes;
import kr.co.kfs.asseterp.biz.act.service.ActJournalDtlService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
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

/** X15 분개장·X17 계정별원장의 출력 임시행(sys99_print)·엑셀을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ActJournalDtlService.class)
class ActJournalDtlDbTest {

    private static final LocalDate START = LocalDate.of(2026, 1, 1);
    private static final LocalDate CLOSE = LocalDate.of(2026, 6, 30);
    private static final String ACCOUNT = "3201010000";

    @Autowired ActJournalDtlService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private int printRows(String windowClass, long groupId) {
        return jdbc.queryForObject("select count(*) from sys99_print where sys99_company_id = 28000 and sys99_person_id = 29049 and sys99_window_class_nm = ? and sys99_group_id = ?",
                Integer.class, windowClass, groupId);
    }

    @Test
    void 계정별원장_엑셀은_계정마다_시트이고_월계_누계_줄이_있다() throws Exception {
        List<JournalSubRes> list = service.searchByAccountCode(user, START, CLOSE, ACCOUNT, null, null, null, null);
        assertThat(list).isNotEmpty();
        byte[] bytes = service.downloadAccountExcel(user, START, CLOSE, ACCOUNT);
        try (XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            assertThat(wb.getNumberOfSheets()).isGreaterThanOrEqualTo(1);
            Sheet sheet = wb.getSheetAt(0);
            assertThat(sheet.getSheetName()).startsWith("0_").hasSizeLessThanOrEqualTo(31);
            assertThat(sheet.getRow(0).getCell(0).getStringCellValue()).isEqualTo("계   정   별   원   장");
            assertThat(sheet.getRow(1).getCell(0).getStringCellValue()).isEqualTo("2026-01-01 ~ 2026-06-30");
            assertThat(sheet.getRow(3).getCell(0).getStringCellValue()).isEqualTo("분개일자");
            // 데이터 줄 + 월 계·누 계 줄 쌍
            int monthRows = 0;
            for (Row r : sheet) {
                if (r.getCell(1) != null && "[   월     계   ]".equals(r.getCell(1).getStringCellValue())) monthRows++;
            }
            assertThat(monthRows).isGreaterThanOrEqualTo(1);
            assertThat(sheet.getLastRowNum() + 1).isEqualTo(4 + list.size() + monthRows * 2);
        }
    }

    @Test
    void 계정별원장_출력_준비는_조회_결과만큼_임시행을_만든다() {
        List<JournalSubRes> list = service.searchByAccountCode(user, START, CLOSE, ACCOUNT, null, null, null, null);
        long groupId = service.insertRdSub(user, new JournalSubRdReq("X17_TEST", START, CLOSE, ACCOUNT, null, null, null, ""));
        assertThat(printRows("X17_TEST", groupId)).isEqualTo(list.size());
    }

    @Test
    void 분개장_출력_준비는_선택한_전표만_만든다() {
        List<JournalDtlListRes> all = service.searchList(user, START, CLOSE, null, null, null, "0");
        assertThat(all).isNotEmpty();
        Long journalId = all.get(0).journalId();
        long expected = all.stream().filter(r -> r.journalId().equals(journalId)).count();
        long allGroup = service.insertRd(user, new JournalDtlRdReq("X15_TEST", START, CLOSE, null, "", null, "0", List.of()));
        assertThat(printRows("X15_TEST", allGroup)).isEqualTo(all.size());
        long oneGroup = service.insertRd(user, new JournalDtlRdReq("X15_TEST", START, CLOSE, null, "", null, "0", List.of(journalId)));
        assertThat(printRows("X15_TEST", oneGroup)).isEqualTo((int) expected);
        // 같은 화면 클래스의 앞 출력은 지워진다
        assertThat(printRows("X15_TEST", allGroup)).isZero();
    }
}
