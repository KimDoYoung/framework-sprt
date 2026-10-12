package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AddTitleRes;
import kr.co.kfs.asseterp.biz.emp.dto.AddTitleSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EducationCopyReq;
import kr.co.kfs.asseterp.biz.emp.dto.EducationRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpAddTitleService;
import kr.co.kfs.asseterp.biz.emp.service.EmpEducationService;
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

/** C01-6 겸직발령(emp01·02·03·04에 쓰는 저장)·교육사항 일괄등록을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpAddTitleService.class, EmpEducationService.class})
class AddTitleDbTest {

    @Autowired EmpAddTitleService addTitleService;
    @Autowired EmpEducationService educationService;
    @Autowired JdbcTemplate jdbc;

    private static final long KFSTEST = 28000L;
    /** kfstest 사번 104 — 겸직 104-PT1, 104-PT2가 있다 */
    private static final long PERSON_104 = 29049L;
    private final UserPrincipal kfstest = UserPrincipal.builder().userId(-1L).companyId(KFSTEST).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private Long anyOrg() {
        return jdbc.queryForObject("select org01_code_id from org01_code where org01_company_id = ? order by org01_org_cd limit 1", Long.class, KFSTEST);
    }

    private int count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Integer.class, args);
    }

    @Test
    void 조회는_AS_IS와_같은_건수_다른회사는_0건() {
        assertThat(addTitleService.getAddTitles(kfstest, PERSON_104)).hasSize(2);
        assertThat(addTitleService.getAddTitles(other, PERSON_104)).isEmpty();
    }

    @Test
    void 겸직_등록_수정_삭제() {
        AddTitleSaveReq ins = new AddTitleSaveReq(null, PERSON_104, null, "2026-10-01", null, anyOrg(), "false", "100", "100", "시험겸직");
        AddTitleRes row = addTitleService.updateList(kfstest, ins);

        // 겸직사번: 기존 PT1·PT2의 최대 + 1
        assertThat(row.empNo()).isEqualTo("104-PT3");
        assertThat(row.transPersonId()).isEqualTo(row.addPersonId());
        assertThat(row.startDate()).isEqualTo("2026-10-01");
        Long add = row.addPersonId();
        assertThat(count("select count(*) from emp01_person where emp01_person_id = ? and emp01_company_id = ?", add, KFSTEST)).isEqualTo(1);
        assertThat(count("select count(*) from emp02_others where emp02_person_id = ? and emp02_others_id = ?", add, add)).isEqualTo(1);
        assertThat(count("select count(*) from emp03_trans where emp03_person_id = ? and emp03_trans_cd = '800' and emp03_kind_cd = '10'", add)).isEqualTo(1);

        // 수정: 겸직사원 발령과 emp04를 함께 바꾼다
        AddTitleSaveReq upd = new AddTitleSaveReq(row.addTitleId(), PERSON_104, add, "2026-10-02", "2026-12-31", anyOrg(), "true", "100", "100", "수정");
        AddTitleRes updated = addTitleService.updateList(kfstest, upd);
        assertThat(updated.closeDate()).isEqualTo("2026-12-31");
        assertThat(updated.transReason()).isEqualTo("수정");
        assertThat(updated.orgHeadYn()).isEqualTo("true");
        assertThat(count("select count(*) from emp03_trans where emp03_person_id = ? and emp03_trans_date = '2026-10-02'", add)).isEqualTo(1);

        // 다른 회사는 수정·삭제 못 함
        assertThatThrownBy(() -> addTitleService.updateList(other, upd)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> addTitleService.deleteAddTitle(other, row.addTitleId())).isInstanceOf(BusinessException.class);

        // 삭제: 결재 없으면 emp01·02·03·04 모두 지운다
        assertThat(addTitleService.deleteAddTitle(kfstest, row.addTitleId())).isEqualTo(1);
        assertThat(count("select count(*) from emp01_person where emp01_person_id = ?", add)).isZero();
        assertThat(count("select count(*) from emp02_others where emp02_person_id = ?", add)).isZero();
        assertThat(count("select count(*) from emp03_trans where emp03_person_id = ?", add)).isZero();
        assertThat(count("select count(*) from emp04_add_title where emp04_add_title_id = ?", row.addTitleId())).isZero();
    }

    @Test
    void 결재에_쓰인_겸직은_삭제_불가() {
        // 104-PT2 (결재 6건)
        assertThatThrownBy(() -> addTitleService.deleteAddTitle(kfstest, 202405141700495L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("해당 겸직은 삭제할 수 없습니다");
        assertThat(count("select count(*) from emp04_add_title where emp04_add_title_id = 202405141700495")).isEqualTo(1);
    }

    @Test
    void 교육사항_일괄등록은_고른_사람마다_같은_행을_만든다() {
        Long src = jdbc.queryForObject("select emp19_education_id from emp19_education where emp19_person_id = 29045 limit 1", Long.class);
        int before = educationService.getEducations(kfstest, PERSON_104).size();

        assertThat(educationService.copyEducation(kfstest, new EducationCopyReq(src, List.of(PERSON_104)))).isEqualTo(1);
        List<EducationRes> after = educationService.getEducations(kfstest, PERSON_104);
        assertThat(after).hasSize(before + 1);
        EducationRes s = jdbc.queryForObject("select emp19_content, emp19_note from emp19_education where emp19_education_id = ?",
                (rs, i) -> new EducationRes(null, null, null, rs.getString(1), null, rs.getString(2), null), src);
        assertThat(after).anyMatch(r -> java.util.Objects.equals(r.content(), s.content()) && java.util.Objects.equals(r.note(), s.note()));

        // 다른 회사 원본·사람은 거절
        assertThatThrownBy(() -> educationService.copyEducation(other, new EducationCopyReq(src, List.of(PERSON_104))))
                .isInstanceOf(BusinessException.class);
    }
}
