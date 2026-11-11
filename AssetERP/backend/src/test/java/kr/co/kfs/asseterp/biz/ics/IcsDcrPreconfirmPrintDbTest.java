package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmPrintReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsDcrPreconfirmService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * #1425 사전확인 대장 출력(AS-IS Sys99_Print.insertRdDcrPreConfirm)을 asseterpdb에서 돌리고 롤백한다.
 * 원본 2026-11-04(CH-0115): 글자 열은 checkNull을 거쳐 null 대신 ''로 쌓인다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsDcrPreconfirmService.class)
class IcsDcrPreconfirmPrintDbTest {

    @Autowired IcsDcrPreconfirmService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 출력자료의_글자열은_null없이_빈칸으로_쌓인다() {
        String groupId = service.insertRd(user, new IcsDcrPreconfirmPrintReq(LocalDate.of(2025, 1, 1), LocalDate.of(2026, 12, 31), "%", ""));
        long gid = Long.parseLong(groupId);

        Integer rows = jdbc.queryForObject("select count(*) from sys99_print where sys99_group_id = ?", Integer.class, gid);
        assertThat(rows).isPositive();

        Integer nulls = jdbc.queryForObject("""
                select count(*) from sys99_print
                 where sys99_group_id = ?
                   and (sys99_string01 is null or sys99_string02 is null or sys99_string03 is null or sys99_string04 is null
                     or sys99_string05 is null or sys99_string06 is null or sys99_string07 is null or sys99_string08 is null
                     or sys99_string09 is null or sys99_string10 is null or sys99_string11 is null or sys99_string12 is null
                     or sys99_string13 is null or sys99_text01 is null or sys99_text02 is null or sys99_text03 is null)
                """, Integer.class, gid);
        assertThat(nulls).isZero();

        // 원본 자료에 광고내용(null)인 행이 있으면 출력에는 ''로 들어가 있다
        Integer blanks = jdbc.queryForObject("select count(*) from sys99_print where sys99_group_id = ? and sys99_string10 = ''", Integer.class, gid);
        assertThat(blanks).isPositive();
    }
}
