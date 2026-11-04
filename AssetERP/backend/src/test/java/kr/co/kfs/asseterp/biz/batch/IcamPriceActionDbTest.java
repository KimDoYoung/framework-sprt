package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamPriceAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.batch.service.ComStkItemSync;
import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SB20 icamPrice를 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamPriceAction.class, ComStkItemSync.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamPriceActionDbTest {

    @Autowired IcamPriceAction action;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean BatchNoticeLogService noticeLog;

    private static BatchReq req(String stdDate) {
        return new BatchReq("ALL", "ZZ시험", null, stdDate, null, null, null, null, null);
    }

    private int prices() {
        return jdbc.queryForObject("select count(*) from icam20_price where icam20_std_date = date '2026-11-03'", Integer.class);
    }

    @Test
    void 주식시세와_사모펀드_기준가를_넣고_공통_종목정보를_만든다() {
        assertThat(action.run(req("2026-11-03"))).isEqualTo("시세 작업완료..commit");

        assertThat(prices()).isEqualTo(3);
        var s = jdbc.queryForMap("select * from icam20_price where icam20_isin = 'KRZZ00000029'");
        assertThat(s.get("icam20_item_type")).isEqualTo("2010");
        assertThat(s.get("icam20_item_nm")).isEqualTo("시뮬 SK하이닉스, 보통주");
        assertThat(((Number) s.get("icam20_close_price")).longValue()).isEqualTo(120000L);
        assertThat(s.get("icam20_worker")).isEqualTo("ZZ시험");
        var f = jdbc.queryForMap("select * from icam20_price where icam20_item_cd = 'ZZFND1'");
        assertThat(f.get("icam20_item_type")).isEqualTo("2050");
        assertThat(f.get("icam20_ksd_item_cd")).isEqualTo("ZZFND1");
        assertThat(((Number) f.get("icam20_close_price")).doubleValue()).isEqualTo(1023.45678);

        // 공통 종목정보는 주식만, 표준코드로
        var c = jdbc.queryForMap("select * from com50_item where com50_item_cd = 'KRZZ00000011'");
        assertThat(c.get("com50_item_nm")).isEqualTo("시뮬 삼성전자");
        assertThat(c.get("com50_item_type")).isEqualTo("2010");
        assertThat(c.get("com50_item_short_cd")).isEqualTo("ZZ0001");
        assertThat(jdbc.queryForObject("select count(*) from com50_item where com50_item_cd = 'ZZFND1'", Integer.class)).isZero();
    }

    @Test
    void 다시_돌리면_그날_시세를_모두_지우고_다시_넣어_중복이_없다() {
        jdbc.update("insert into icam20_price (icam20_price_id, icam20_std_date, icam20_item_type, icam20_item_cd) values (f_create_batchseq(), date '2026-11-03', '2010', 'OLDPRICE')");

        action.run(req("2026-11-03"));
        action.run(req("2026-11-03"));

        assertThat(prices()).isEqualTo(3);
        assertThat(jdbc.queryForObject("select count(*) from icam20_price where icam20_item_cd = 'OLDPRICE'", Integer.class)).isZero();
    }

    @Test
    void 종목명이_바뀌면_공통_종목정보의_이름만_고친다() {
        jdbc.update("insert into com50_item (com50_item_id, com50_item_cd, com50_item_nm, com50_item_type, com50_item_short_cd) values (f_create_seq(), 'KRZZ00000011', '옛이름', '2010', 'ZZ0001')");

        action.run(req("2026-11-03"));

        assertThat(jdbc.queryForObject("select com50_item_nm from com50_item where com50_item_cd = 'KRZZ00000011'", String.class)).isEqualTo("시뮬 삼성전자");
        assertThat(jdbc.queryForObject("select count(*) from com50_item where com50_item_cd = 'KRZZ00000011'", Integer.class)).isEqualTo(1);
    }

    @Test
    void 기준일_형식이_틀리면_거절한다() {
        assertThatThrownBy(() -> action.run(req("2026/11/03"))).isInstanceOf(BusinessException.class);
    }
}
