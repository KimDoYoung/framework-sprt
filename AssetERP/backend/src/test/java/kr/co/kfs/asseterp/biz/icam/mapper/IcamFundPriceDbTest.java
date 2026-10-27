package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.FundPriceRes;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** R05 펀드별 기준가 현황: icam06_fund_book 및 sys99_print 매핑 검증 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class IcamFundPriceDbTest {

    @Autowired
    private IcamFundPriceMapper mapper;

    @Test
    void 회사_28000의_기준가현황_조회가_정상_매핑된다() {
        List<FundPriceRes> rows = mapper.selectFundPrice(28000L, LocalDate.of(2026, 6, 18));
        assertThat(rows).isNotEmpty();
        FundPriceRes first = rows.get(0);
        assertThat(first.fundBookId()).isNotNull();
        assertThat(first.fundCode()).isNotBlank();
        assertThat(first.fundName()).isNotBlank();
        assertThat(first.cur()).isNotBlank();
    }

    @Test
    void 데이터가_없는_날짜는_빈_목록이다() {
        List<FundPriceRes> rows = mapper.selectFundPrice(28000L, LocalDate.of(1990, 1, 1));
        assertThat(rows).isEmpty();
    }

    @Test
    void RD_인쇄_데이터_정리_및_삽입이_정상_동작한다() {
        long groupId = mapper.selectNextId();
        assertThat(groupId).isPositive();

        int deleted = mapper.deletePrint(28000L, 1L, "Icam01");
        assertThat(deleted).isGreaterThanOrEqualTo(0);

        int inserted = mapper.insertPrintFundPrice(28000L, 1L, "Icam01", groupId, LocalDate.of(2026, 6, 18));
        assertThat(inserted).isPositive();
    }
}
