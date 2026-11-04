package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import kr.co.kfs.asseterp.biz.batch.action.IcamTodayListItemAction;

/** SB21 icamTodayListItem을 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamTodayListItemAction.class, ComStkItemSync.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamTodayListItemActionDbTest {

    @Autowired IcamTodayListItemAction action;
    @Autowired JdbcTemplate jdbc;

    private static BatchReq req() {
        return new BatchReq(null, "ZZ시험", null, null, null, null, null, null, null);
    }

    @Test
    void 오늘_상장_종목으로_공통_종목정보를_만든다() {
        assertThat(action.run(req())).isEqualTo("작업완료..commit");

        var c = jdbc.queryForMap("select * from com50_item where com50_item_cd = 'KRZZ00000037'");
        assertThat(c.get("com50_item_nm")).isEqualTo("시뮬 신규상장");
        assertThat(c.get("com50_item_type")).isEqualTo("2010");
        assertThat(c.get("com50_item_short_cd")).isEqualTo("ZZ0003");
    }

    @Test
    void 이미_있는_종목은_이름이_다를_때만_이름을_고치고_중복을_만들지_않는다() {
        jdbc.update("insert into com50_item (com50_item_id, com50_item_cd, com50_item_nm, com50_item_type, com50_item_short_cd) values (f_create_seq(), 'KRZZ00000011', '옛이름', '2010', 'ZZ0001')");

        action.run(req());
        action.run(req());

        assertThat(jdbc.queryForObject("select com50_item_nm from com50_item where com50_item_cd = 'KRZZ00000011'", String.class)).isEqualTo("시뮬 삼성전자 개명");
        assertThat(jdbc.queryForObject("select count(*) from com50_item where com50_item_cd in ('KRZZ00000011','KRZZ00000037')", Integer.class)).isEqualTo(2);
    }
}
