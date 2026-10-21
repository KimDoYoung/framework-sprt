package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthEvalReq;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrRes;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.TrAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.ReportCheckRes;
import kr.co.kfs.asseterp.biz.flt.service.FltBookMonthService;
import kr.co.kfs.asseterp.biz.flt.service.FltRealTrService;
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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** I05 정기보고(매매내역 저장·삭제·월말 평가금액·점검)를 asseterpdb에서 실제로 돌리고 롤백한다. 실제 사원·계좌(회사 28000, 사원 29049)에 임시 행만 넣는다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FltRealTrService.class, FltBookMonthService.class})
class FltRealTrDbTest {

    @Autowired FltRealTrService service;
    @Autowired FltBookMonthService bookService;
    @Autowired FltTrMapper trMapper;

    private static final long ACCOUNT_ID = 202204070100311L;
    private static final String START = "2026-10-01";
    private static final String CLOSE = "2026-10-30";
    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private List<RealTrRes> period() {
        return service.search(user, ACCOUNT_ID, START, CLOSE, "시험종목", false, true);
    }

    @Test
    void 저장_수정_비우기_삭제() {
        RealTrRes saved = service.update(user, List.of(new RealTrSaveReq(-1L, "10I", ACCOUNT_ID, "2026-10-15", "10", " 시험종목 ", "KR7000000000", 3.0, 3000L, "비고")))
                .get(0);
        assertThat(saved.trId()).isPositive();
        assertThat(saved.trItemName()).isEqualTo("시험종목");          // 공백 제거
        assertThat(saved.trTypeName()).isEqualTo("매수");
        assertThat(saved.trAmt()).isEqualTo(3000L);
        assertThat(saved.accountRelateCode()).isNotNull();
        assertThat(period()).extracting(RealTrRes::trId).contains(saved.trId());

        RealTrRes changed = service.update(user, List.of(new RealTrSaveReq(saved.trId(), "10I", ACCOUNT_ID, "2026-10-15", "10", "시험종목", null, 4.0, 4000L, null))).get(0);
        assertThat(changed.trQty()).isEqualTo(4.0);
        assertThat(changed.trAmt()).isEqualTo(4000L);

        // 예치금(99)은 매매총액 = 매매수량
        RealTrRes deposit = service.update(user, List.of(new RealTrSaveReq(-2L, "50I", ACCOUNT_ID, "2026-10-15", "99", "시험종목 예치금", null, 7000.0, null, null))).get(0);
        assertThat(deposit.trAmt()).isEqualTo(7000L);

        // 사전신고가 없는 행은 비우기가 지우기
        assertThat(service.clear(user, List.of(saved.trId()))).isEqualTo(1);
        assertThat(period()).extracting(RealTrRes::trId).doesNotContain(saved.trId());

        // 다른 사원은 못 지운다
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(28000L).roles(List.of("ROLE_USER")).build();
        assertThat(service.delete(other, List.of(deposit.trId()))).isZero();
        assertThat(service.delete(user, List.of(deposit.trId()))).isEqualTo(1);
    }

    @Test
    void 안내_점검_영업일_한도는_읽힌다() {
        assertThat(service.bizDate(user, "2026-10-31")).isEqualTo("2026-10-30");
        assertThat(service.workingDay("2026-10-17")).isNotNull();
        service.empLimit(user, CLOSE);
        service.relateApprs(user, CLOSE);
        ReportCheckRes check = service.checkReport(user, CLOSE);
        assertThat(check.ok()).isNotNull();
        assertThat(service.template()).isNotEmpty();
    }

    @Test
    void 월말_평가금액은_읽고_평가처리한다() {
        List<BookMonthRes> rows = bookService.search(user, null, "2026-09-01", "2026-09-30", null, false);
        assertThat(rows).isNotNull();
        if (!rows.isEmpty()) {
            BookMonthRes r = rows.get(0);
            List<BookMonthRes> saved = bookService.update(user, List.of(new BookMonthSaveReq(r.bookMonthId(), r.accountId(), r.bookDate(),
                    r.itemType(), r.itemName(), r.itemCode(), 12345L, r.stkPriceYn())));
            assertThat(saved.get(0).bookAmt()).isEqualTo(12345L);
        }
        bookService.evaluate(user, new BookMonthEvalReq(null, "2026-09-01", "2026-09-30", null, "1"));
        // 평가처리 뒤에는 비어 있는 평가금액이 없거나(통과), 상장주식 종가가 없는 종목이 남아 메시지로 막힌다
        try {
            bookService.check(user, "2026-09-01", "2026-09-30", false);
        } catch (BusinessException e) {
            assertThat(e.getMessage()).contains("월말 평가금액");
        }
    }

    private MockMultipartFile excel(String accountNo, String itemType, String itemName, String itemCode) throws Exception {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("계좌번호");
            Row row = sheet.createRow(1);
            row.createCell(0).setCellValue(accountNo);
            row.createCell(1).setCellValue("20261015");
            row.createCell(2).setCellValue("10I");
            row.createCell(3).setCellValue(itemType);
            row.createCell(4).setCellValue(itemName);
            row.createCell(5).setCellValue(itemCode);
            row.createCell(6).setCellValue(2);
            row.createCell(7).setCellValue(2000);
            wb.write(out);
            return new MockMultipartFile("excelUpload", "t.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", out.toByteArray());
        }
    }

    @Test
    void 엑셀업로드는_계좌를_찾아_넣고_못_찾으면_막는다() throws Exception {
        String accountNo = trMapper.selectAccountsByDate(28000L, 29049L, "2026-10-21").stream()
                .map(TrAccountRes::accountNoDec).filter(no -> no != null && !no.startsWith("(")).findFirst().orElseThrow();
        assertThat(service.upload(user, excel(accountNo, "99", "시험종목 예치금", null))).isEqualTo(1);
        assertThat(service.search(user, ACCOUNT_ID, START, CLOSE, "시험종목 예치금", false, true).size() + service.search(user, null, START, CLOSE, "시험종목 예치금", false, true).size()).isPositive();
        assertThatThrownBy(() -> service.upload(user, excel("000-NO-SUCH-ACCOUNT", "99", "x", null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("존재하지 않는 계좌");
    }
}
