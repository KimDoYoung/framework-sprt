package kr.co.kfs.asseterp.biz.biz;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import kr.co.kfs.asseterp.biz.biz.dto.BizLimitCheckParam;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizLimitCheckMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizLimitMapper;

/**
 * #1133 이익제공 한도초과현황 — 원본 2026-10-29·11-06 조회조건(편익 기준액 적용 · 임의점검 한도액) (CH-0004·0006·0008·0009·0012).
 * 기대 건수는 같은 asseterpdb에서 AS-IS SQL(biz01_promo.selectByPersonDay/PersonYear/CompanyYear)을 yunhee mapper-run으로 돌린 결과(2026-11-11).
 * 회사 28000: 2022년은 이익제공 기준액(3만·20만)·회사 한도(20만·100만·500만)가 있고, 2023년부터는 모두 0
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BizLimitCheckDbTest {

    @Autowired BizLimitCheckMapper mapper;
    @Autowired BizLimitMapper limitMapper;

    private static BizLimitCheckParam p(String year, boolean over, boolean limit, long l1, long l2, long l3) {
        return new BizLimitCheckParam(28000L, year, "%", over, limit, l1, l2, l3);
    }

    @ParameterizedTest(name = "{0} over={1} limit={2} → day {6} · person {7} · company {8}")
    @CsvSource({
            "2022, true,  false, 100000, 300000, 500000, 12, 1, 0",
            "2022, true,  true,  100000, 300000, 500000, 12, 1, 1",
            "2022, false, false, 100000, 300000, 500000, 0,  1, 0",
            "2022, false, true,  100000, 300000, 500000, 4,  1, 1",
            "2024, true,  false, 100000, 500000, 1000000, 488, 7, 7",
            "2024, true,  true,  100000, 500000, 1000000, 488, 2, 1",
            "2024, false, false, 100000, 500000, 1000000, 488, 7, 7",
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
        BizLimitCheckParam param = new BizLimitCheckParam(28000L, "2024", "%", false, true, null, null, null);
        List<?> rows = mapper.selectByPersonDay(param);
        assertThat(rows).hasSize(488);
    }

    @Test
    void 한도액_기본값은_기준년도_말일까지의_최근_이익제공_한도() {
        BizLimitRes y2022 = limitMapper.selectProvideLimit(28000L, "2022");
        assertThat(y2022.companyLimit1()).isEqualTo(200000L);
        assertThat(y2022.companyLimit2()).isEqualTo(1000000L);
        assertThat(y2022.companyLimit3()).isEqualTo(5000000L);
        assertThat(limitMapper.selectProvideLimit(28000L, "2021")).isNull();
    }
}
