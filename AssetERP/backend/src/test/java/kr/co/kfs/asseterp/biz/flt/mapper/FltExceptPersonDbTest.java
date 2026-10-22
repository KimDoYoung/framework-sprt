package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.ExceptPersonRes;
import kr.co.kfs.asseterp.biz.flt.dto.ExceptPersonSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltExceptPersonService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * J09 예외사원 조회창(Flt16_Lookup_ExceptPerson)을 asseterpdb에서 돌린다. 회사 28000, 사원 29025·29027(getPerson에 있는 사원).
 * 쓰기는 테스트 트랜잭션이라 롤백된다(03 원칙 2). 테이블 flt16_except_person은 2026-10-22 사용자가 만들었고 처음엔 0행이다
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FltExceptPersonService.class)
class FltExceptPersonDbTest {

    @Autowired FltExceptPersonService service;
    @Autowired FltTrMapper trMapper;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    @Test
    void 예외사원은_등록_수정_삭제가_되고_사원명과_부서명이_함께_읽힌다() {
        int before = service.search(user).size();

        ExceptPersonRes created = service.update(user, List.of(new ExceptPersonSaveReq(-1L, 29025L, "박동진", "2026-10-22", "시험"))).get(0);
        assertThat(created.exceptPersonId()).isPositive();
        assertThat(created.personName()).isEqualTo("박동진");
        assertThat(created.orgName()).isNotBlank();
        assertThat(created.rptStartDate()).isEqualTo("2026-10-22");
        assertThat(service.search(user)).hasSize(before + 1);

        ExceptPersonRes edited = service.update(user, List.of(new ExceptPersonSaveReq(created.exceptPersonId(), 29025L, "박동진", "2026-11-01", "사유 변경"))).get(0);
        assertThat(edited.rptStartDate()).isEqualTo("2026-11-01");
        assertThat(edited.reason()).isEqualTo("사유 변경");

        assertThat(service.delete(user, List.of(created.exceptPersonId()))).isEqualTo(1);
        assertThat(service.search(user)).hasSize(before);
    }

    @Test
    void 같은_사원은_다른_행으로_다시_등록할_수_없다() {
        ExceptPersonRes first = service.update(user, List.of(new ExceptPersonSaveReq(-1L, 29025L, "박동진", "2026-10-22", "시험"))).get(0);

        assertThatThrownBy(() -> service.update(user, List.of(new ExceptPersonSaveReq(-2L, 29025L, "박동진", "2026-10-22", "중복"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("[박동진] 사원은 이미 등록되어 있습니다");
        // 자기 행을 다시 저장하는 것은 중복이 아니다
        assertThat(service.update(user, List.of(new ExceptPersonSaveReq(first.exceptPersonId(), 29025L, "박동진", "2026-10-23", "시험")))).hasSize(1);
    }

    /** I04·I05 정기보고 점검 — 예외사원이 있으면 회사 기준(2026-01-01)보다 예외자 보고시작일이 먼저다(AS-IS flt02_emp.selectByDate의 COALESCE) */
    @Test
    void 정기보고_점검은_예외자_보고시작일을_회사_기준보다_먼저_쓴다() {
        assertThat(trMapper.selectReportEmp(28000L, 29035L, "2026-10-22").rptStartDate()).isEqualTo("2026-01-01");

        ExceptPersonRes created = service.update(user, List.of(new ExceptPersonSaveReq(-1L, 29035L, "시험", "2026-05-01", "시험"))).get(0);
        assertThat(trMapper.selectReportEmp(28000L, 29035L, "2026-10-22").rptStartDate()).isEqualTo("2026-05-01");

        service.delete(user, List.of(created.exceptPersonId()));
        assertThat(trMapper.selectReportEmp(28000L, 29035L, "2026-10-22").rptStartDate()).isEqualTo("2026-01-01");
    }

    @Test
    void 남의_회사_행은_고치거나_지울_수_없다() {
        ExceptPersonRes created = service.update(user, List.of(new ExceptPersonSaveReq(-1L, 29027L, "윤정수", "2026-10-22", "시험"))).get(0);
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).roles(List.of("ROLE_USER")).build();

        assertThat(service.delete(other, List.of(created.exceptPersonId()))).isZero();
        assertThatThrownBy(() -> service.update(other, List.of(new ExceptPersonSaveReq(created.exceptPersonId(), 29027L, "윤정수", "2026-10-23", "침범"))))
                .isInstanceOf(BusinessException.class);
        assertThat(service.search(user).stream().anyMatch(r -> r.exceptPersonId().equals(created.exceptPersonId()))).isTrue();
    }
}
