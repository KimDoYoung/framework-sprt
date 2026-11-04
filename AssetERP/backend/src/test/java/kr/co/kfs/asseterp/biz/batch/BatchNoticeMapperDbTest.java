package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticeCompany;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** SB08~SB10 알림 배치의 SQL이 asseterpdb에서 실제로 도는지 본다 (읽기 위주, 쓰기는 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BatchNoticeMapperDbTest {

    @Autowired BatchNoticeMapper mapper;
    @Autowired JdbcTemplate jdbc;

    @Test
    void 알림_대상_회사는_AS_IS_조건대로_사용여부_비어있는_회사까지_뽑는다() {
        int expected = jdbc.queryForObject("select count(*) from sys01_company where COALESCE(sys01_use_yn,'true') = 'true'", Integer.class);

        List<BatchNoticeCompany> companies = mapper.selectNoticeCompanies();

        assertThat(companies).hasSize(expected);
        assertThat(companies).allSatisfy(c -> assertThat(c.companyId()).isNotNull());
    }

    @Test
    void 알람_예정내역_생성_SQL이_모든_사용_회사에서_오류없이_돈다() {
        Long company = jdbc.queryForObject("select min(sys01_company_id) from sys01_company where COALESCE(sys01_use_yn,'false')='true' and sys01_company_id != 0", Long.class);
        for (Long id : jdbc.queryForList("select sys01_company_id from sys01_company where COALESCE(sys01_use_yn,'false')='true' and sys01_company_id != 0", Long.class)) {
            assertThat(mapper.insertAlarmTarget(id)).isGreaterThanOrEqualTo(0);
        }
        assertThat(company).isNotNull();
        assertThat(mapper.selectPendingAlarms("1")).isNotNull();
    }

    @Test
    void 나머지_조회_SQL이_돈다() {
        for (BatchNoticeCompany c : mapper.selectNoticeCompanies()) {
            assertThat(mapper.countFlt10Pending(c.companyId())).isGreaterThanOrEqualTo(0);
            assertThat(mapper.selectSmsNoticeTargets(c.companyId(), "B01")).isNotNull();
            assertThat(mapper.selectExpenseRequests(c.companyId())).isNotNull();
            assertThat(mapper.selectCompanyLoc(c.companyId())).isEqualTo(c.locName());
        }
        assertThat(mapper.selectTodayAltAppr(-1L)).isEmpty();
        assertThat(mapper.selectPerson(-1L)).isNull();
    }
}
