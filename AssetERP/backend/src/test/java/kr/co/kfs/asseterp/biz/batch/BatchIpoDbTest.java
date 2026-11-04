package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.Ipo38ScrapAction;
import kr.co.kfs.asseterp.biz.batch.action.IpoMismatchAction;
import kr.co.kfs.asseterp.biz.batch.action.IpoScrapAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.ipo.BatchIpoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SB05~SB07(ipoScrap·ipo38Scrap·ipoMismatch)을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({BatchIpoService.class, IpoScrapAction.class, Ipo38ScrapAction.class, IpoMismatchAction.class})
class BatchIpoDbTest {

    @Autowired IpoScrapAction ipoScrap;
    @Autowired Ipo38ScrapAction ipo38Scrap;
    @Autowired IpoMismatchAction ipoMismatch;
    @Autowired JdbcTemplate jdbc;

    private static BatchReq data(String data) {
        return new BatchReq(null, null, null, null, null, null, null, null, data);
    }

    /** IPO Stock 18열 한 줄 */
    private static String ipoStockRow(String name, String code) {
        return String.join("|", name, "진행", "코스닥", code, "대표", "02-000-0000", "1,000,000", "500", "8,000~10,000", "100:1",
                "10,000", "100억", "한국투자증권", "2026.12.01~2026.12.02", "2026.12.05~2026.12.06", "2026.12.09", "2026.12.09", "2026.12.15");
    }

    /** 공모주38 33열 한 줄 (끝 열이 비면 split이 잘라 버리므로 마지막 열은 값을 둔다) */
    private static String ipo38Row(String name, String code, String finalPrice, String listDate) {
        String[] c = new String[33];
        java.util.Arrays.fill(c, "x");
        c[0] = name; c[1] = "진행"; c[2] = "코스닥"; c[3] = code;
        c[18] = "8,000~10,000"; c[20] = finalPrice; c[22] = "한국투자증권.미래에셋증권";
        c[23] = "2026.12.01~2026.12.02"; c[24] = "2026.12.05~2026.12.06";
        c[25] = "2026.12.08"; c[26] = "2026.12.09"; c[27] = "2026.12.09"; c[28] = listDate;
        c[32] = "100:1";
        return String.join("|", c);
    }

    @Test
    void ipoScrap은_행마다_sch13에_넣고_미일치를_만든다() {
        int before = jdbc.queryForObject("select count(*) from sch13_ipo_crawling where sch13_target_type = '2'", Integer.class);

        String msg = ipoScrap.run(data(ipoStockRow("ZZ시험1", "999991") + "\n" + ipoStockRow("ZZ시험2", "999992")));

        assertThat(msg).isEqualTo("IPO Stock 공모주일정 스크래핑 작업 완료.. commit");
        assertThat(jdbc.queryForObject("select count(*) from sch13_ipo_crawling where sch13_target_type = '2'", Integer.class))
                .isEqualTo(before + 2);
        Map<String, Object> row = jdbc.queryForMap("select * from sch13_ipo_crawling where sch13_stk_code = '999992' and sch13_target_type = '2'");
        assertThat(row.get("sch13_stk_name")).isEqualTo("ZZ시험2");
        assertThat(row.get("sch13_ceo")).isEqualTo("대표");
        assertThat(row.get("sch13_phone")).isEqualTo("02-000-0000");
        assertThat(row.get("sch13_lead_manager")).isEqualTo("한국투자증권");
        assertThat(row.get("sch13_list_date")).isEqualTo("2026.12.15");
        assertThat(row.get("sch13_industry")).isNull();
    }

    @Test
    void ipoScrap은_data가_없으면_거절한다() {
        assertThatThrownBy(() -> ipoScrap.run(data(null))).isInstanceOf(BusinessException.class).hasMessage("data가 없습니다.");
    }

    @Test
    void ipoScrap은_열이_모자란_행이_있으면_AS_IS처럼_실패한다() {
        assertThatThrownBy(() -> ipoScrap.run(data("종목|진행|코스닥"))).isInstanceOf(ArrayIndexOutOfBoundsException.class);
    }

    @Test
    void ipo38Scrap은_공모주_일정을_신규등록하고_다시_보내면_갱신한다() throws Exception {
        String msg = ipo38Scrap.run(data(ipo38Row("ZZ시험신규", "999990", "10,000원", "")));

        assertThat(msg).isEqualTo("공모주38 공모주일정 스크래핑 작업 완료.. commit");
        List<Map<String, Object>> rows = jdbc.queryForList("select * from sch10_ipo where sch10_iss_corp_cd = '99999'");
        assertThat(rows).hasSize(1);
        Map<String, Object> ipo = rows.get(0);
        assertThat(ipo.get("sch10_item_nm")).isEqualTo("ZZ시험신규");
        assertThat(ipo.get("sch10_market_cd")).isEqualTo("2");
        assertThat(ipo.get("sch10_company_id").toString()).isEqualTo("0");
        assertThat(ipo.get("sch10_demand_start_date").toString()).isEqualTo("2026-12-01");
        assertThat(ipo.get("sch10_demand_close_date").toString()).isEqualTo("2026-12-02");
        assertThat(ipo.get("sch10_subscription_start_date").toString()).isEqualTo("2026-12-05");
        assertThat(ipo.get("sch10_subscription_close_date").toString()).isEqualTo("2026-12-06");
        assertThat(ipo.get("sch10_div_date").toString()).isEqualTo("2026-12-08");
        assertThat(ipo.get("sch10_pay_date").toString()).isEqualTo("2026-12-09");
        assertThat(ipo.get("sch10_refund_date").toString()).isEqualTo("2026-12-09");
        assertThat(ipo.get("sch10_list_date")).isNull();
        assertThat(ipo.get("sch10_note")).isEqualTo("한국투자증권,미래에셋증권");
        assertThat(ipo.get("sch10_price").toString()).isEqualTo("10000");
        assertThat(ipo.get("sch10_cancel_yn")).isEqualTo("false");
        assertThat(jdbc.queryForObject("select count(*) from sch12_ipo_corp where sch12_corp_nm = '미래에셋증권'", Integer.class)).isGreaterThan(0);

        Thread.sleep(1100);   // 크롤링 trackId가 초 단위라 다음 호출과 겹치지 않게
        ipo38Scrap.run(data(ipo38Row("ZZ시험신규", "999990", "12,500원", "2026.12.20")));

        List<Map<String, Object>> after = jdbc.queryForList("select * from sch10_ipo where sch10_iss_corp_cd = '99999'");
        assertThat(after).hasSize(1);
        assertThat(after.get(0).get("sch10_price").toString()).isEqualTo("12500");
        assertThat(after.get(0).get("sch10_list_date").toString()).isEqualTo("2026-12-20");
    }

    @Test
    void ipo38Scrap은_이번_자료에_없는_최근_일정을_미사용으로_바꾼다() {
        long id = jdbc.queryForObject("select f_create_seq()", Long.class);
        jdbc.update("""
                insert into sch10_ipo select ?, 'ZZ사라진종목', current_date + 10, current_date + 11, null, null, null, null, null, null, null, 0, '1', 'false', null, null, '88888'""", id);

        ipo38Scrap.run(data(ipo38Row("ZZ시험신규", "999990", "10,000원", "")));

        assertThat(jdbc.queryForObject("select sch10_cancel_yn from sch10_ipo where sch10_ipo_id = ?", String.class, id)).isEqualTo("true");
    }

    @Test
    void ipo38Scrap은_날짜_칸이_비면_AS_IS처럼_실패한다() {
        String[] c = ipo38Row("ZZ시험신규", "999990", "10,000원", "").split("\\|");
        c[25] = "";   // 배정일이 비면 extrDate가 null → [0] 에서 NullPointerException
        assertThatThrownBy(() -> ipo38Scrap.run(data(String.join("|", c)))).isInstanceOf(NullPointerException.class);
    }

    @Test
    void ipoMismatch는_미일치내역_함수를_부른다() {
        assertThat(ipoMismatch.run(data(null))).isEqualTo("공모주일정 미일치내역 생성 완료.. commit");
    }
}
