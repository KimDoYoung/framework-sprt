package kr.co.kfs.asseterp.biz.biz;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.biz.dto.BizLimitCheckParam;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizLimitCheckMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizLimitMapper;

/**
 * #1133 이익제공 한도초과현황 — 원본 2026-10-29·11-06 조회조건(편익 기준액 적용 · 임의점검 한도액) (CH-0004·0006·0008·0009·0012).
 * 기대 건수는 같은 asseterpdb에서 AS-IS SQL(biz01_promo.selectByPersonDay/PersonYear/CompanyYear)을 yunhee mapper-run으로 돌린 결과다
 * (2026-11-13 복원한 DB로 다시 구함 — TOBE와 8조합×3 SQL 모두 일치). DB를 바꾸면 이 표를 다시 구한다:
 * 참인 조건은 -p overCheck=true / limitCheck=true, 거짓은 TOBE에선 빼고(글자 'false'는 MyBatis에서 참) 원본에는 'false'로 준다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BizLimitCheckDbTest {

    @Autowired BizLimitCheckMapper mapper;
    @Autowired BizLimitMapper limitMapper;
    @Autowired JdbcTemplate jdbc;

    private static BizLimitCheckParam p(String year, boolean over, boolean limit, long l1, long l2, long l3) {
        return new BizLimitCheckParam(28000L, year, "%", over, limit, l1, l2, l3);
    }

    @ParameterizedTest(name = "{0} over={1} limit={2} → day {6} · person {7} · company {8}")
    @CsvSource({
            "2022, true,  false, 100000, 300000, 500000, 12, 2, 0",
            "2022, true,  true,  100000, 300000, 500000, 12, 1, 1",
            "2022, false, false, 100000, 300000, 500000, 0,  2, 0",
            "2022, false, true,  100000, 300000, 500000, 4,  1, 1",
            "2024, true,  false, 100000, 500000, 1000000, 146, 1, 1",
            "2024, true,  true,  100000, 500000, 1000000, 146, 2, 1",
            "2024, false, false, 100000, 500000, 1000000, 17,  1, 1",
            "2024, false, true,  100000, 500000, 1000000, 70,  2, 1",
    })
    void 조회조건별_건수가_원본과_같다(String year, boolean over, boolean limit, long l1, long l2, long l3, int day, int person, int company) {
        BizLimitCheckParam param = p(year, over, limit, l1, l2, l3);
        assertThat(mapper.selectByPersonDay(param)).hasSize(day);
        assertThat(mapper.selectByPersonYear(param)).hasSize(person);
        assertThat(mapper.selectByCompanyYear(param)).hasSize(company);
    }

    @Test
    void 한도액_비우면_0으로_본다() {
        // 원본 f_nvl(#{limit1},0) — 임의점검인데 금액이 비면 0원 초과 = 금액이 있는 건 모두
        BizLimitCheckParam empty = new BizLimitCheckParam(28000L, "2024", "%", false, true, null, null, null);
        BizLimitCheckParam zero = new BizLimitCheckParam(28000L, "2024", "%", false, true, 0L, 0L, 0L);
        List<?> rows = mapper.selectByPersonDay(empty);
        assertThat(rows).isNotEmpty().hasSameSizeAs(mapper.selectByPersonDay(zero));
        assertThat(mapper.selectByPersonYear(empty)).hasSameSizeAs(mapper.selectByPersonYear(zero));
        assertThat(mapper.selectByCompanyYear(empty)).hasSameSizeAs(mapper.selectByCompanyYear(zero));
    }

    @Test
    void 한도액_기본값은_기준년도_말일까지의_최근_이익제공_한도() {
        // 기대값은 biz90_limit에서 직접 읽는다: 그 해 12-31 이전에 시작한 이익제공(1) 한도 중 가장 늦은 것
        Map<String, Object> expected = jdbc.queryForMap("""
                select biz90_company_limit1 as l1, biz90_company_limit2 as l2, biz90_company_limit3 as l3 from biz90_limit
                 where biz90_company_id = 28000 and biz90_provide_rcv_type = '1' and biz90_start_date <= '2022-12-31'
                 order by biz90_start_date desc limit 1""");
        BizLimitRes y2022 = limitMapper.selectProvideLimit(28000L, "2022");
        assertThat(y2022.companyLimit1()).isEqualTo(((Number) expected.get("l1")).longValue());
        assertThat(y2022.companyLimit2()).isEqualTo(((Number) expected.get("l2")).longValue());
        assertThat(y2022.companyLimit3()).isEqualTo(((Number) expected.get("l3")).longValue());
        String before = jdbc.queryForObject("select to_char(min(biz90_start_date) - interval '1 year', 'YYYY') from biz90_limit where biz90_company_id = 28000 and biz90_provide_rcv_type = '1'", String.class);
        assertThat(limitMapper.selectProvideLimit(28000L, before)).isNull();
    }
}
