package kr.co.kfs.asseterp.biz.adv.service;

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

/** 일임 계좌정보·보유종목 엑셀 업로드(ExcelCells.forEachRow 적용 뒤)를 asseterpdb 에 넣어 보고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AdvAccountUploadService.class, AdvBookExtrService.class})
class AdvUploadDbTest {

    @Autowired AdvAccountUploadService accountUpload;
    @Autowired AdvBookExtrService bookExtr;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private String usableCorpName() {
        return jdbc.queryForObject("select sys15_corp_nm from sys15_corp where sys15_company_id = 28000 and coalesce(sys15_use_yn,'false') = 'true'"
                + " and coalesce(sys15_corp_type,'9') = '3' limit 1", String.class);
    }

    @Test
    void 계좌정보는_증권사명으로_코드를_찾아_한_행씩_넣는다() {
        int n = accountUpload.upload(user, xlsx(
                row("ZUP01", "시험계좌1", "111-111", usableCorpName(), "2026-01-01", null),
                row("ZUP02", "시험계좌2", "222-222", usableCorpName(), "2026-02-01", "2026-12-31")));
        assertThat(n).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from adv02_account where adv02_company_id = 28000 and adv02_manage_cd in ('ZUP01','ZUP02')", Integer.class)).isEqualTo(2);
        assertThat(jdbc.queryForObject("select adv02_manage_nm from adv02_account where adv02_company_id = 28000 and adv02_manage_cd = 'ZUP02'", String.class)).isEqualTo("시험계좌2");
        assertThat(jdbc.queryForObject("select adv02_close_date::text from adv02_account where adv02_company_id = 28000 and adv02_manage_cd = 'ZUP02'", String.class)).isEqualTo("2026-12-31");
    }

    @Test
    void 계좌정보는_없는_증권사_중복_관리코드_빈_첫칸을_문구와_함께_거절한다() {
        assertThatThrownBy(() -> accountUpload.upload(user, xlsx(row("ZUP03", "x", "1", "없는증권사XYZ", "2026-01-01", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("등록되지않은 증권사명(없는증권사XYZ)");
        String corp = usableCorpName();
        assertThatThrownBy(() -> accountUpload.upload(user, xlsx(row("ZUP04", "a", "1", corp, "2026-01-01", null), row("ZUP04", "b", "2", corp, "2026-01-01", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("중복되는 관리코드(ZUP04)");
        assertThatThrownBy(() -> accountUpload.upload(user, xlsx(row(null, "x", "1", corp, null, null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("비어있거나");
        assertThatThrownBy(() -> accountUpload.upload(user, null)).isInstanceOf(BusinessException.class).hasMessage("등록할 파일이 전달되지 않았습니다.");
    }

    @Test
    void 보유종목은_12자리_종목코드만_넣고_글자가_짧으면_거절한다() {
        int before = jdbc.queryForObject("select count(*) from adv11_book_extr where adv11_company_id = 28000", Integer.class);
        int n = bookExtr.upload(user, xlsx(row("2026-01-31", "ZUP01", "시험계좌1", "KR7005930003", "삼성전자")));
        assertThat(n).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from adv11_book_extr where adv11_company_id = 28000", Integer.class)).isEqualTo(before + 1);
        assertThat(jdbc.queryForObject("select adv11_item_nm from adv11_book_extr where adv11_company_id = 28000 and adv11_manage_cd = 'ZUP01' and adv11_item_cd = 'KR7005930003'", String.class)).isEqualTo("삼성전자");

        assertThatThrownBy(() -> bookExtr.upload(user, xlsx(row("2026-01-31", "ZUP01", "시험계좌1", "KR700593", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("12자리가 아닙니다");
        assertThatThrownBy(() -> bookExtr.upload(user, xlsx(row("2026-01-31", "ZUP01", "시험계좌1", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("종목코드는 필수입력");
    }
}
