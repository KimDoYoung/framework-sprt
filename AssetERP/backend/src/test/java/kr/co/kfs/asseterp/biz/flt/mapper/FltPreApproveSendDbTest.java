package kr.co.kfs.asseterp.biz.flt.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.flt.dto.PreApproveSendTargetRow;

/**
 * #1128 사전신고 승인 [협의승인요청 알림발송] 대상(AS-IS flt10_tr.getSendMessageList02, ecfa0f17b — CH-0359).
 * 로컬 DB에는 협의승인자가 지정된 승인 대기(20) 건이 없어, 회사 28000에서 승인 대기 건이 둘 이상인 사원의 두 건에 협의승인자를 넣고 본다(롤백).
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class FltPreApproveSendDbTest {

    @Autowired FltPreApproveMapper mapper;
    @Autowired JdbcTemplate jdbc;

    /** AS-IS 원문(ROW_NUMBER 열만 뺌) */
    private static final String ASIS = "SELECT flt10_person_id AS person_id, COUNT(*) AS count FROM flt10_tr "
            + "WHERE flt10_company_id = ? AND flt10_add_confirmer_id IS NOT NULL AND COALESCE(flt10_status_cd, '00') = '20' "
            + "GROUP BY flt10_person_id ORDER BY flt10_person_id";

    @Test
    void 협의승인자가_지정된_승인대기_건만_사원별로_센다() {
        // 출발점: 승인대기(20) 건의 협의승인자를 모두 비운다(DB 사본에 이미 지정된 건이 있을 수 있다, 롤백)
        jdbc.update("update flt10_tr set flt10_add_confirmer_id = null where flt10_company_id = 28000 and coalesce(flt10_status_cd, '00') = '20'");
        // 처음 확인은 jdbc로 — 매퍼를 먼저 부르면 같은 세션의 MyBatis 1차 캐시가 jdbc 수정 뒤에도 빈 결과를 돌려준다
        assertThat(jdbc.queryForList(ASIS, 28000L)).isEmpty();

        Long person = jdbc.queryForObject("select flt10_person_id from flt10_tr where flt10_company_id = 28000 and flt10_status_cd = '20' "
                + "group by flt10_person_id having count(*) >= 2 order by flt10_person_id limit 1", Long.class);
        List<Long> ids = jdbc.queryForList("select flt10_tr_id from flt10_tr where flt10_company_id = 28000 and flt10_person_id = ? "
                + "and flt10_status_cd = '20' order by flt10_tr_id limit 2", Long.class, person);
        assertThat(ids).hasSize(2);
        ids.forEach(id -> jdbc.update("update flt10_tr set flt10_add_confirmer_id = 29049 where flt10_tr_id = ?", id));
        // 협의승인자는 있지만 승인 대기가 아닌 건(30)은 빠진다
        jdbc.update("update flt10_tr set flt10_add_confirmer_id = 29049 where flt10_company_id = 28000 and flt10_status_cd = '30'");

        List<PreApproveSendTargetRow> rows = mapper.selectSendMessageList02(28000L);
        assertThat(rows).extracting(PreApproveSendTargetRow::personId, PreApproveSendTargetRow::count)
                .containsExactly(tuple(person, 2));

        List<Map<String, Object>> asis = jdbc.queryForList(ASIS, 28000L);
        assertThat(asis).hasSize(rows.size());
        assertThat(((Number) asis.get(0).get("person_id")).longValue()).isEqualTo(person);
        assertThat(((Number) asis.get(0).get("count")).longValue()).isEqualTo(2L);
    }
}
