package kr.co.kfs.asseterp.biz.crd.service;

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

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** 법인카드 엑셀 업로드(ExcelCells.forEachRow 적용 뒤)를 asseterpdb 에 넣어 보고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(CrdCardUploadService.class)
class CrdCardUploadDbTest {

    @Autowired CrdCardUploadService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 카드는_사용중_신용카드로_넣고_카드번호_두번째_칸이_없으면_첫칸을_쓴다() {
        int n = service.upload(user, xlsx(
                row("2026-01-01", "시험카드1", "1111-2222", "9999", "B01", "비고1"),
                row("2026-02-01", null, "3333-4444", null, null, null)));
        assertThat(n).isEqualTo(2);
        assertThat(jdbc.queryForObject("select crd01_card_no from crd01_card where crd01_company_id = 28000 and crd01_card_no_slip = '1111-2222'", String.class)).isEqualTo("9999");
        assertThat(jdbc.queryForObject("select crd01_card_no from crd01_card where crd01_company_id = 28000 and crd01_card_no_slip = '3333-4444'", String.class)).isEqualTo("3333-4444");
        assertThat(jdbc.queryForObject("select crd01_close_yn || '/' || crd01_card_type from crd01_card where crd01_company_id = 28000 and crd01_card_no_slip = '1111-2222'", String.class)).isEqualTo("true/1");
    }

    @Test
    void 시작일자_카드번호가_빠지면_문구와_함께_거절한다() {
        assertThatThrownBy(() -> service.upload(user, xlsx(row(null, "x", "1"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("시작일자는 필수입력");
        assertThatThrownBy(() -> service.upload(user, xlsx(row("2026-01-01", "x", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("카드번호는 필수입력");
    }
}
