package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.dto.IcsWriterLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprIcsWriterLinkMapper;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.IcsLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V28 A52 임직원 내부통제 준수확인서(부서장) 결재창 제목·본문을 asseterpdb에서 읽는다(읽기만, 03 원칙 2). 확인자·달은 DB에서 고른다(2026-11-13 DB 복원 뒤) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, IcsLinkSeedProvider.class})
class AprIcsWriterLinkDbTest {

    /** 첫 번째 시험에서 고른 확인자(부서장) — 표머리 시험에도 쓴다 */
    private static final long CONFIRMER = 202204180108329L;

    @Autowired AprLinkSeedService seedService;
    @Autowired AprIcsWriterLinkMapper writerMapper;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user(long id, String name) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name(name).roles(List.of("ROLE_USER")).build();
    }

    private static UserPrincipal user() {
        return user(CONFIRMER, "박재민");
    }

    @Test
    void A52는_제목에_조직명과_사원명_본문에_소속_임직원_준수여부를_넣는다() {
        // DB에서 월간 점검을 확정한 확인자·달을 고른다(확정 사원이 한 명 이상 나오는 첫 조합 — 자료는 DB 사본마다 다르다)
        List<Map<String, Object>> picks = jdbc.queryForList("""
                select ics31_confirmer_id as id, ics31_yyyymm as ym, emp01_kor_nm as nm
                  from ics31_compliance_write join emp01_person on emp01_person_id = ics31_confirmer_id
                 where ics31_company_id = 28000 and ics31_cycle_type = 'M' and coalesce(ics31_fix_yn,'false') = 'true'
                 group by 1, 2, 3 order by 2 desc""");
        for (Map<String, Object> p : picks) {
            long id = ((Number) p.get("id")).longValue();
            String ym = (String) p.get("ym");
            LocalDate std = YearMonth.parse(ym.replace('.', '-')).atEndOfMonth();
            List<IcsWriterLinkRow> rows = writerMapper.selectWriterList(28000L, id, "M", std);
            if (rows.isEmpty()) continue;
            String yyyy = ym.substring(0, 4), mm = ym.substring(5) + "월";
            String name = (String) p.get("nm");
            AprLinkSeedRes res = seedService.seed(user(id, name), 1L, "A52", null,
                    Map.of("stdDate", std.toString(), "cycleType", "M", "yyyy", yyyy, "mm", mm, "cycleName", mm));
            assertThat(res.title()).startsWith(yyyy + "년 " + mm + "_임직원 내부통제 준수확인서 - ").endsWith(" " + name);
            assertThat(res.titleReadOnly()).isFalse();
            assertThat(res.saveVisible()).isFalse();
            assertThat(res.content()).contains("다음과 같이 임직원 내부통제 준수내역을 보고합니다.").contains("- 다 음 -")
                    .contains("준수여부").endsWith("</tbody></table>");
            for (IcsWriterLinkRow r : rows) {
                assertThat(res.content()).contains(r.personName());
            }
            // 머리 4 + 제목줄 1 + 확정 사원 수
            assertThat(res.content().split("<tr>", -1).length - 1).isEqualTo(4 + 1 + rows.size());
            return;
        }
        throw new IllegalStateException("확정된 월간 준수확인 자료가 DB에 없다");
    }

    @Test
    void A52_확정한_사원이_없으면_표머리만_나오고_빠진_인자는_열_수_없다() {
        AprLinkSeedRes none = seedService.seed(user(), 1L, "A52", null, Map.of("stdDate", "1999-01-31", "cycleType", "M", "yyyy", "1999", "mm", "01월", "cycleName", "01월"));
        assertThat(none.content().split("<tr>", -1).length - 1).isEqualTo(5);
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A52", null, Map.of("stdDate", "2026-08-31", "cycleType", "M")));
    }
}
