package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusCount;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistStatusMapper;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistStatusService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** K07 내부통제내역 현황(Ics15_Tab_ChecklistStatus)의 월별 현황·상세 조회창을 asseterpdb에서 실제로 돌린다(읽기만) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsChecklistStatusService.class)
class IcsChecklistStatusDbTest {

    @Autowired IcsChecklistStatusService service;
    @Autowired IcsChecklistStatusMapper mapper;

    /** 회사 28000 — 2026-09 월 주기 확인 대상이 9건(K06 DB 테스트) */
    private static final UserPrincipal USER = UserPrincipal.builder().userId(29033L).companyId(28000L).build();

    @Test
    void 월별_현황은_기준월_이후를_하이픈으로_준다() {
        List<IcsChecklistStatusRes> rows = service.summary(USER, "2026", "M", null, null, "");
        assertThat(rows).isNotEmpty();
        assertThat(rows).allSatisfy(r -> assertThat(r.months()).hasSize(12));
        LocalDate preMonth = mapper.selectPreMonthLastDay(LocalDate.now());
        int stdMonth = preMonth.getYear() == 2026 ? preMonth.getMonthValue() : (preMonth.getYear() > 2026 ? 12 : 0);
        for (IcsChecklistStatusRes r : rows) {
            for (int m = 1; m <= 12; m++) {
                String cell = r.months().get(m - 1);
                if (m > stdMonth) assertThat(cell).isEqualTo("-");
                else assertThat(cell).matches("[OX] / [OX]");
            }
        }
    }

    @Test
    void 월_칸은_그_달_말일의_미체크_미확인_건수와_맞는다() {
        LocalDate day = LocalDate.of(2026, 9, 30);
        List<IcsChecklistStatusCount> counts = mapper.selectCounts(USER.getCompanyId(), "M", day, null, null, "%%");
        assertThat(counts).isNotEmpty();
        IcsChecklistStatusRes row = service.summary(USER, "2026", "M", null, null, "").stream()
                .filter(r -> r.checklistId().equals(counts.get(0).checklistId())).findFirst().orElseThrow();
        long unCheck = counts.stream().filter(c -> c.checklistId().equals(row.checklistId()) && c.checkLClassName().equals(row.checkLClassName())
                && c.checkMClassName().equals(row.checkMClassName())).mapToLong(IcsChecklistStatusCount::unCheckCnt).sum();
        long unConfirm = counts.stream().filter(c -> c.checklistId().equals(row.checklistId()) && c.checkLClassName().equals(row.checkLClassName())
                && c.checkMClassName().equals(row.checkMClassName())).mapToLong(IcsChecklistStatusCount::unConfirmCnt).sum();
        assertThat(row.months().get(8)).isEqualTo((unCheck == 0 ? "O" : "X") + " / " + (unConfirm == 0 ? "O" : "X"));
    }

    @Test
    void 대분류_조건과_검색어가_걸린다() {
        List<IcsChecklistStatusRes> all = service.summary(USER, "2026", "M", null, null, "");
        List<IcsChecklistStatusRes> none = service.summary(USER, "2026", "M", null, null, "존재하지않는검색어zzz");
        assertThat(none).isEmpty();
        assertThat(service.summary(USER, "2026", "M", -1L, null, "")).isEmpty();
        assertThat(all.size()).isPositive();
    }

    @Test
    void 상세_조회창은_체크리스트의_담당자별_내역을_준다() {
        LocalDate day = LocalDate.of(2026, 9, 30);
        Long checklistId = service.summary(USER, "2026", "M", null, null, "").get(0).checklistId();
        List<IcsChecklistStatusDetailRes> rows = service.byChecklist(USER, day, "M", checklistId, false, false);
        assertThat(rows).isNotEmpty().allSatisfy(r -> assertThat(r.checklistId()).isEqualTo(checklistId));
        List<IcsChecklistStatusDetailRes> unCheck = service.byChecklist(USER, day, "M", checklistId, true, false);
        assertThat(unCheck).allSatisfy(r -> assertThat(r.fixYn()).isFalse());
        List<IcsChecklistStatusDetailRes> unConfirm = service.byChecklist(USER, day, "M", checklistId, false, true);
        assertThat(unConfirm).allSatisfy(r -> assertThat(r.confirmYn()).isFalse());
    }

    /** K08 내부통제내역 상세 — 확인자 조건 없이 회사 전체를 페이징으로 준다 */
    @Test
    void K08_상세_목록은_전체_건수와_페이지를_준다() {
        LocalDate day = LocalDate.of(2026, 9, 30);
        PageRes<IcsChecklistStatusDetailRes> all = service.search(USER, day, "M", null, null, "", false, false, 0, 100);
        assertThat(all.total()).isPositive();
        assertThat(all.rows()).hasSize((int) Math.min(all.total(), 100));
        PageRes<IcsChecklistStatusDetailRes> page2 = service.search(USER, day, "M", null, null, "", false, false, 1, 1);
        assertThat(page2.total()).isEqualTo(all.total());
        assertThat(page2.rows()).hasSize(1);
        assertThat(page2.rows().get(0).personId()).isEqualTo(all.rows().get(1).personId());
        assertThat(service.search(USER, day, "M", null, null, "존재하지않는검색어zzz", false, false, 0, 100).total()).isZero();
    }

    @Test
    void K08_미제출_미확인_조건이_걸린다() {
        LocalDate day = LocalDate.of(2026, 9, 30);
        PageRes<IcsChecklistStatusDetailRes> un = service.search(USER, day, "M", null, null, "", true, false, 0, 1000);
        assertThat(un.rows()).allSatisfy(r -> assertThat(r.fixYn()).isFalse());
        PageRes<IcsChecklistStatusDetailRes> unConfirm = service.search(USER, day, "M", null, null, "", false, true, 0, 1000);
        assertThat(unConfirm.rows()).allSatisfy(r -> assertThat(r.confirmYn()).isFalse());
    }

    @Test
    void K08_엑셀은_전체_행을_쓴다() {
        assertThat(service.download(USER, LocalDate.of(2026, 9, 30), "M", null, null, "", false, false)).isNotEmpty();
    }
}
