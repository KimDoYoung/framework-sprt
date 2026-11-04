package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamFundAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchIcamMapper;
import kr.co.kfs.asseterp.biz.batch.service.AssetErpFundSync;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/** SB13 icamFund를 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다(@MybatisTest 기본 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamFundAction.class, CsvIcamReader.class, AssetErpFundSync.class, BatchNoticeLogService.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamFundActionDbTest {

    @Autowired IcamFundAction action;
    @Autowired BatchIcamMapper icamMapper;
    @Autowired BatchCommonMapper commonMapper;
    @Autowired JdbcTemplate jdbc;

    private static BatchReq req(String companyId) {
        return new BatchReq(companyId, "ZZ시험", null, null, null, null, null, null, null);
    }

    /** 액션이 도는 날 수: 직전 영업일 ~ 어제 중 달력에 있는 날 */
    private int dayCount() {
        LocalDate start = commonMapper.selectBizDate(0L, LocalDate.now(), "-1");
        return icamMapper.selectCalendarDays(start, LocalDate.now().minusDays(1)).size();
    }

    private int count(String sql) {
        return jdbc.queryForObject(sql, Integer.class);
    }

    @Test
    void ALL이면_ICAM회사_모두의_펀드를_icam03과_fnd01_fnd02에_넣는다() {
        int days = dayCount();
        assertThat(days).isGreaterThan(0);
        int icam03Before = count("select count(*) from icam03_fund");

        String msg = action.run(req("ALL"));

        assertThat(msg).isEqualTo("FUND 작업완료..commit");
        assertThat(count("select count(*) from icam03_fund") - icam03Before).isEqualTo(3 * days);
        assertThat(count("select count(*) from icam03_fund where icam03_worker = 'ZZ시험' and icam03_fund_cd = 'SIM001'")).isEqualTo(days);

        Map<String, Object> icam = jdbc.queryForMap("select * from icam03_fund where icam03_worker = 'ZZ시험' and icam03_fund_cd = 'SIM101' limit 1");
        assertThat(icam.get("icam03_fund_full_nm")).isEqualTo("시뮬레이션 사모투자신탁 제3호, 시험용");
        assertThat(icam.get("icam03_nav")).isNotNull();

        // fnd01: 새 펀드가 ICAM 관리펀드로 들어간다. SIM002는 해지일이 있어 해지구분 true
        Map<String, Object> fnd01 = jdbc.queryForMap("select * from fnd01_fund_code where fnd01_fund_cd = 'SIM001' and fnd01_company_id = 28000");
        assertThat(fnd01.get("fnd01_icam_yn")).isEqualTo("true");
        assertThat(fnd01.get("fnd01_plan_yn")).isEqualTo("false");
        assertThat(fnd01.get("fnd01_close_yn")).isEqualTo("false");
        assertThat(jdbc.queryForObject("select fnd01_close_yn from fnd01_fund_code where fnd01_fund_cd = 'SIM002' and fnd01_company_id = 28000", String.class)).isEqualTo("true");

        // fnd02: 펀드명·수탁사·보수율이 들어간다 (운용부서명은 AS-IS처럼 null)
        Map<String, Object> fnd02 = jdbc.queryForMap("select i.* from fnd02_fund_info i join fnd01_fund_code c on c.fnd01_fund_code_id = i.fnd02_fund_code_id where c.fnd01_fund_cd = 'SIM001' and c.fnd01_company_id = 28000");
        assertThat(fnd02.get("fnd02_fund_nm")).isEqualTo("시뮬레이션 펀드 1호");
        assertThat(fnd02.get("fnd02_consignment_cd")).isEqualTo("SM001");
        assertThat(fnd02.get("fnd02_org_code_nm")).isNull();
        assertThat(((Number) fnd02.get("fnd02_management_rate")).doubleValue()).isEqualTo(5.5);

        // 수탁사·수탁은행·사무수탁사 코드가 회사에 생긴다
        assertThat(count("select count(*) from fnd03_consignment where fnd03_company_id = 28000 and fnd03_consignment_cd = 'SM001'")).isEqualTo(1);
        assertThat(count("select count(*) from fnd09_trust_bank where fnd09_company_id = 28000 and fnd09_trust_bank_cd = 'SB001'")).isEqualTo(1);
        assertThat(count("select count(*) from fnd06_office_work where fnd06_company_id = 28000 and fnd06_office_work_cd = 'SO001'")).isEqualTo(1);
    }

    @Test
    void 두번_돌려도_icam03은_그대로이고_바뀐것이_없으면_fnd02를_새로_넣지_않는다() {
        action.run(req("ALL"));
        int icam03 = count("select count(*) from icam03_fund");
        int fnd01 = count("select count(*) from fnd01_fund_code");
        long fnd02Id = jdbc.queryForObject("select i.fnd02_fund_info_id from fnd02_fund_info i join fnd01_fund_code c on c.fnd01_fund_code_id = i.fnd02_fund_code_id where c.fnd01_fund_cd = 'SIM001' and c.fnd01_company_id = 28000", Long.class);

        action.run(req("ALL"));

        assertThat(count("select count(*) from icam03_fund")).isEqualTo(icam03);
        assertThat(count("select count(*) from fnd01_fund_code")).isEqualTo(fnd01);
        assertThat(jdbc.queryForObject("select i.fnd02_fund_info_id from fnd02_fund_info i join fnd01_fund_code c on c.fnd01_fund_code_id = i.fnd02_fund_code_id where c.fnd01_fund_cd = 'SIM001' and c.fnd01_company_id = 28000", Long.class)).isEqualTo(fnd02Id);
    }

    @Test
    void 펀드명이_바뀌면_fnd02를_다시_넣는다() {
        action.run(req("ALL"));
        jdbc.update("update fnd02_fund_info set fnd02_fund_nm = '옛이름' where fnd02_fund_code_id = (select fnd01_fund_code_id from fnd01_fund_code where fnd01_fund_cd = 'SIM001' and fnd01_company_id = 28000)");

        action.run(req("ALL"));

        assertThat(jdbc.queryForObject("select i.fnd02_fund_nm from fnd02_fund_info i join fnd01_fund_code c on c.fnd01_fund_code_id = i.fnd02_fund_code_id where c.fnd01_fund_cd = 'SIM001' and c.fnd01_company_id = 28000 order by i.fnd02_work_date desc limit 1", String.class))
                .isEqualTo("시뮬레이션 펀드 1호");
    }

    @Test
    void 회사ID를_주면_그_회사만() {
        int before = count("select count(*) from icam03_fund");
        action.run(req("28000"));   // ICAM 회사코드 2018 — 펀드 2개
        assertThat(count("select count(*) from icam03_fund") - before).isEqualTo(2 * dayCount());
    }
}
