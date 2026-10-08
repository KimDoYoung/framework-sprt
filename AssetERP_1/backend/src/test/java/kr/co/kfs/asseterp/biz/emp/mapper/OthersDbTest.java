package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.OthersRes;
import kr.co.kfs.asseterp.biz.emp.dto.OthersSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpOthersService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** C01-2 기타정보 탭: 조회·upsert(UPDATE / 행 없으면 INSERT)를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(EmpOthersService.class)
class OthersDbTest {

    @Autowired EmpOthersService othersService;
    @Autowired JdbcTemplate jdbc;

    private static final long KFSTEST = 28000L;
    private final UserPrincipal kfstest = UserPrincipal.builder().userId(-1L).companyId(KFSTEST).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private Long anyPerson() {
        return jdbc.queryForObject("""
                select emp01_person_id from emp01_person join emp02_others on emp02_person_id = emp01_person_id
                 where emp01_company_id = ? and emp02_ctz_no is not null order by emp01_person_id limit 1""", Long.class, KFSTEST);
    }

    private OthersSaveReq copy(OthersRes r, Long othersId, String ctz, LocalDate birthday, String gender, String note) {
        return new OthersSaveReq(othersId, r.personId(), r.chnName(), r.engName(), ctz, birthday, r.lunarCode(), gender,
                r.nationCode(), r.emailOther(), r.militaryCode(), r.familyDscr(), r.marriageCode(), r.zipCode(), r.zipAddress(),
                r.zipDetail(), r.homeTelNo(), note, r.hireDateGroup(), r.hireDateLeaveCalc());
    }

    @Test
    void 조회는_주민번호를_복호화한다() {
        OthersRes r = othersService.getOthers(kfstest, anyPerson());
        assertThat(r.othersId()).isNotNull();
        assertThat(r.decCtzNo()).isNotBlank();
    }

    @Test
    void 저장은_UPDATE하고_다시_읽은_값을_준다() {
        OthersRes r = othersService.getOthers(kfstest, anyPerson());
        OthersRes saved = othersService.updateOthers(kfstest, copy(r, r.othersId(), "900101-1234567", LocalDate.of(1990, 1, 1), "M", "시험비고"));
        assertThat(saved.othersId()).isEqualTo(r.othersId());
        assertThat(saved.decCtzNo()).isEqualTo("900101-1234567");
        assertThat(saved.birthday()).isEqualTo(LocalDate.of(1990, 1, 1));
        assertThat(saved.note()).isEqualTo("시험비고");
        assertThat(saved.hireDateGroup()).isEqualTo(r.hireDateGroup());
        Integer n = jdbc.queryForObject("select count(*) from emp02_others where emp02_person_id = ?", Integer.class, r.personId());
        assertThat(n).isEqualTo(1);
    }

    @Test
    void 기타정보_행이_없으면_INSERT한다() {
        Long personId = anyPerson();
        OthersRes r = othersService.getOthers(kfstest, personId);
        jdbc.update("delete from emp02_others where emp02_person_id = ?", personId);
        // (MyBatis 1차 캐시는 JdbcTemplate 삭제를 모르므로 조회 대신 건수로 본다)
        assertThat(jdbc.queryForObject("select count(*) from emp02_others where emp02_person_id = ?", Integer.class, personId)).isZero();
        OthersRes saved = othersService.updateOthers(kfstest, copy(r, null, r.decCtzNo(), r.birthday(), r.genderCode(), r.note()));
        assertThat(saved.othersId()).isNotNull();
        assertThat(saved.decCtzNo()).isEqualTo(r.decCtzNo());
    }

    @Test
    void 다른_회사_사람은_막는다() {
        Long personId = anyPerson();
        assertThatThrownBy(() -> othersService.getOthers(other, personId)).isInstanceOf(BusinessException.class);
        OthersRes r = othersService.getOthers(kfstest, personId);
        assertThatThrownBy(() -> othersService.updateOthers(other, copy(r, r.othersId(), "x", null, null, null)))
                .isInstanceOf(BusinessException.class);
    }
}
