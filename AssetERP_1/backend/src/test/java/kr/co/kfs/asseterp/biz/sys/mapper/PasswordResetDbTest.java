package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.PasswordPersonRes;
import kr.co.kfs.asseterp.biz.sys.service.SysPasswordService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * A19 비밀번호 초기화를 asseterpdb에서 실제로 돌리고 롤백한다.
 * 비밀번호를 비우는 동작이라 실제 사용자로는 화면·API에서 시험하지 않는다 — 여기서만(롤백) 한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SysPasswordService.class)
class PasswordResetDbTest {

    private static final long COMPANY = 28000L;  // kfstest

    @Autowired SysPasswordService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(COMPANY).roles(List.of("ROLE_ADMIN")).build();

    private Long personWithPassword() {
        return jdbc.queryForObject("select sys25_person_id from sys25_password where sys25_company_id = ? limit 1", Long.class, COMPANY);
    }

    private Long personWithoutPassword() {
        return jdbc.queryForObject("select emp01_person_id from emp01_person p where emp01_company_id = ? "
                + "and not exists (select 1 from sys25_password where sys25_person_id = p.emp01_person_id) limit 1", Long.class, COMPANY);
    }

    @Test
    void 조회는_사원을_고르지_않으면_그_회사_재직자_전체_고르면_한_명() {
        List<PasswordPersonRes> all = service.search(admin, null);
        assertThat(all).isNotEmpty().allSatisfy(r -> assertThat(r.empNo()).isNotNull());
        PasswordPersonRes first = all.get(0);
        List<PasswordPersonRes> one = service.search(admin, first.personId());
        assertThat(one).hasSize(1);
        assertThat(one.get(0).empKorName()).isEqualTo(first.empKorName());
        assertThat(one.get(0).orgName()).isEqualTo(first.orgName());
        // 다른 회사의 사원은 조회되지 않는다
        UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(0L).roles(List.of("ROLE_ADMIN")).build();
        assertThat(service.search(other, first.personId())).isEmpty();
    }

    @Test
    void 잠금해제는_lock_yn을_false로_바꾸고_다른_회사_사원은_거절() {
        Long personId = service.search(admin, null).get(0).personId();
        jdbc.update("update emp01_person set emp01_lock_yn = 'true' where emp01_person_id = ?", personId);
        assertThat(service.search(admin, personId).get(0).lockYn()).isEqualTo("true");
        service.unlock(admin, personId);
        assertThat(service.search(admin, personId).get(0).lockYn()).isEqualTo("false");
        UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(0L).roles(List.of("ROLE_ADMIN")).build();
        assertThatThrownBy(() -> service.unlock(other, personId)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.unlock(admin, null)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 초기화는_이력이_있으면_가장_최근_순번의_비밀번호를_비우고_없으면_순번_1로_빈_행을_만든다() {
        Long withPwd = personWithPassword();
        int before = jdbc.queryForObject("select count(*) from sys25_password where sys25_person_id = ?", Integer.class, withPwd);
        long lastSeq = jdbc.queryForObject("select max(sys25_seq) from sys25_password where sys25_person_id = ?", Long.class, withPwd);
        service.resetPassword(admin, withPwd);
        assertThat(jdbc.queryForObject("select count(*) from sys25_password where sys25_person_id = ?", Integer.class, withPwd)).isEqualTo(before);
        assertThat(jdbc.queryForObject("select sys25_pwd from sys25_password where sys25_person_id = ? and sys25_seq = ?", String.class, withPwd, lastSeq)).isNull();

        Long without = personWithoutPassword();
        service.resetPassword(admin, without);
        List<java.util.Map<String, Object>> rows = jdbc.queryForList("select sys25_seq, sys25_pwd, sys25_company_id from sys25_password where sys25_person_id = ?", without);
        assertThat(rows).hasSize(1);
        assertThat(((Number) rows.get(0).get("sys25_seq")).longValue()).isEqualTo(1L);
        assertThat(rows.get(0).get("sys25_pwd")).isNull();
        assertThat(((Number) rows.get(0).get("sys25_company_id")).longValue()).isEqualTo(COMPANY);
        // 다시 누르면 새 행이 아니라 그 행을 갱신
        service.resetPassword(admin, without);
        assertThat(jdbc.queryForObject("select count(*) from sys25_password where sys25_person_id = ?", Integer.class, without)).isEqualTo(1);
    }

    @Test
    void 다른_회사_사원의_비밀번호는_초기화할_수_없다() {
        Long withPwd = personWithPassword();
        int nullBefore = jdbc.queryForObject("select count(*) from sys25_password where sys25_person_id = ? and sys25_pwd is null", Integer.class, withPwd);
        UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(0L).roles(List.of("ROLE_ADMIN")).build();
        assertThatThrownBy(() -> service.resetPassword(other, withPwd)).isInstanceOf(BusinessException.class);
        assertThat(jdbc.queryForObject("select count(*) from sys25_password where sys25_person_id = ? and sys25_pwd is null", Integer.class, withPwd)).isEqualTo(nullBefore);
    }
}
