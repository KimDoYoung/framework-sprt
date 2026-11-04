package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import kr.co.kfs.asseterp.biz.batch.action.IcamIpoAction;

/** SB23 icamIpo를 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamIpoAction.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamIpoActionDbTest {

    @Autowired IcamIpoAction action;
    @Autowired JdbcTemplate jdbc;

    private static BatchReq req(String stdDate) {
        return new BatchReq(null, "ZZ시험", null, stdDate, null, null, null, null, null);
    }

    @Test
    void 기준일_이후_청약분을_지우고_ICAM_공모주를_넣는다() {
        jdbc.update("insert into icam25_ipo (icam25_ipo_id, icam25_item_nm, icam25_iss_corp_cd, icam25_start_date, icam25_close_date) values (f_create_batchseq(), '옛공모', 'ZZ999', date '2026-11-05', date '2026-11-06')");
        jdbc.update("insert into icam25_ipo (icam25_ipo_id, icam25_item_nm, icam25_iss_corp_cd, icam25_start_date, icam25_close_date) values (f_create_batchseq(), '지난공모', 'ZZ998', date '2026-10-30', date '2026-10-31')");

        assertThat(action.run(req("2026-11-01"))).isEqualTo("ipo 작업완료..commit");

        assertThat(jdbc.queryForObject("select count(*) from icam25_ipo where icam25_item_nm = '옛공모'", Integer.class)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from icam25_ipo where icam25_item_nm = '지난공모'", Integer.class)).isEqualTo(1);
        var a = jdbc.queryForMap("select * from icam25_ipo where icam25_item_nm = '시뮬공모A'");
        assertThat(a.get("icam25_iss_corp_cd")).isEqualTo("ZZ001");
        assertThat(a.get("icam25_start_date").toString()).isEqualTo("2026-11-10");
        assertThat(a.get("icam25_close_date").toString()).isEqualTo("2026-11-11");
        assertThat(((Number) a.get("icam25_company_count")).intValue()).isEqualTo(7);
        assertThat(((Number) a.get("icam25_total_company_count")).intValue()).isEqualTo(20);
        assertThat(((Number) a.get("icam25_reg_rate")).doubleValue()).isEqualTo(35.0);
        assertThat(a.get("icam25_worker")).isEqualTo("ZZ시험");
    }

    @Test
    void 다시_돌려도_중복이_없다() {
        action.run(req("2026-11-01"));
        action.run(req("2026-11-01"));

        assertThat(jdbc.queryForObject("select count(*) from icam25_ipo where icam25_item_nm like '시뮬공모%'", Integer.class)).isEqualTo(2);
    }

    @Test
    void 기준일_형식이_틀리면_거절한다() {
        assertThatThrownBy(() -> action.run(req("2026/11/01"))).isInstanceOf(BusinessException.class);
    }
}
