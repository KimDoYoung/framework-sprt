package kr.co.kfs.asseterp.biz.icam;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthBatchReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthSaveReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopSaveReq;
import kr.co.kfs.asseterp.biz.icam.service.IcamUserStopAuthService;
import kr.co.kfs.asseterp.biz.icam.service.IcamUserStopService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** EE32 미사용ID 기록관리(조회·[변경]·일괄반영)를 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamUserStopAuthService.class, IcamUserStopService.class})
class IcamUserStopAuthDbTest {

    @Autowired IcamUserStopAuthService auth;
    @Autowired IcamUserStopService stop;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal me = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 기록관리는_조회_변경_일괄반영을_돈다() {
        LocalDate std = LocalDate.of(2099, 3, 31);
        stop.save(me, List.of(new IcamStopSaveReq(0L, std, "시험회사", "tuser1", "시험1", null), new IcamStopSaveReq(0L, std, "시험회사", "tuser2", "시험2", null)));
        // 처리상태 1(완료)·정지일 100일 전으로 만들어 "삭제대상"이 되게 한다
        jdbc.update("update icam55_icam_user set icam55_proc_state_cd = '1', icam55_proc_date = current_date - 100 where icam55_company_nm = '시험회사'");

        LocalDate from = LocalDate.now().minusDays(200);
        LocalDate to = LocalDate.now();
        List<IcamStopAuthRes> rows = auth.search("시험회사", from, to, false);
        assertThat(rows).hasSize(2);
        assertThat(rows).allMatch(r -> "삭제대상".equals(r.state()));
        assertThat(auth.search("시험회사", from, to, true)).hasSize(2);
        assertThat(auth.search("없는검색어zzz", from, to, false)).isEmpty();

        // [변경]: 삭제일자를 넣으면 처리자가 로그인 사원, 상태는 삭제
        Long id1 = rows.get(0).icamUserId();
        auth.update(me, id1, new IcamStopAuthSaveReq(LocalDate.now(), null, "메모"));
        assertThat(jdbc.queryForObject("select icam55_mng_emp_id from icam55_icam_user where icam55_icam_user_id = ?", Long.class, id1)).isEqualTo(29049L);
        assertThat(auth.search("시험회사", from, to, false)).filteredOn(r -> r.icamUserId().equals(id1)).singleElement().satisfies(r -> {
            assertThat(r.state()).isEqualTo("삭제");
            assertThat(r.note()).isEqualTo("메모");
        });
        assertThat(auth.search("시험회사", from, to, true)).hasSize(1);   // 삭제대상만 → 아직 안 지운 1건

        // 일괄반영: 해제일자 → 정지해제, 둘 다 비우면 처리자도 비운다
        List<Long> ids = rows.stream().map(IcamStopAuthRes::icamUserId).toList();
        auth.updateBatch(me, new IcamStopAuthBatchReq(ids, null, LocalDate.now(), null));
        assertThat(auth.search("시험회사", from, to, false)).allMatch(r -> "정지해제".equals(r.state()));
        auth.updateBatch(me, new IcamStopAuthBatchReq(ids, null, null, null));
        assertThat(jdbc.queryForObject("select count(*) from icam55_icam_user where icam55_company_nm = '시험회사' and icam55_mng_emp_id is not null", Integer.class)).isZero();

        assertThatThrownBy(() -> auth.updateBatch(me, new IcamStopAuthBatchReq(List.of(), null, null, null))).isInstanceOf(BusinessException.class).hasMessage("선택된 내역이 없습니다.");
    }
}
