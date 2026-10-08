package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.PersonSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpPersonService;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransService;
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

/** C01 사원정보 관리: 목록·신규사원 등록·기본정보 저장·삭제·발령 저장을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpTransInfoService.class, EmpPersonService.class, EmpTransService.class})
class TransInfoDbTest {

    @Autowired EmpTransInfoService transInfoService;
    @Autowired EmpPersonService personService;
    @Autowired EmpTransService transService;
    @Autowired JdbcTemplate jdbc;

    private static final long KFSTEST = 28000L;
    private final UserPrincipal kfstest = UserPrincipal.builder().userId(-1L).companyId(KFSTEST).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private Long anyOrg() {
        return jdbc.queryForObject("select org01_code_id from org01_code where org01_company_id = ? order by org01_org_cd limit 1", Long.class, KFSTEST);
    }

    private TransInfoCreateReq req(String empNo) {
        return new TransInfoCreateReq(empNo, "시험사원", "10", LocalDate.of(2026, 1, 2), null, null, null, "010-0000-0000",
                null, "t@t.t", "100", "100", anyOrg(), null);
    }

    @Test
    void 재직구분별_목록() {
        List<TransInfoRes> all = transInfoService.searchTransInfos(kfstest, LocalDate.now(), "", "000");
        List<TransInfoRes> work = transInfoService.searchTransInfos(kfstest, LocalDate.now(), "", "100");
        assertThat(all.size()).isGreaterThanOrEqualTo(work.size());
        assertThat(work).allMatch(r -> r.transCd().compareTo("799") <= 0);
    }

    @Test
    void 신규사원_등록은_사람_기타_발령_급여공제를_만든다() {
        TransInfoRes row = transInfoService.createTransInfo(kfstest, req("ZZTEST01"));
        assertThat(row.korNm()).isEqualTo("시험사원");
        assertThat(row.transCd()).isEqualTo("100");
        Long pid = row.personId();
        assertThat(jdbc.queryForObject("select count(*) from emp02_others where emp02_person_id = ?", Integer.class, pid)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from emp35_deduct where emp35_person_id = ?", Integer.class, pid)).isEqualTo(1);
        int types = jdbc.queryForObject("select count(*) from sys09_code a, sys08_code_kind b where sys08_code_kind_id = sys09_code_kind_id "
                + "and sys09_company_id = 0 and sys08_kind_cd = 'AddDeductType' and sys09_apply_date <= '2026-01-02'", Integer.class);
        assertThat(jdbc.queryForObject("select count(*) from emp36_add_deduct join emp35_deduct on emp35_deduct_id = emp36_deduct_id "
                + "where emp35_person_id = ?", Integer.class, pid)).isEqualTo(types);
        // 목록(재직)에 나오고, 현재 발령으로 다시 읽힌다
        assertThat(transInfoService.searchTransInfos(kfstest, LocalDate.now(), "ZZTEST01", "100")).hasSize(1);
        assertThat(transInfoService.getCurrentTransInfo(kfstest, pid).transId()).isEqualTo(row.transId());
        // 사번 중복
        assertThatThrownBy(() -> transInfoService.createTransInfo(kfstest, req("ZZTEST01"))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 기본정보_저장_발령_추가와_삭제_사람_삭제() {
        TransInfoRes row = transInfoService.createTransInfo(kfstest, req("ZZTEST02"));
        Long pid = row.personId();
        personService.updatePerson(kfstest, pid, new PersonSaveReq("ZZTEST02", "바뀐이름", LocalDate.of(2026, 1, 2), null, null, "5",
                "t@t.t", null, null, "010", null));
        assertThat(transInfoService.getCurrentTransInfo(kfstest, pid).korNm()).isEqualTo("바뀐이름");
        // 다른 회사로는 못 바꾼다
        assertThatThrownBy(() -> personService.updatePerson(other, pid, new PersonSaveReq("X", "X", null, null, null, null, null, null, null, null, null)))
                .isInstanceOf(BusinessException.class);

        List<TransRes> saved = transService.updateTranses(kfstest, List.of(new TransSaveReq(-1L, pid, LocalDate.of(2026, 3, 1), "200", "10",
                row.orgCodeId(), "100", "100", "업무", null, "이동")));
        assertThat(saved.get(0).transId()).isPositive();
        assertThat(transService.searchTranses(kfstest, pid)).hasSize(2);
        assertThat(transInfoService.getCurrentTransInfo(kfstest, pid).transId()).isEqualTo(saved.get(0).transId());
        // 같은 날 같은 발령구분은 유일 인덱스
        assertThatThrownBy(() -> transService.updateTranses(kfstest, List.of(new TransSaveReq(-1L, pid, LocalDate.of(2026, 3, 1), "200", "10",
                row.orgCodeId(), "100", "100", null, null, null)))).isInstanceOf(BusinessException.class);

        assertThat(transService.deleteTranses(other, List.of(saved.get(0).transId()))).isZero();
        assertThat(transService.deleteTranses(kfstest, List.of(saved.get(0).transId()))).isEqualTo(1);

        personService.deletePerson(kfstest, pid);
        assertThat(jdbc.queryForObject("select count(*) from emp01_person where emp01_person_id = ?", Integer.class, pid)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from emp99_person_del where emp99_person_id = ?", Integer.class, pid)).isEqualTo(1);
    }
}
