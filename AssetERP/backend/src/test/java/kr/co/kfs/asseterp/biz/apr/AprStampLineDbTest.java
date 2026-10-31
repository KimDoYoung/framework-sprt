package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprNewStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampLineRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprNewService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;

/** V12 인감 선택 뒤 결재선 다시 만들기를 asseterpdb에서 읽는다 (읽기 전용 — 번호표만 쓰고 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(AprApprNewService.class)
class AprStampLineDbTest {

    /** 인감합의 여부 true(인감책임자 29041), 사원 29049의 조직이 사용 가능 부서 */
    private static final long STAMP_STEP = 202502062116502L;
    /** 전체사용(true), 인감합의 여부 false */
    private static final long STAMP_ALL = 35291L;
    /** 전체사용이 아니고 허용 부서도 없음 */
    private static final long STAMP_NO_ROLE = 15562L;

    @Autowired AprApprNewService service;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = 202609229873969", Long.class);
    }

    @Test
    void 인감이_없으면_기본_결재선만_돌려준다() {
        AprStampLineRes res = service.stampLine(user(29049L), classTreeId(), null, false);
        assertThat(res.ok()).isTrue();
        assertThat(res.stampId()).isNull();
        assertThat(res.outType()).isFalse();
        assertThat(res.steps()).isNotEmpty();
        assertThat(res.steps().get(0).stepTypeCode()).isEqualTo("00");
        assertThat(res.steps()).noneMatch(s -> "40".equals(s.stepTypeCode()));
    }

    @Test
    void 인감합의_인감은_결재선_끝에_인감_줄을_넣는다() {
        List<AprNewStepRes> base = service.stampLine(user(29049L), classTreeId(), null, false).steps();
        AprStampLineRes res = service.stampLine(user(29049L), classTreeId(), STAMP_STEP, false);
        assertThat(res.ok()).isTrue();
        assertThat(res.outType()).isTrue();
        assertThat(res.stampName()).isEqualTo("영임 테스트 인감");
        AprNewStepRes stamp = res.steps().stream().filter(s -> "40".equals(s.stepTypeCode())).findFirst().orElseThrow();
        assertThat(stamp.stepEmpId()).isEqualTo(29041L);
        assertThat(stamp.stepTypeName()).isEqualTo("인감");
        assertThat(stamp.stepStatusCode()).isEqualTo("10");
        assertThat(stamp.lockYn()).isTrue();
        assertThat(stamp.stepApprName()).startsWith("<b>정) </b>");
        assertThat(stamp.seq()).isEqualTo(String.format("%03d", base.size() + 3));
        assertThat(res.steps().size()).isGreaterThanOrEqualTo(base.size() + 1);
    }

    @Test
    void 인감합의가_아니면_줄을_더하지_않고_대외문서로_바꾼다() {
        AprStampLineRes res = service.stampLine(user(29049L), classTreeId(), STAMP_ALL, true);
        assertThat(res.ok()).isTrue();
        assertThat(res.outType()).isTrue();
        assertThat(res.steps()).noneMatch(s -> "40".equals(s.stepTypeCode()));
    }

    @Test
    void 기본_인감은_부서_권한을_먼저_검사한다() {
        AprStampLineRes res = service.stampLine(user(29049L), classTreeId(), STAMP_NO_ROLE, true);
        assertThat(res.ok()).isFalse();
        assertThat(res.message()).isEqualTo("해당문서분류에 지정된 인감을 사용할 수 없는 부서입니다. 관리자에게 문의하세요");
        assertThat(res.stampId()).isNull();
        // 조회창에서 고른 인감은 검사하지 않는다 (findLookupStamp)
        assertThat(service.stampLine(user(29049L), classTreeId(), STAMP_NO_ROLE, false).ok()).isTrue();
    }
}
