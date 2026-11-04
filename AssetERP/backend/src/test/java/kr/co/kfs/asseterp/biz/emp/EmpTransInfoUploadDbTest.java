package kr.co.kfs.asseterp.biz.emp;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoUploadService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
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

/** SEU03 ExcelUpload empUpload — asseterpdb에서 실제로 넣어 보고 롤백한다 (@MybatisTest는 테스트마다 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(EmpTransInfoUploadService.class)
class EmpTransInfoUploadDbTest {

    @Autowired EmpTransInfoUploadService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal manager = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private static MockMultipartFile xlsx(Object[]... rows) throws Exception {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet s = wb.createSheet();
            Row head = s.createRow(0);
            head.createCell(0).setCellValue("사번");
            for (int r = 0; r < rows.length; r++) {
                Row row = s.createRow(r + 1);
                for (int c = 0; c < rows[r].length; c++) {
                    Object v = rows[r][c];
                    if (v instanceof Number n) row.createCell(c).setCellValue(n.doubleValue());
                    else if (v != null) row.createCell(c).setCellValue(v.toString());
                }
            }
            wb.write(out);
            return new MockMultipartFile("excelUpload", "emp.xlsx", "application/octet-stream", out.toByteArray());
        }
    }

    private static Object[] ok(Object empNo, String name) {
        // 사번, 이름, 사원구분, 입사일, 이메일, 휴대폰, 직책, 직위, 발령구분, 조직코드, 회사번호, 내선
        return new Object[]{empNo, name, 10, "2026.11.04", "t@t.kr", "010-0000-0000", 250, 650, 100, 11000, "02-000-0000", "999"};
    }

    @Test
    void 사원_두명을_사람_기타_발령_급여공제까지_만든다() throws Exception {
        int count = service.upload(manager, xlsx(ok(990001, "시 험"), ok("ZZ-UP2", "시험이")));
        assertThat(count).isEqualTo(2);

        assertThat(jdbc.queryForObject("select emp01_kor_nm from emp01_person where emp01_company_id=28000 and emp01_emp_no='990001'", String.class))
                .isEqualTo("시험");  // 이름 공백 제거, 숫자 사번은 정수 문자열
        Long personId = jdbc.queryForObject("select emp01_person_id from emp01_person where emp01_company_id=28000 and emp01_emp_no='ZZ-UP2'", Long.class);
        assertThat(jdbc.queryForObject("select count(*) from emp02_others where emp02_person_id=?", Integer.class, personId)).isEqualTo(1);
        assertThat(jdbc.queryForMap("select emp03_trans_cd, emp03_kind_cd, emp03_pos_cd, emp03_title_cd, to_char(emp03_trans_date,'yyyy-mm-dd') d from emp03_trans where emp03_person_id=?", personId))
                .containsEntry("emp03_trans_cd", "100").containsEntry("emp03_kind_cd", "10").containsEntry("emp03_pos_cd", "650")
                .containsEntry("emp03_title_cd", "250").containsEntry("d", "2026-11-04");
        assertThat(jdbc.queryForObject("select emp35_basic_deduct_cnt::int || '/' || emp35_with_hold_rate::int from emp35_deduct where emp35_person_id=?", String.class, personId))
                .isEqualTo("1/100");
    }

    @Test
    void 없는_코드나_중복_사번은_메시지와_함께_전체를_되돌린다() throws Exception {
        Object[] badKind = ok("ZZ-BAD", "오류");
        badKind[2] = "XX";
        assertThatThrownBy(() -> service.upload(manager, xlsx(ok("ZZ-OK", "정상"), badKind)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("2행").hasMessageContaining("사원구분 코드 'XX'");

        Object[] badOrg = ok("ZZ-ORG", "조직");
        badOrg[9] = "NOORG";
        assertThatThrownBy(() -> service.upload(manager, xlsx(badOrg))).hasMessageContaining("조직코드 'NOORG'");

        assertThatThrownBy(() -> service.upload(manager, xlsx(ok("T003", "중복")))).hasMessageContaining("이미 사용 중");
    }

    @Test
    void 회사관리자만_올릴_수_있다() throws Exception {
        UserPrincipal normal = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();
        assertThatThrownBy(() -> service.upload(normal, xlsx(ok("ZZ-N", "일반")))).isInstanceOf(BusinessException.class);
    }
}
