package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.biz.icam.reader.IcamServer;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/** SB12 시뮬레이터 CSV 읽기 — data/icam-simulator 의 실제 샘플 파일로 확인한다 */
class CsvIcamReaderTest {

    private final CsvIcamReader reader = new CsvIcamReader("../data/icam-simulator");
    private static final String Q = "icam02_data.selectIcamData";

    @Test
    void 조건_열로_회사와_기준일이_걸러진다() {
        List<IcamRow> rows = reader.read(IcamServer.ICAM, Q, Map.of("icamCompanyCode", "2018", "stdDate", "2026-11-03"));
        assertThat(rows).hasSize(2);
        assertThat(rows.get(0).getString("icam02_fund_cd")).isEqualTo("SIM001");
        assertThat(rows.get(0).getDate("icam02_tgt_date")).isEqualTo(LocalDate.of(2026, 11, 10));
        assertThat(rows.get(0).getDecimal("icam02_tgt_amt")).isEqualByComparingTo("1500000");
        assertThat(rows.get(0).getLong("icam03_seq")).isEqualTo(1L);
        assertThat(rows.get(0).values()).doesNotContainKey("@stdDate");
    }

    @Test
    void 쉼표와_큰따옴표가_있는_값을_읽고_빈칸은_null() {
        List<IcamRow> rows = reader.read(IcamServer.ICAM, Q, Map.of("icamCompanyCode", "2018", "stdDate", "2026-11-03"));
        assertThat(rows.get(1).getString("icam02_item_nm")).isEqualTo("SK하이닉스, 보통주");
        assertThat(rows.get(1).getString("icam02_note")).isEqualTo("큰따옴표 \"시험\" 줄");
        List<IcamRow> blank = reader.read(IcamServer.ICAM, Q, Map.of("icamCompanyCode", "1808", "stdDate", "2026-11-03"));
        assertThat(blank.get(0).getString("icam02_item_cd")).isNull();
        assertThat(blank.get(0).getDate("icam02_tgt_date")).isNull();
    }

    @Test
    void 퍼센트는_LIKE_처럼_전체_회사와_맞는다() {
        assertThat(reader.read(IcamServer.ICAM, Q, Map.of("icamCompanyCode", "%", "stdDate", "2026-11-03"))).hasSize(3);
    }

    @Test
    void 날짜가_다르거나_파일이_없으면_0행() {
        assertThat(reader.read(IcamServer.ICAM, Q, Map.of("icamCompanyCode", "%", "stdDate", "2000-01-01"))).isEmpty();
        assertThat(reader.read(IcamServer.ICAM2, Q, Map.of("icamCompanyCode", "%", "stdDate", "2026-11-03"))).isEmpty();
        assertThat(reader.read(IcamServer.ICAM, "no.such", Map.of())).isEmpty();
    }
}
