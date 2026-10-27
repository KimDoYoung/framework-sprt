package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.CurrentFeeByFundRes;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** R06 펀드별 발생보수현황: icam10_fee 및 sys99_print 매핑 검증 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class IcamCurrentFeeByFundDbTest {

    @Autowired
    private IcamCurrentFeeByFundMapper mapper;

    @Test
    void 회사_28000의_발생보수현황_조회가_정상_매핑된다() {
        List<CurrentFeeByFundRes> rows = mapper.selectCurrentFeeByFund(28000L, "2026", "2025");
        assertThat(rows).isNotEmpty();
        CurrentFeeByFundRes first = rows.get(0);
        assertThat(first.feeId()).isNotNull();
        assertThat(first.fundName()).isNotBlank();
        assertThat(first.totalAfterfee()).isNotNull();
    }

    @Test
    void 데이터가_없는_연도는_빈_목록이다() {
        List<CurrentFeeByFundRes> rows = mapper.selectCurrentFeeByFund(28000L, "1990", "1989");
        assertThat(rows).isEmpty();
    }

    @Test
    void RD_인쇄_데이터_정리_및_삽입이_정상_동작한다() {
        long groupId = mapper.selectNextId();
        assertThat(groupId).isPositive();

        int deleted = mapper.deletePrint(28000L, 1L, "%Icam10%");
        assertThat(deleted).isGreaterThanOrEqualTo(0);

        int inserted = mapper.insertPrintCurrentFeeByFund(28000L, 1L, "%Icam10%", groupId, "2026", "2025");
        assertThat(inserted).isPositive();
    }
}
