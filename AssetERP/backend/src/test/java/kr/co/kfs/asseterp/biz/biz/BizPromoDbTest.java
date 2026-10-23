package kr.co.kfs.asseterp.biz.biz;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoAccountReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoUpdateReq;
import kr.co.kfs.asseterp.biz.biz.service.BizPersonService;
import kr.co.kfs.asseterp.biz.biz.service.BizPromoService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** L02(이익제공 입력 법인카드)의 저장·출력 자료 만들기·직원 등록을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({BizPromoService.class, BizPersonService.class})
class BizPromoDbTest {

    @Autowired BizPromoService promoService;
    @Autowired BizPersonService personService;
    @Autowired JdbcTemplate jdbc;

    /** 법인카드 내역이 22건 있는 사원(kfstest 회사) */
    private final UserPrincipal user = UserPrincipal.builder().userId(202306221546363L).companyId(28000L).roles(List.of("ROLE_USER")).build();
    private final UserPrincipal otherCompany = UserPrincipal.builder().userId(202306221546363L).companyId(1L).roles(List.of("ROLE_USER")).build();

    private static final LocalDate FROM = LocalDate.of(2024, 1, 1);
    private static final LocalDate TO = LocalDate.of(2025, 12, 31);

    private BizPromoCardRes first() {
        List<BizPromoCardRes> list = promoService.searchByCard(user, FROM, TO, "");
        assertThat(list).isNotEmpty();
        return list.get(0);
    }

    /** 같은 일자 행의 순서는 정해져 있지 않으므로 고친 행은 ID로 다시 찾는다 */
    private BizPromoCardRes byId(Long promoId) {
        return promoService.searchByCard(user, FROM, TO, "").stream().filter(r -> r.promoId().equals(promoId)).findFirst().orElseThrow();
    }

    @Test
    void 조회는_로그인_사원의_카드내역만_검색어는_부분일치() {
        List<BizPromoCardRes> all = promoService.searchByCard(user, FROM, TO, "");
        assertThat(all).hasSize(22);
        assertThat(promoService.searchByCard(otherCompany, FROM, TO, "")).isEmpty();
        String franchise = all.get(0).franchiseName();
        assertThat(promoService.searchByCard(user, FROM, TO, franchise)).isNotEmpty().allSatisfy(r ->
                assertThat((r.htmlCardName() + r.franchiseName() + r.sectorName() + r.note()).toLowerCase()).contains(franchise.toLowerCase()));
    }

    @Test
    void 출력자료는_내_이전_자료를_지우고_조회_결과_행수만큼_새_그룹으로_담는다() {
        int rows = promoService.searchByCard(user, FROM, TO, "").size();
        String g1 = promoService.insertRdCard(user, new BizPromoPrintReq(FROM, TO, ""));
        assertThat(jdbc.queryForObject("select count(*) from sys99_print where sys99_company_id = 28000 and sys99_person_id = ? and sys99_window_class_nm = 'Biz01_Tab_Card'",
                Integer.class, user.getUserId())).isEqualTo(rows);
        assertThat(jdbc.queryForObject("select count(distinct sys99_group_id) from sys99_print where sys99_person_id = ? and sys99_window_class_nm = 'Biz01_Tab_Card'",
                Integer.class, user.getUserId())).isEqualTo(1);
        String g2 = promoService.insertRdCard(user, new BizPromoPrintReq(FROM, TO, ""));
        assertThat(g2).isNotEqualTo(g1);
        assertThat(jdbc.queryForObject("select count(*) from sys99_print where sys99_person_id = ? and sys99_window_class_nm = 'Biz01_Tab_Card' and sys99_group_id = ?",
                Integer.class, user.getUserId(), Long.valueOf(g1))).isZero();
        // 문자 열은 null 대신 빈 글자, 숫자 열은 0 (checkNull·checkLongNull)
        assertThat(jdbc.queryForObject("select count(*) from sys99_print where sys99_group_id = ? and (sys99_string02 is null or sys99_string07 is null or sys99_long01 is null or sys99_long02 is null or sys99_long03 is null)",
                Integer.class, Long.valueOf(g2))).isZero();
    }

    @Test
    void 편집저장은_4열만_바꾸고_다른_회사는_0건_마감이면_비고만() {
        BizPromoCardRes row = first();
        BizPromoUpdateReq same = new BizPromoUpdateReq(row.providePurCode(), row.provideContentCode(), row.accountCodeId(), "L02 시험");
        assertThat(promoService.update(otherCompany, row.promoId(), same)).isZero();
        assertThat(promoService.update(user, row.promoId(), same)).isEqualTo(1);
        assertThat(byId(row.promoId()).note()).isEqualTo("L02 시험");
        assertThat(promoService.updateNote(user, row.promoId(), "비고만")).isEqualTo(1);
        assertThat(byId(row.promoId()).note()).isEqualTo("비고만");
        assertThat(byId(row.promoId()).providePurCode()).isEqualTo(row.providePurCode());

        jdbc.update("update biz01_promo set biz01_close_yn = 'true' where biz01_promo_id = ?", row.promoId());
        assertThat(promoService.hasClosed(user, List.of(row.promoId()))).isTrue();
        assertThat(promoService.hasClosed(otherCompany, List.of(row.promoId()))).isFalse();
        // JdbcTemplate으로 바꾼 값은 MyBatis 1차 캐시를 비우지 못하므로 조건을 달리해 다시 읽는다
        assertThat(promoService.searchByCard(user, FROM, TO.minusDays(1), "").stream().filter(r -> r.promoId().equals(row.promoId())).findFirst().orElseThrow().closeName()).isEqualTo("마감");
    }

    @Test
    void 일괄저장은_고른_내역마다_과세구분은_withTax일_때만() {
        BizPromoCardRes row = first();
        String tax = jdbc.queryForObject("select biz01_tax_type from biz01_promo where biz01_promo_id = ?", String.class, row.promoId());
        int n = promoService.updateAccount(user, new BizPromoAccountReq(List.of(row.promoId()), row.providePurCode(), row.provideContentCode(), row.accountCodeId(), "9", "일괄", false));
        assertThat(n).isEqualTo(1);
        assertThat(jdbc.queryForObject("select biz01_tax_type from biz01_promo where biz01_promo_id = ?", String.class, row.promoId())).isEqualTo(tax);
        promoService.updateAccount(user, new BizPromoAccountReq(List.of(row.promoId()), row.providePurCode(), row.provideContentCode(), row.accountCodeId(), "2", "일괄", true));
        assertThat(jdbc.queryForObject("select biz01_tax_type from biz01_promo where biz01_promo_id = ?", String.class, row.promoId())).isEqualTo("2");
    }

    @Test
    void 직원은_등록_자동등록_삭제_모두_로그인_회사_내역만() {
        BizPromoCardRes row = first();
        Long promoId = row.promoId();
        int before = personService.searchInternal(user, promoId).size();
        assertThat(personService.addEmps(otherCompany, promoId, List.of(29039L))).isZero();
        assertThat(personService.addEmps(user, promoId, List.of(29039L))).isEqualTo(1);
        assertThat(personService.searchInternal(user, promoId)).hasSize(before + 1);
        assertThat(personService.searchInternal(otherCompany, promoId)).isEmpty();

        // 자동등록: 로그인 사원이 없으면 한 번 넣고, 다시 하면 넣지 않는다
        boolean already = personService.searchInternal(user, promoId).stream().anyMatch(p -> user.getUserId().equals(p.empId()));
        assertThat(personService.autoRegister(otherCompany, List.of(promoId))).isZero();
        assertThat(personService.autoRegister(user, List.of(promoId))).isEqualTo(already ? 0 : 1);
        assertThat(personService.autoRegister(user, List.of(promoId))).isZero();
        Long personId = personService.searchInternal(user, promoId).get(0).personId();
        assertThat(personService.delete(otherCompany, List.of(personId))).isZero();
        assertThat(personService.delete(user, List.of(personId))).isEqualTo(1);
    }
}
