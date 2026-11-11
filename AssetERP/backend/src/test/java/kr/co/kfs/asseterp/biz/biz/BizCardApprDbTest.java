package kr.co.kfs.asseterp.biz.biz;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoPrintReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPromoMapper;
import kr.co.kfs.asseterp.biz.biz.service.BizPromoService;

/**
 * #1131 이익제공 입력(법인카드) 원본 2026-11-04~06 변경 (CH-0005·0010·0011·0057·0111): 행마다 상신 상태, [미상신건만 조회]·계정과목 조건,
 * 거래상대방 필수입력 검사, 고른 내역에 상신 문서 ID, 출력 자료의 계정과목. asseterpdb에서 돌리고 롤백한다.
 * 조건 없는 건수(22)·계정과목별(21·1)·계정과목 콤보(2)는 AS-IS SQL과 yunhee mapper-run --compare로 같음을 확인했다(2026-11-11)
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(BizPromoService.class)
class BizCardApprDbTest {

    @Autowired BizPromoService service;
    @Autowired BizPromoMapper mapper;
    @Autowired JdbcTemplate jdbc;

    /** 법인카드 내역이 22건 있는 사원(kfstest 회사) — BizPromoDbTest와 같은 사원 */
    private final UserPrincipal user = UserPrincipal.builder().userId(202306221546363L).companyId(28000L).roles(List.of("ROLE_USER")).build();
    private static final LocalDate FROM = LocalDate.of(2024, 1, 1);
    private static final LocalDate TO = LocalDate.of(2025, 12, 31);
    /** 회사 28000의 결재중(20) 문서 */
    private static final long APPR_20 = 202601059251623L;

    private List<BizPromoCardRes> search(boolean apprCheck, Long accountId) {
        return service.searchByCard(user, FROM, TO, "", apprCheck, accountId);
    }

    @Test
    void 상신하면_행에_상태가_보이고_미상신건만_조회에서_빠진다() {
        List<BizPromoCardRes> all = search(false, null);
        assertThat(all).hasSize(22);
        Long id = all.get(0).promoId();

        assertThat(mapper.updateApprId(1L, APPR_20, List.of(id))).isZero();   // 다른 회사로는 못 바꾼다
        assertThat(mapper.updateApprId(28000L, APPR_20, List.of(id))).isEqualTo(1);

        BizPromoCardRes row = search(false, null).stream().filter(r -> r.promoId().equals(id)).findFirst().orElseThrow();
        assertThat(row.apprId()).isEqualTo(APPR_20);
        assertThat(row.apprStatusCode()).isEqualTo("20");
        assertThat(row.apprStatusName()).isNotBlank();
        assertThat(search(true, null)).hasSize(21).noneMatch(r -> r.promoId().equals(id));
    }

    @Test
    void 계정과목_콤보와_조건() {
        assertThat(service.searchCardAccountNames(user, FROM, TO)).extracting(o -> o.code()).containsExactlyInAnyOrder("80694", "81456");
        assertThat(search(false, 81456L)).hasSize(21);
        assertThat(search(false, 80694L)).hasSize(1);
    }

    @Test
    void 거래상대방_필수입력인데_거래상대방이_없으면_센다() {
        List<Long> ids = search(false, null).stream().map(BizPromoCardRes::promoId).toList();
        Long noTarget = jdbc.queryForObject("""
                select a.biz01_promo_id from biz01_promo a
                 where a.biz01_promo_id = any(?) and a.biz01_provide_rcv_type = '1'
                   and not exists (select 1 from biz02_person p where p.biz02_promo_id = a.biz01_promo_id and coalesce(p.biz02_emp_yn,'false') = 'false')
                 order by 1 limit 1""", Long.class, (Object) ids.toArray(Long[]::new));
        // #1130에서 사용자가 바꿀 수 있는 값이라 시험이 두 상태를 직접 만든다
        jdbc.update("update biz90_limit set biz90_target_info_req_yn = 'false' where biz90_company_id = 28000 and biz90_provide_rcv_type = '1'");
        assertThat(service.countTargetInfoMissing(user, List.of(noTarget))).isZero();   // 필수 아님

        jdbc.update("update biz90_limit set biz90_target_info_req_yn = 'true' where biz90_company_id = 28000 and biz90_provide_rcv_type = '1'");
        // 같은 인자면 MyBatis 1차 캐시가 앞의 0을 돌려주므로(같은 트랜잭션) 목록 모양을 바꿔 다시 읽는다 — 같은 행이라 1건
        assertThat(service.countTargetInfoMissing(user, List.of(noTarget, noTarget))).isEqualTo(1);
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).roles(List.of("ROLE_USER")).build();
        assertThat(service.countTargetInfoMissing(other, List.of(noTarget))).isZero();
    }

    @Test
    void 출력_자료에_계정과목이_들어간다() {
        String g = service.insertRdCard(user, new BizPromoPrintReq(FROM, TO, "", false));
        assertThat(jdbc.queryForObject("select count(*) from sys99_print where sys99_group_id = ?::numeric and coalesce(sys99_string08,'') <> ''", Integer.class, g)).isEqualTo(22);
    }
}
