package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.FltLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.LinkApprIdReq;
import kr.co.kfs.asseterp.biz.flt.service.FltAccountService;
import kr.co.kfs.asseterp.biz.flt.service.FltRealTrService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V30 A09 자기매매 실거래 보고·B05 계좌개설·B06 계좌폐쇄 결재창 제목·본문과 상신 문서 ID 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, FltLinkSeedProvider.class, FltRealTrService.class, FltAccountService.class})
class AprFltLinkSeedDbTest {

    /** 29049(전산1팀)의 2026-07 매매 두 건(SK하이닉스·1Q 미국배당TOP30), 계좌 둘(2022-01-01·2022-02-01, 신고사유 2), 폐쇄계좌 하나 */
    private static final List<Long> TRS = List.of(202608209832766L, 202608209829628L);
    private static final List<Long> ACCOUNTS = List.of(202204070100306L, 202204070100311L);
    private static final long CLOSE = 202602099474686L;
    private static final long FAKE_APPR = 202610319999001L;

    @Autowired AprLinkSeedService seedService;
    @Autowired FltRealTrService trService;
    @Autowired FltAccountService accountService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void A09_제목과_본문을_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), 1L, "A09", null, Map.of(
                "ids", TRS.get(0) + "," + TRS.get(1), "closeDate", "2026-07-31", "periodString", "7월"));
        assertThat(res.title()).startsWith("개인별 매매 및 보유내역 신고서(2026년 7월) / 시험 ");
        assertThat(res.effectDate()).isEqualTo(LocalDate.of(2026, 7, 31));
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).startsWith("<table border=2").endsWith("</tbody></table>")
                .contains("개인별 매매 및 보유내역 신고서 (2026년 7월)")
                .contains("SK하이닉스").contains("1Q 미국배당TOP30")
                // 거래일 순(07-08이 07-16보다 앞)
                .containsSubsequence("1Q 미국배당TOP30", "SK하이닉스")
                .contains("2영업일(승인일 포함)이내")  // 2025-01-01 기준(승인 유효일수 2)
                .contains("본인은 배우자 및 미성년 자녀 명의의 계좌가 없음 ( )")  // 29049는 가족계좌(배우자)가 있다
                .contains("본인은 해당기간 동안 거래내역이 없음 ( )");
    }

    @Test
    void A09_매매내역_없이도_열린다() {
        AprLinkSeedRes res = seedService.seed(user(), 1L, "A09", null, Map.of("closeDate", "2026-07-31", "periodString", "7월"));
        assertThat(res.content()).contains("본인은 해당기간 동안 거래내역이 없음 (O)").contains("본인은 배우자 및 미성년 자녀는 해당기간 동안 거래내역이 없음 (O)");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A09", null, Map.of("periodString", "7월")));
        // 가족계좌가 없는 사원(29055)은 "계좌가 없음 (O)"
        UserPrincipal noFamily = UserPrincipal.builder().userId(29055L).companyId(28000L).name("시험3").roles(List.of("ROLE_USER")).build();
        assertThat(seedService.seed(noFamily, 1L, "A09", null, Map.of("closeDate", "2026-07-31", "periodString", "7월")).content())
                .contains("본인은 배우자 및 미성년 자녀 명의의 계좌가 없음 (O)");
    }

    @Test
    void A09_남의_매매내역은_읽지_못한다() {
        UserPrincipal other = UserPrincipal.builder().userId(29035L).companyId(28000L).name("시험2").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> seedService.seed(other, 1L, "A09", null, Map.of(
                "ids", String.valueOf(TRS.get(0)), "closeDate", "2026-07-31", "periodString", "7월")));
    }

    @Test
    void B05_계좌개설_본문을_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), 1L, "B05", null, Map.of("ids", ACCOUNTS.get(0) + "," + ACCOUNTS.get(1), "checkCycle", "2"));
        assertThat(res.title()).startsWith("금융투자상품 계좌개설 신고서 / 시험 ");
        assertThat(res.content()).contains("자기매매 계좌 및 보유내역 신고서")
                .contains("월별 점검대상자 (O)<br>분기별 점검대상자 ( )")
                .contains("신규 입사 ( )<br>계좌 개설 (O)")  // 신고사유 2
                .contains("2. 신고일자 (입사일, 계좌 개설일) : &nbsp;2022년 01월 01일&nbsp;")
                .contains("3. 자기매매 계좌 및 보유내역").contains("KB증권").contains("코람코라이프인프라리츠").contains("&nbsp;5&nbsp;")  // AS-IS flt13_book_init.getInfo = 2행
                .endsWith("</tbody></table>");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "B05", null, Map.of("ids", String.valueOf(ACCOUNTS.get(0)))));
    }

    @Test
    void B06_계좌폐쇄_본문을_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), 1L, "B06", null, Map.of("ids", String.valueOf(CLOSE)));
        assertThat(res.title()).startsWith("임직원자기매매 계좌폐쇄 신고서 / 시험 ");
        assertThat(res.content()).contains("임직원자기매매 계좌폐쇄 신고서").contains("다음과 같이 계좌 폐쇄를 신고합니다.")
                .contains("&nbsp;2026-01-01&nbsp;").contains("width:20%").endsWith("</tbody></table>");  // colspan 4 × 5%
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "B06", null, Map.of("ids", "-1")));
    }

    @Test
    void 상신_문서_ID를_기록한다() {
        // A09 — 매매내역 + 정기보고 연결(flt14)
        int n = trService.updateApprId(user(), new LinkApprIdReq(FAKE_APPR, TRS, "2026-07-31", "2"));
        assertThat(n).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from flt10_tr where flt10_appr_id = ?", Integer.class, FAKE_APPR)).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from flt14_relate_appr where flt14_appr_id = ? and flt14_person_id = 29049 and flt14_std_date = date '2026-07-31' and flt14_check_cycle = '2'",
                Integer.class, FAKE_APPR)).isEqualTo(1);
        // 매매내역 없이 상신 — 연결만 남는다
        assertThat(trService.updateApprId(user(), new LinkApprIdReq(FAKE_APPR + 1, List.of(), "2026-07-31", "2"))).isZero();
        assertThat(jdbc.queryForObject("select count(*) from flt14_relate_appr where flt14_appr_id = ?", Integer.class, FAKE_APPR + 1)).isEqualTo(1);
        // B05 / B06
        assertThat(accountService.updateAccountApprId(user(), new LinkApprIdReq(FAKE_APPR, ACCOUNTS, null, null))).isEqualTo(2);
        assertThat(accountService.updateCloseApprId(user(), new LinkApprIdReq(FAKE_APPR, List.of(CLOSE), null, null))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from flt06_account_close where flt06_appr_id = ?", Integer.class, FAKE_APPR)).isEqualTo(1);
    }

    @Test
    void 남의_행에는_문서_ID를_기록하지_못한다() {
        UserPrincipal other = UserPrincipal.builder().userId(29035L).companyId(28000L).name("시험2").roles(List.of("ROLE_USER")).build();
        assertThat(trService.updateApprId(other, new LinkApprIdReq(FAKE_APPR, TRS, "2026-07-31", "2"))).isZero();
        assertThat(accountService.updateAccountApprId(other, new LinkApprIdReq(FAKE_APPR, ACCOUNTS, null, null))).isZero();
        assertThat(accountService.updateCloseApprId(other, new LinkApprIdReq(FAKE_APPR, List.of(CLOSE), null, null))).isZero();
        assertThrows(BusinessException.class, () -> accountService.updateAccountApprId(user(), new LinkApprIdReq(null, ACCOUNTS, null, null)));
    }
}
