package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.Flt11InsertAction;
import kr.co.kfs.asseterp.biz.batch.action.Sch04InsertAction;
import kr.co.kfs.asseterp.biz.batch.action.Sch09InsertAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SB02~SB04(sch04Insert·sch09Insert·flt11Insert)를 asseterpdb에서 실제로 돌리고 롤백한다 (@MybatisTest 기본 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({Sch04InsertAction.class, Sch09InsertAction.class, Flt11InsertAction.class})
class BatchActionsDbTest {

    @Autowired Sch04InsertAction sch04;
    @Autowired Sch09InsertAction sch09;
    @Autowired Flt11InsertAction flt11;
    @Autowired JdbcTemplate jdbc;

    private static BatchReq stdDate(String stdDate) {
        return new BatchReq(null, null, null, stdDate, null, null, null, null, null);
    }

    @Test
    void sch04Insert는_사용_중인_회사의_미처리_스케줄을_만든다() {
        Integer before = jdbc.queryForObject("select count(*) from sch04_list", Integer.class);

        String msg = sch04.run(stdDate("2026-11-03"));

        Integer after = jdbc.queryForObject("select count(*) from sch04_list", Integer.class);
        assertThat(msg).isEqualTo("미처리 스케줄 Sch04에 Insert 작업완료.. commit");
        assertThat(after).isGreaterThan(before);
    }

    @Test
    void sch04Insert는_stdDate가_없으면_직전_영업일로_돌아간다() {
        assertThat(sch04.run(stdDate(null))).contains("Sch04");
    }

    /**
     * AS-IS는 createSch09를 selectOne으로 부른다. 한 회사에 대상 행(sch03 반복일정)이 2개 이상이면 MyBatis가
     * TooManyResultsException을 던져 전체가 롤백된다 — 이상한 점으로 기록(원본-이상한점.md). 그대로 옮겼으므로 같게 동작해야 한다.
     */
    @Test
    void sch09Insert는_AS_IS처럼_한_회사에_대상이_둘_이상이면_실패한다() {
        Integer maxPerCompany = jdbc.queryForObject("""
                select coalesce(max(cnt), 0) from (
                  select count(*) cnt
                    from sch01_info INNER JOIN sch03_deadline ON sch03_info_id = sch01_info_id
                   where sch01_use_yn = 'true' and sch03_schedule_cd = '1' and sch03_cycle_cd not in ('01','99')
                     and sch01_company_id in (select sys01_company_id from sys01_company
                                               where coalesce(sys01_use_yn,'false') = 'true' and sys01_company_id != 0)
                   group by sch01_company_id) t""", Integer.class);

        if (maxPerCompany > 1) {
            assertThatThrownBy(() -> sch09.run(stdDate("2026-11-04")))
                    .hasStackTraceContaining("TooManyResultsException");
        } else {
            assertThat(sch09.run(stdDate("2026-11-04"))).contains("Sch09");
        }
    }

    @Test
    void flt11Insert는_오류_없이_이월한다() {
        assertThat(flt11.run(stdDate(null))).isEqualTo("자기매매 보유원장 이월 작업완료.. commit");
    }
}
