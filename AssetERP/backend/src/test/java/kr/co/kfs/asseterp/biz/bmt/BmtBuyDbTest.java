package kr.co.kfs.asseterp.biz.bmt;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizBuyPromoRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizBuyPromoSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizPromoService;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuyRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuySaveReq;
import kr.co.kfs.asseterp.biz.bmt.service.BmtBuyService;
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

/** L05(판촉물 구매 및 제공내역)의 구매 저장·삭제와 제공내역 저장(거래상대방 포함)을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({BmtBuyService.class, BizPromoService.class})
class BmtBuyDbTest {

    @Autowired BmtBuyService buyService;
    @Autowired BizPromoService promoService;
    @Autowired JdbcTemplate jdbc;

    /** 구매내역 3건(2022-01-03·2023-01-10·2023-02-07)이 있는 사원(kfstest 회사) */
    private final UserPrincipal owner = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();
    private final UserPrincipal otherCompany = UserPrincipal.builder().userId(29049L).companyId(1L).roles(List.of("ROLE_USER")).build();

    private static final LocalDate FROM = LocalDate.of(2022, 1, 1);
    private static final LocalDate TO = LocalDate.of(2023, 12, 31);

    @Test
    void 조회는_담당자나_등록자인_내역만_재고없음_제외는_재고가_0이_아닌_건만() {
        List<BmtBuyRes> all = buyService.search(owner, FROM, TO, false);
        assertThat(all).hasSize(3);
        assertThat(all).extracting(BmtBuyRes::buyDate).isSortedAccordingTo(java.util.Comparator.reverseOrder());
        assertThat(all.get(0).provideContentName()).isNotBlank();
        assertThat(buyService.search(otherCompany, FROM, TO, false)).isEmpty();
        assertThat(buyService.search(owner, FROM, TO, true)).allSatisfy(r -> assertThat(r.leftQty()).isNotZero());
    }

    @Test
    void 구매는_등록_수정_삭제_모두_로그인_회사만() {
        BmtBuySaveReq req = new BmtBuySaveReq(-1L, LocalDate.of(2023, 5, 5), "1003", 4L, 400000L, 29049L);
        BmtBuyRes created = buyService.save(owner, List.of(req)).get(0);
        assertThat(created.buyId()).isPositive();
        assertThat(created.buyQty()).isEqualTo(4L);
        assertThat(created.totalPeple()).isZero();
        assertThat(created.leftQty()).isEqualTo(4L);
        assertThat(created.apprId()).isNull();
        assertThat(jdbc.queryForMap("select bmt01_company_id c, bmt01_reg_emp_id r from bmt01_buy where bmt01_buy_id = ?", created.buyId()))
                .containsEntry("c", new java.math.BigDecimal(28000)).containsEntry("r", new java.math.BigDecimal(29049));

        BmtBuySaveReq changed = new BmtBuySaveReq(created.buyId(), LocalDate.of(2023, 5, 6), "1004", 5L, 500000L, 29049L);
        assertThatThrownBy(() -> buyService.save(otherCompany, List.of(changed))).isInstanceOf(BusinessException.class);
        BmtBuyRes saved = buyService.save(owner, List.of(changed)).get(0);
        assertThat(saved.buyAmt()).isEqualTo(500000L);
        assertThat(saved.provideContentCode()).isEqualTo("1004");

        assertThat(buyService.delete(otherCompany, List.of(created.buyId()))).isZero();
        assertThat(buyService.delete(owner, List.of(created.buyId()))).isEqualTo(1);
        assertThat(buyService.search(owner, FROM, TO.plusYears(1), false)).hasSize(3);
        assertThat(buyService.delete(owner, List.of())).isZero();
    }

    @Test
    void 제공내역은_구매ID로_읽고_저장은_거래상대방_행을_없으면_넣고_있으면_바꾼다() {
        Long buyId = 202301100935340L;
        List<BizBuyPromoRes> before = promoService.searchByBuyId(owner, buyId);
        assertThat(before).hasSize(1);
        assertThat(promoService.searchByBuyId(otherCompany, buyId)).isEmpty();

        // 새 행: 정산구분 2·제공/수령 1·등록자·회사는 서버 값, 사람 행(직원 아님)이 따라 생긴다
        BizBuyPromoSaveReq req = new BizBuyPromoSaveReq(-1L, buyId, LocalDate.of(2023, 1, 11), "1004", "10", 150000L, 29049L, "시험상사", "홍길동", "L05 시험");
        BizBuyPromoRes created = promoService.saveBuyPromos(owner, List.of(req)).get(0);
        assertThat(created.promoId()).isPositive();
        assertThat(created.targetCompanyName()).isEqualTo("시험상사");
        assertThat(created.targetEmpName()).isEqualTo("홍길동");
        assertThat(created.providePurName()).isNotBlank();
        assertThat(jdbc.queryForMap("select biz01_settle_type s, biz01_provide_rcv_type t, biz01_company_id c, biz01_reg_emp_id r, biz01_provide_amt a from biz01_promo where biz01_promo_id = ?", created.promoId()))
                .containsEntry("s", "2").containsEntry("t", "1").containsEntry("c", new java.math.BigDecimal(28000));
        assertThat(promoService.searchByBuyId(owner, buyId)).hasSize(2);

        // 고친 행: 제공일자·목적·비고만 바뀌고 거래상대방 이름은 있는 행을 바꾼다 (인원 수는 그대로 1)
        BizBuyPromoSaveReq changed = new BizBuyPromoSaveReq(created.promoId(), buyId, LocalDate.of(2023, 1, 12), null, "11", null, null, "바꾼상사", "김철수", "고침");
        assertThatThrownBy(() -> promoService.saveBuyPromos(otherCompany, List.of(changed))).isInstanceOf(BusinessException.class);
        BizBuyPromoRes saved = promoService.saveBuyPromos(owner, List.of(changed)).get(0);
        assertThat(saved.provideDate()).isEqualTo(LocalDate.of(2023, 1, 12));
        assertThat(saved.providePurCode()).isEqualTo("11");
        assertThat(saved.note()).isEqualTo("고침");
        assertThat(saved.targetCompanyName()).isEqualTo("바꾼상사");
        assertThat(saved.provideContentCode()).isEqualTo("1004");
        assertThat(jdbc.queryForObject("select count(*) from biz02_person where biz02_promo_id = ?", Integer.class, created.promoId())).isEqualTo(1);
    }
}
