package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SEU08 ExcelUpload demandOprFundUpload(공모주 수요예측 신청: 코드·펀드명·신청수량·신청금액·구분) — asseterpdb에서 넣어 보고 롤백 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FndOprFundService.class)
class FndOprFundUploadDbTest {

    private static final long OPR_ID = 202407041716327L;  // 28000사 수요예측(02) 종목, 결재완료 아님

    @Autowired FndOprFundService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private static MockMultipartFile xlsx(Object[]... rows) throws Exception {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            var s = wb.createSheet();
            s.createRow(0).createCell(0).setCellValue("펀드코드");
            for (int r = 0; r < rows.length; r++) {
                Row row = s.createRow(r + 1);
                for (int c = 0; c < rows[r].length; c++) {
                    Object v = rows[r][c];
                    if (v instanceof Number n) row.createCell(c).setCellValue(n.doubleValue());
                    else if (v != null) row.createCell(c).setCellValue(v.toString());
                }
            }
            wb.write(out);
            return new MockMultipartFile("excelUpload", "demand.xlsx", "application/octet-stream", out.toByteArray());
        }
    }

    @Test
    void 수요예측_신청을_펀드와_일임계좌로_넣는다() throws Exception {
        int before = jdbc.queryForObject("select count(*) from fnd31_opr_fund where fnd31_opr_id=?", Integer.class, OPR_ID);
        // 구분 1 = 운용펀드(펀드코드), 2 = 일임(자문)(관리코드)
        int n = service.upload(user, OPR_ID, xlsx(new Object[]{"40510", "펀드", 1000, 5000000, 1}, new Object[]{"BR0020", "계좌", 300, 1500000.0, 2}));
        assertThat(n).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from fnd31_opr_fund where fnd31_opr_id=?", Integer.class, OPR_ID)).isEqualTo(before + 2);
        assertThat(jdbc.queryForObject("select sum(fnd31_qty)::bigint || '/' || sum(fnd31_settle_amt)::bigint from fnd31_opr_fund where fnd31_opr_id=? and fnd31_fund_advice_type in ('1','2') and fnd31_price is null and fnd31_qty in (1000,300)", String.class, OPR_ID))
                .isEqualTo("1300/6500000");
    }

    @Test
    void 없는_펀드코드와_구분_없음은_메시지와_함께_취소한다() throws Exception {
        assertThatThrownBy(() -> service.upload(user, OPR_ID, xlsx(new Object[]{"NOFUND", "x", 1, 1, 1})))
                .isInstanceOf(BusinessException.class).hasMessageContaining("NOFUND");
        assertThatThrownBy(() -> service.upload(user, OPR_ID, xlsx(new Object[]{"40510", "x", 1, 1})))
                .isInstanceOf(BusinessException.class).hasMessageContaining("구분이 없습니다");
    }
}
