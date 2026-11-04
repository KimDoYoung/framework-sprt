package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.InfoDataAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

/** SB26 infoData를 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({InfoDataAction.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class InfoDataActionDbTest {

    @Autowired InfoDataAction action;
    @Autowired JdbcTemplate jdbc;

    private static BatchReq req() {
        return new BatchReq(null, null, null, null, null, null, null, null, null);
    }

    @Test
    void 새_정보코드는_넣고_있는_것은_이름만_고치며_분류와_비고는_유지한다() {
        jdbc.update("insert into icam01_data_info (icam01_data_info_id, icam01_info_cd, icam01_info_nm, icam01_tr_cd, icam01_tr_nm, icam01_ics_class_tree_id, icam01_note) values (f_create_seq(), 'ZZ01', '옛정보', 'T001', '옛거래', -77, '기존비고')");

        assertThat(action.run(req())).isEqualTo("ICAM연계작업 정보코드 작업완료.. commit");

        var old = jdbc.queryForMap("select * from icam01_data_info where icam01_info_cd = 'ZZ01' and icam01_tr_cd = 'T001'");
        assertThat(old.get("icam01_info_nm")).isEqualTo("시뮬정보1");
        assertThat(old.get("icam01_tr_nm")).isEqualTo("시뮬거래1");
        assertThat(((Number) old.get("icam01_ics_class_tree_id")).longValue()).isEqualTo(-77L);
        assertThat(old.get("icam01_note")).isEqualTo("기존비고");
        var created = jdbc.queryForMap("select * from icam01_data_info where icam01_info_cd = 'ZZ02' and icam01_tr_cd = 'T002'");
        assertThat(created.get("icam01_info_nm")).isEqualTo("시뮬정보2");
        assertThat(created.get("icam01_ics_class_tree_id")).isNull();
    }

    @Test
    void 다시_돌려도_중복이_없다() {
        action.run(req());
        action.run(req());

        assertThat(jdbc.queryForObject("select count(*) from icam01_data_info where icam01_info_cd in ('ZZ01','ZZ02')", Integer.class)).isEqualTo(2);
    }
}
