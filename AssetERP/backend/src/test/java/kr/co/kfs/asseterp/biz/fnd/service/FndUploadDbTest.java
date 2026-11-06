package kr.co.kfs.asseterp.biz.fnd.service;

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

/** 펀드·계좌·보유종목 엑셀 업로드(ExcelCells.forEachRow 적용 뒤)를 asseterpdb 에 넣어 보고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FndFundUploadService.class, FndAccountService.class, FndBookExtrService.class})
class FndUploadDbTest {

    @Autowired FndFundUploadService fundUpload;
    @Autowired FndAccountService accountUpload;
    @Autowired FndBookExtrService bookExtr;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    /** 펀드 업로드 한 줄: 펀드코드(0)·펀드명(4)·설정일(9)·해지일(13)·해지구분(14) 만 채운다 */
    private static Object[] fundRow(String code, String name, String start, String end, String closeYn) {
        Object[] r = new Object[23];
        r[0] = code;
        r[4] = name;
        r[9] = start;
        r[13] = end;
        r[14] = closeYn;
        return r;
    }

    @Test
    void 펀드는_새_코드면_펀드와_정보를_넣고_있는_코드면_정보만_다시_넣는다() {
        assertThat(fundUpload.upload(user, xlsx(fundRow("ZUPF01", "시험펀드", "2026-01-01", "2026-12-31", "Y")))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from fnd01_fund_code where fnd01_fund_cd = 'ZUPF01'", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select fnd01_close_yn from fnd01_fund_code where fnd01_fund_cd = 'ZUPF01'", String.class)).isEqualTo("true");
        assertThat(jdbc.queryForObject("select count(*) from fnd02_fund_info i join fnd01_fund_code c on c.fnd01_fund_code_id = i.fnd02_fund_code_id"
                + " where c.fnd01_fund_cd = 'ZUPF01'", Integer.class)).isEqualTo(1);

        // 같은 코드를 다시 올리면 펀드는 그대로, 정보만 다시 (같은 작업일이면 지우고 다시 넣어 한 건)
        assertThat(fundUpload.upload(user, xlsx(fundRow("ZUPF01", "시험펀드수정", "2026-01-01", "2026-12-31", "N")))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from fnd01_fund_code where fnd01_fund_cd = 'ZUPF01'", Integer.class)).isEqualTo(1);
    }

    @Test
    void 펀드는_없는_사무수탁사_협회코드를_행_번호와_함께_거절한다() {
        Object[] bad = fundRow("ZUPF02", "x", "2026-01-01", null, null);
        bad[18] = "NOOFFICE";
        assertThatThrownBy(() -> fundUpload.upload(user, xlsx(bad)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("2행의 사무수탁사 협회코드(NOOFFICE)");
    }

    @Test
    void 계좌는_개설일자만_있어도_넣고_이름을_못_찾으면_문구와_함께_거절한다() {
        Object[] ok = new Object[13];
        ok[0] = "2026-01-01";
        ok[5] = "시험펀드계좌";
        ok[6] = "999-000";
        int before = jdbc.queryForObject("select count(*) from fnd32_account where fnd32_company_id = 28000", Integer.class);
        assertThat(accountUpload.upload(user, xlsx(ok))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from fnd32_account where fnd32_company_id = 28000", Integer.class)).isEqualTo(before + 1);

        Object[] noCorp = new Object[13];
        noCorp[0] = "2026-01-01";
        noCorp[1] = "없는증권사XYZ";
        assertThatThrownBy(() -> accountUpload.upload(user, xlsx(noCorp)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("[없는증권사XYZ] 해당하는 증권사가 존재하지 않습니다.");
        assertThatThrownBy(() -> accountUpload.upload(user, xlsx(row("2026/01/01"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("개설일자를 읽을 수 없습니다");
        assertThatThrownBy(() -> accountUpload.upload(user, xlsx(row((Object) null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("비어있거나");
    }

    @Test
    void 보유종목은_12자리_종목코드만_넣고_빠진_칸은_문구와_함께_거절한다() {
        int before = jdbc.queryForObject("select count(*) from fnd11_book_extr where fnd11_company_id = 28000", Integer.class);
        assertThat(bookExtr.upload(user, xlsx(row("2026-01-31", "ZUPF01", "시험펀드", "KR7005930003", "삼성전자")))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from fnd11_book_extr where fnd11_company_id = 28000", Integer.class)).isEqualTo(before + 1);

        assertThatThrownBy(() -> bookExtr.upload(user, xlsx(row("2026-01-31", "ZUPF01", "시험펀드", "KR70059"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("[시험펀드] 펀드의 종목코드가 12자리가 아닙니다");
        assertThatThrownBy(() -> bookExtr.upload(user, xlsx(row("2026-01-31", "ZUPF01"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("펀드명은 필수입력");
    }
}
