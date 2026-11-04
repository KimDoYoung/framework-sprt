package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawling;
import kr.co.kfs.asseterp.biz.batch.ipo.IpoScheduleParser;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class IpoScheduleParserTest {

    @Test
    void 시장구분_이름을_코드로_바꾸고_모르는_이름은_빈_문자열() {
        assertThat(IpoScheduleParser.convMarketType("거래소")).isEqualTo("1");
        assertThat(IpoScheduleParser.convMarketType("코스닥")).isEqualTo("2");
        assertThat(IpoScheduleParser.convMarketType("코넥스")).isEqualTo("3");
        assertThat(IpoScheduleParser.convMarketType("유가증권")).isEqualTo("4");
        assertThat(IpoScheduleParser.convMarketType("기타")).isEmpty();
        assertThat(IpoScheduleParser.convMarketType(null)).isEmpty();
    }

    @Test
    void extrDate는_앞에서부터_날짜_둘을_뽑는다() throws Exception {
        LocalDate[] range = IpoScheduleParser.extrDate("2026.12.01(월)~2026.12.02(화)");
        assertThat(range).containsExactly(LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 2));

        LocalDate[] one = IpoScheduleParser.extrDate("배정 2026.12.08");
        assertThat(one).containsExactly(LocalDate.of(2026, 12, 8), null);

        assertThat(IpoScheduleParser.extrDate("미정")).containsExactly(null, null);
    }

    @Test
    void extrDate는_비어_있으면_null이고_셋_이상이면_AS_IS처럼_실패한다() throws Exception {
        assertThat(IpoScheduleParser.extrDate(null)).isNull();
        assertThat(IpoScheduleParser.extrDate("")).isNull();
        assertThatThrownBy(() -> IpoScheduleParser.extrDate("2026.01.01 2026.01.02 2026.01.03"))
                .isInstanceOf(ArrayIndexOutOfBoundsException.class);
    }

    @Test
    void extrDate는_AS_IS의_SimpleDateFormat처럼_느슨하게_해석한다() throws Exception {
        assertThat(IpoScheduleParser.extrDate("2026.02.30")[0]).isEqualTo(LocalDate.of(2026, 3, 2));
    }

    @Test
    void extrLong은_숫자만_남긴다() {
        assertThat(IpoScheduleParser.extrLong("10,000원")).isEqualTo(10000L);
        assertThat(IpoScheduleParser.extrLong("미정")).isNull();
        assertThat(IpoScheduleParser.extrLong("")).isNull();
        assertThat(IpoScheduleParser.extrLong(null)).isNull();
    }

    @Test
    void IPO_Stock_18열을_열_위치대로_옮긴다() {
        String[] c = new String[18];
        for (int i = 0; i < 18; i++) {
            c[i] = " v" + i + " ";
        }

        BatchIpoCrawling r = BatchIpoCrawling.ofIpoStock("T1", c);

        assertThat(r.targetType()).isEqualTo("2");
        assertThat(r.trackId()).isEqualTo("T1");
        assertThat(r).extracting(BatchIpoCrawling::stkName, BatchIpoCrawling::status, BatchIpoCrawling::marketType, BatchIpoCrawling::stkCode,
                        BatchIpoCrawling::ceo, BatchIpoCrawling::phone, BatchIpoCrawling::totalIpoQty, BatchIpoCrawling::par,
                        BatchIpoCrawling::priceBracket, BatchIpoCrawling::subscriptionRate, BatchIpoCrawling::finalPrice,
                        BatchIpoCrawling::ipoOfferAmt, BatchIpoCrawling::leadManager, BatchIpoCrawling::demandDate,
                        BatchIpoCrawling::subscriptionDate, BatchIpoCrawling::payDate, BatchIpoCrawling::refundDate,
                        BatchIpoCrawling::listDate)
                .containsExactly("v0", "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11", "v12", "v13", "v14", "v15", "v16", "v17");
        assertThat(r.industry()).isNull();
        assertThat(r.divDate()).isNull();
    }

    @Test
    void 공모주38_33열을_열_위치대로_옮긴다() {
        String[] c = new String[33];
        for (int i = 0; i < 33; i++) {
            c[i] = "v" + i;
        }

        BatchIpoCrawling r = BatchIpoCrawling.ofIpo38("T2", c);

        assertThat(r.targetType()).isEqualTo("1");
        assertThat(r).extracting(BatchIpoCrawling::stkName, BatchIpoCrawling::stkCode, BatchIpoCrawling::industry, BatchIpoCrawling::ceo,
                        BatchIpoCrawling::bizType, BatchIpoCrawling::addr, BatchIpoCrawling::website, BatchIpoCrawling::phone,
                        BatchIpoCrawling::majorShareholder, BatchIpoCrawling::revenue, BatchIpoCrawling::bizProfit,
                        BatchIpoCrawling::netProfit, BatchIpoCrawling::capital, BatchIpoCrawling::totalIpoQty, BatchIpoCrawling::par,
                        BatchIpoCrawling::listIpoQty, BatchIpoCrawling::priceBracket, BatchIpoCrawling::subscriptionRate,
                        BatchIpoCrawling::finalPrice, BatchIpoCrawling::ipoOfferAmt, BatchIpoCrawling::leadManager,
                        BatchIpoCrawling::demandDate, BatchIpoCrawling::subscriptionDate, BatchIpoCrawling::divDate,
                        BatchIpoCrawling::payDate, BatchIpoCrawling::refundDate, BatchIpoCrawling::listDate,
                        BatchIpoCrawling::irDate, BatchIpoCrawling::irLocationTime, BatchIpoCrawling::corpRate, BatchIpoCrawling::lockUpRate)
                .containsExactly("v0", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11", "v12", "v13", "v14", "v15", "v16",
                        "v17", "v18", "v19", "v20", "v21", "v22", "v23", "v24", "v25", "v26", "v27", "v28", "v29", "v30", "v31", "v32");
        assertThat(r.demandCorpCnt()).isNull();
    }

    @Test
    void 열이_모자라면_AS_IS처럼_ArrayIndexOutOfBounds() {
        assertThatThrownBy(() -> BatchIpoCrawling.ofIpoStock("T", new String[17])).isInstanceOf(RuntimeException.class);
        assertThatThrownBy(() -> BatchIpoCrawling.ofIpo38("T", new String[]{"a", "b"})).isInstanceOf(ArrayIndexOutOfBoundsException.class);
    }
}
