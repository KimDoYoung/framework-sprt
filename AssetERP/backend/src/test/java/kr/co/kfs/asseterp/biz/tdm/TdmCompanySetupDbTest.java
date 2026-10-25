package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CompanySetupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CompanySetupSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCompanySetupService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** N29 책무관리 시스템설정(Tdm91_Tab_CompanySetup)의 조회·저장·삭제를 asseterpdb에서 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TdmCompanySetupService.class)
class TdmCompanySetupDbTest {

    @Autowired TdmCompanySetupService service;

    /** kfstest — 설정 2건(2025-01-01, 2026-01-11) */
    private static final long COMPANY = 28000L;
    private static final UserPrincipal USER = UserPrincipal.builder().userId(29037L).companyId(COMPANY).name("N29시험").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();

    @Test
    void 조회는_적용시작일_내림차순이고_기본_행이_함께_온다() {
        List<CompanySetupRes> rows = service.search(USER);
        assertThat(rows).hasSizeGreaterThanOrEqualTo(3);
        assertThat(rows).extracting(CompanySetupRes::startDate).isSortedAccordingTo(java.util.Comparator.reverseOrder());
        assertThat(rows.get(rows.size() - 1).startDate()).isEqualTo(LocalDate.of(2025, 1, 1));
        assertThat(rows).anySatisfy(r -> {
            assertThat(r.startDate()).isEqualTo(LocalDate.of(2026, 1, 1));   // 기본 행 (DB에는 없음)
            assertThat(r.batchApprUseYn()).isEqualTo("true");
            assertThat(r.evidFileCheckYn()).isEqualTo("false");
            assertThat(r.companySetupId()).isEqualTo(TdmCompanySetupService.DEFAULT_ROW_ID);
        });
        // 다른 회사는 설정이 없어도 기본 행 하나가 온다
        assertThat(service.search(OTHER)).anySatisfy(r -> assertThat(r.startDate()).isEqualTo(LocalDate.of(2026, 1, 1)));
    }

    @Test
    void 저장은_새_행을_넣고_고친_행을_바꾸며_삭제로_지워진다() {
        CompanySetupRes created = service.save(USER, List.of(
                new CompanySetupSaveReq(-1L, LocalDate.of(2027, 3, 1), 10L, "true", "false", "true", "N29 시험"))).get(0);
        assertThat(created.companySetupId()).isPositive();
        assertThat(created.cmntMinLimit()).isEqualTo(10L);
        assertThat(created.note()).isEqualTo("N29 시험");

        CompanySetupRes updated = service.save(USER, List.of(
                new CompanySetupSaveReq(created.companySetupId(), LocalDate.of(2027, 3, 2), 20L, "false", "false", "true", null))).get(0);
        assertThat(updated.startDate()).isEqualTo(LocalDate.of(2027, 3, 2));
        assertThat(updated.cmntMinLimit()).isEqualTo(20L);
        assertThat(updated.batchCheckUseYn()).isEqualTo("false");

        assertThat(service.delete(USER, List.of(created.companySetupId()))).isEqualTo(1);
        assertThat(service.search(USER)).noneMatch(r -> created.companySetupId().equals(r.companySetupId()));
    }

    @Test
    void 기본_행을_고쳐_저장하면_새로_넣고_사라진_행도_다시_넣는다() {
        CompanySetupRes inserted = service.save(OTHER, List.of(
                new CompanySetupSaveReq(TdmCompanySetupService.DEFAULT_ROW_ID, LocalDate.of(2027, 4, 1), null, "false", "true", "false", null))).get(0);
        assertThat(inserted.companySetupId()).isPositive();
        assertThat(service.search(OTHER)).extracting(CompanySetupRes::startDate).contains(LocalDate.of(2027, 4, 1));

        // 같은 날짜를 기본 행으로 한 번 더 저장하면 중복 (기본 행은 ID가 있어 검사가 걸린다)
        assertThatThrownBy(() -> service.save(OTHER, List.of(
                new CompanySetupSaveReq(TdmCompanySetupService.DEFAULT_ROW_ID, LocalDate.of(2027, 4, 1), null, "false", "true", "false", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("중복");

        // 남이 지워 버린 행(양수 ID, DB에 없음)을 저장하면 같은 ID로 다시 들어간다
        service.delete(OTHER, List.of(inserted.companySetupId()));
        CompanySetupRes again = service.save(OTHER, List.of(
                new CompanySetupSaveReq(inserted.companySetupId(), LocalDate.of(2027, 4, 1), null, "false", "true", "false", null))).get(0);
        assertThat(again.companySetupId()).isEqualTo(inserted.companySetupId());
    }

    @Test
    void 기본_날짜와_중복_날짜와_남의_회사는_막는다() {
        assertThatThrownBy(() -> service.save(USER, List.of(new CompanySetupSaveReq(-1L, LocalDate.of(2026, 1, 1), null, "true", "true", "true", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("2026-01-02");
        assertThatThrownBy(() -> service.save(USER, List.of(new CompanySetupSaveReq(-1L, null, null, "true", "true", "true", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("적용시작일자를 입력하세요");

        // 고친 행의 날짜를 다른 행과 같게 하면 중복 (2026-01-11 행을 2025-01-01로)
        CompanySetupRes second = service.search(USER).stream().filter(r -> LocalDate.of(2026, 1, 11).equals(r.startDate())).findFirst().orElseThrow();
        assertThatThrownBy(() -> service.save(USER, List.of(new CompanySetupSaveReq(second.companySetupId(), LocalDate.of(2025, 1, 1), null, "true", "true", "false", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("중복");

        assertThatThrownBy(() -> service.save(OTHER, List.of(new CompanySetupSaveReq(second.companySetupId(), LocalDate.of(2027, 5, 5), null, "true", "true", "false", null))))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.delete(OTHER, List.of(second.companySetupId()))).isInstanceOf(BusinessException.class);
    }
}
