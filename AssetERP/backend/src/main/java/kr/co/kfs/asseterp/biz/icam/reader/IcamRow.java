package kr.co.kfs.asseterp.biz.icam.reader;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

/** ICAM 읽기 결과 한 행. 열 이름은 AS-IS 매퍼 SELECT의 별칭(예: icam02_fund_cd)을 그대로 쓴다. 빈 값은 null. */
public record IcamRow(Map<String, String> values) {

    public String getString(String column) {
        String v = values.get(column);
        return (v == null || v.isEmpty()) ? null : v;
    }

    public LocalDate getDate(String column) {
        String v = getString(column);
        return v == null ? null : LocalDate.parse(v.length() > 10 ? v.substring(0, 10) : v);
    }

    public Long getLong(String column) {
        String v = getString(column);
        return v == null ? null : new BigDecimal(v).longValue();
    }

    public BigDecimal getDecimal(String column) {
        String v = getString(column);
        return v == null ? null : new BigDecimal(v);
    }
}
