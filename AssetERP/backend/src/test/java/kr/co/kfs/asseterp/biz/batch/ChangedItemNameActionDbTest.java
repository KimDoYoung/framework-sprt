package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

import kr.co.kfs.asseterp.biz.batch.action.ChangedItemNameAction;
import java.time.LocalDate;

/** SB22 changedItemName을 asseterpdb에서 실제로 돌리고 롤백한다(ICAM 읽기 없음) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({ChangedItemNameAction.class})
class ChangedItemNameActionDbTest {

    @Autowired ChangedItemNameAction action;
    @Autowired JdbcTemplate jdbc;

    private static final String ISIN = "KRZZ99900001";

    private LocalDate bizDate() {
        return jdbc.queryForObject("select f_get_biz_date2(0, current_date, '-1', 'true')", LocalDate.class);
    }

    private void price(LocalDate d, String type, String isin, String name) {
        jdbc.update("insert into icam20_price (icam20_price_id, icam20_std_date, icam20_item_type, icam20_item_cd, icam20_item_nm, icam20_isin) values (f_create_batchseq(), ?, ?, ?, ?, ?)",
                d, type, "ZZ" + name, name, isin);
    }

    private String name(LocalDate d) {
        return jdbc.queryForObject("select icam20_item_nm from icam20_price where icam20_std_date = ? and icam20_isin = ?", String.class, d, ISIN);
    }

    @Test
    void 바뀐_종목명으로_다른_날_시세와_임직원매매_원장의_이름을_고친다() {
        LocalDate d = bizDate();
        LocalDate old = d.minusDays(5);
        price(d, "2010", ISIN, "새이름");
        price(old, "2010", ISIN, "옛이름");
        jdbc.update("insert into flt10_tr (flt10_tr_id, flt10_company_id, flt10_person_id, flt10_item_cd, flt10_item_nm, flt10_tr_item_cd, flt10_tr_item_nm) values (f_create_seq(), -9, -9, ?, '옛이름', ?, '옛이름')", ISIN, ISIN);
        jdbc.update("insert into flt11_book (flt11_book_id, flt11_company_id, flt11_person_id, flt11_item_cd, flt11_item_nm) values (f_create_seq(), -9, -9, ?, '옛이름')", ISIN);
        jdbc.update("insert into flt12_book_month (flt12_book_month_id, flt12_company_id, flt12_person_id, flt12_item_cd, flt12_item_nm) values (f_create_seq(), -9, -9, ?, '옛이름')", ISIN);
        jdbc.update("insert into flt13_book_init (flt13_book_init_id, flt13_item_cd, flt13_item_nm) values (f_create_seq(), ?, '옛이름')", ISIN);

        assertThat(action.run(new BatchReq(null, "ZZ시험", null, null, null, null, null, null, null))).isEqualTo("종목명 변경 작업완료..commit");

        assertThat(name(old)).isEqualTo("새이름");
        assertThat(name(d)).isEqualTo("새이름");
        assertThat(jdbc.queryForObject("select flt10_item_nm || '/' || flt10_tr_item_nm from flt10_tr where flt10_item_cd = ?", String.class, ISIN)).isEqualTo("새이름/새이름");
        assertThat(jdbc.queryForObject("select flt11_item_nm from flt11_book where flt11_item_cd = ?", String.class, ISIN)).isEqualTo("새이름");
        assertThat(jdbc.queryForObject("select flt12_item_nm from flt12_book_month where flt12_item_cd = ?", String.class, ISIN)).isEqualTo("새이름");
        assertThat(jdbc.queryForObject("select flt13_item_nm from flt13_book_init where flt13_item_cd = ?", String.class, ISIN)).isEqualTo("새이름");
    }

    @Test
    void 이름이_같으면_아무것도_바꾸지_않고_주식이_아닌_시세는_대상이_아니다() {
        LocalDate d = bizDate();
        price(d, "2010", ISIN, "같은이름");
        price(d.minusDays(5), "2010", ISIN, "같은이름");
        price(d, "2050", "KRZZ99900002", "펀드새");
        price(d.minusDays(5), "2050", "KRZZ99900002", "펀드옛");

        action.run(new BatchReq(null, null, null, null, null, null, null, null, null));

        assertThat(name(d.minusDays(5))).isEqualTo("같은이름");
        assertThat(jdbc.queryForObject("select icam20_item_nm from icam20_price where icam20_std_date = ? and icam20_isin = 'KRZZ99900002'", String.class, d.minusDays(5))).isEqualTo("펀드옛");
    }
}
