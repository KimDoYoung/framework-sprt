package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.ExtrFundHoldItemAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SB16 extrFundHoldItem을 asseterpdb에서 실제로 돌리고 롤백한다(ifi29·ifi34 시험 행은 시험 안에서 넣는다) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ExtrFundHoldItemAction.class)
class ExtrFundHoldItemActionDbTest {

    @Autowired ExtrFundHoldItemAction action;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void seed() {
        jdbc.update("insert into ifi29_am_corp_mapping (ifi29_am_corp_mapping_id, ifi29_if_cd, ifi29_am_corp_cd, ifi29_am_corp_nm, ifi29_company_id, ifi29_start_date) "
                + "values (f_create_seq(), 'SFTP_SHFP_01', 'ZZAM', '시험운용사', 28000, date '2000-01-01')");
        stk("20261103", "20261102", "A000001", "시험주식1");
        stk("20261103", "20261102", "A000002", "시험주식2");
        stk("20261104", "20261103", "A000001", "시험주식1");
    }

    private void stk(String sendDate, String stdDate, String code, String name) {
        jdbc.update("insert into ifi34_stk (ifi34_stk_id, ifi34_if_cd, ifi34_send_date, ifi34_am_corp_cd, ifi34_std_date, ifi34_item_cd, ifi34_item_nm) "
                + "values (f_create_seq(), 'SFTP_SHFP_01', ?, 'ZZAM', ?, ?, ?)", sendDate, stdDate, code, name);
    }

    private static BatchReq req(String sendDate) {
        return new BatchReq("28000", "ZZ시험", "SFTP_SHFP_01", null, null, null, sendDate, null, null);
    }

    private int items(String stdDate) {
        return jdbc.queryForObject("select count(*) from flt09_fund_item where flt09_company_id = 28000 and flt09_std_date = date '" + stdDate + "'", Integer.class);
    }

    @Test
    void 송신일_수신분을_flt09에_넣는다() {
        assertThat(action.run(req("2026-11-03"))).isEqualTo("extrFundHoldItem 작업완료..commit");

        assertThat(items("2026-11-02")).isEqualTo(2);
        assertThat(items("2026-11-03")).isZero();   // 다른 송신일 분은 건드리지 않는다
        var row = jdbc.queryForMap("select * from flt09_fund_item where flt09_company_id = 28000 and flt09_item_cd = 'A000002'");
        assertThat(row.get("flt09_item_nm")).isEqualTo("시험주식2");
        assertThat(row.get("flt09_item_type")).isEqualTo("2010");
    }

    @Test
    void 다시_돌리면_그_기준일을_지우고_다시_넣는다_중복없음() {
        // 같은 기준일에 이미 있던 자료(사용자가 올린 것 포함)는 먼저 지워진다
        jdbc.update("insert into flt09_fund_item values (f_create_seq(), 28000, date '2026-11-02', '2010', 'OLD', '옛종목')");

        action.run(req("2026-11-03"));
        action.run(req("2026-11-03"));

        assertThat(items("2026-11-02")).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from flt09_fund_item where flt09_item_cd = 'OLD'", Integer.class)).isZero();
    }

    @Test
    void sendDate_형식이_틀리면_거절한다() {
        assertThatThrownBy(() -> action.run(req("2026/11/03"))).isInstanceOf(BusinessException.class);
    }
}
