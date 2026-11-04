package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamDataAction;
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

/** SB12 icamData를 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다(@MybatisTest 기본 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamDataAction.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamDataActionDbTest {

    @Autowired IcamDataAction action;
    @Autowired JdbcTemplate jdbc;

    private static BatchReq req(String companyId, String stdDate) {
        return new BatchReq(companyId, "ZZ시험", null, stdDate, null, null, null, null, null);
    }

    private int count() {
        return jdbc.queryForObject("select count(*) from icam02_data", Integer.class);
    }

    @Test
    void ALL이면_ICAM회사_모두의_자료를_icam02_data에_넣는다() {
        int before = count();

        String msg = action.run(req("ALL", "2026-11-03"));

        assertThat(msg).isEqualTo("DATA 작업완료...commit");
        assertThat(count() - before).isEqualTo(3);
        var row = jdbc.queryForMap("select * from icam02_data where icam02_creater = 'ZZ시험' and icam02_item_cd = 'KR7000660001'");
        assertThat(row.get("icam02_icam_company_cd")).isEqualTo("2018");
        assertThat(row.get("icam02_fund_nm")).isEqualTo("시뮬레이션 펀드 1호");
        assertThat(row.get("icam02_confirm_yn")).isEqualTo("false");
        assertThat(row.get("icam02_item_nm")).isEqualTo("SK하이닉스, 보통주");
    }

    @Test
    void 회사ID를_주면_그_회사만() {
        int before = count();
        action.run(req("28000", "2026-11-03"));   // ICAM 회사코드 2018
        assertThat(count() - before).isEqualTo(2);
    }

    @Test
    void 기준일에_자료가_없으면_아무것도_넣지_않고_완료() {
        int before = count();
        assertThat(action.run(req("ALL", "2000-01-01"))).isEqualTo("DATA 작업완료...commit");
        assertThat(count()).isEqualTo(before);
    }
}
