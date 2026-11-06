package kr.co.kfs.asseterp.biz.bbs;

import static kr.co.kfs.asseterp.support.XlsxFiles.row;
import static kr.co.kfs.asseterp.support.XlsxFiles.xlsx;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.service.BbsCompanyRuleService;
import kr.co.kfs.asseterp.common.config.properties.UploadProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** 사규 엑셀 업로드(ExcelCells.forEachRow 적용 뒤)를 asseterpdb 에 넣어 보고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(BbsCompanyRuleService.class)
class BbsCompanyRuleUploadDbTest {

    @MockitoBean UploadProperties uploadProperties;  // 업로드는 첨부 폴더를 쓰지 않는다

    @Autowired BbsCompanyRuleService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal normal = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private int rules() {
        return jdbc.queryForObject("select count(*) from bbs15_company_rule where bbs15_company_id = 28000", Integer.class);
    }

    @Test
    void 구분_규정코드_제개정일_회차_규정명을_공개로_넣는다() {
        String type = jdbc.queryForObject("select coalesce((select bbs15_rule_type from bbs15_company_rule where bbs15_company_id = 28000 limit 1), '1')", String.class);
        int before = rules();
        int n = service.upload(admin, xlsx(
                row(type, "ZRULE01", "2026-01-01", 3, "시험사규1"),
                row(type, "ZRULE02", "20260201", null, "시험사규2")));
        assertThat(n).isEqualTo(2);
        assertThat(rules()).isEqualTo(before + 2);
        assertThat(jdbc.queryForObject("select bbs15_title from bbs15_company_rule where bbs15_company_id = 28000 and bbs15_company_rule_cd = 'ZRULE01'", String.class)).isEqualTo("시험사규1");
        assertThat(jdbc.queryForObject("select bbs15_revision_no from bbs15_company_rule where bbs15_company_id = 28000 and bbs15_company_rule_cd = 'ZRULE01'", Long.class)).isEqualTo(3L);
        assertThat(jdbc.queryForObject("select bbs15_revision_date::text from bbs15_company_rule where bbs15_company_id = 28000 and bbs15_company_rule_cd = 'ZRULE02'", String.class)).isEqualTo("2026-02-01");
    }

    @Test
    void 관리자가_아니거나_빈_첫칸이거나_날짜가_틀리면_거절한다() {
        assertThatThrownBy(() -> service.upload(normal, xlsx(row("1", "ZRULE03", "2026-01-01", 1, "x")))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.upload(admin, xlsx(row((Object) null)))).isInstanceOf(BusinessException.class).hasMessageContaining("비어있거나");
        assertThatThrownBy(() -> service.upload(admin, xlsx(row("1", "ZRULE04", "날짜아님", 1, "x")))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.upload(admin, null)).isInstanceOf(BusinessException.class).hasMessage("등록할 파일이 전달되지 않았습니다.");
    }
}
