package kr.co.kfs.asseterp.biz.biz;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiMonthRes;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiRes;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizFundPriceModiService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V32 기준가 정정내역 보고(Biz60_Tab_FundPriceModiReport) 목록·저장·삭제·월 상신을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(BizFundPriceModiService.class)
class BizFundPriceModiDbTest {

    private static final long EXISTING = 202609039862035L;

    @Autowired BizFundPriceModiService service;
    @Autowired kr.co.kfs.asseterp.biz.biz.mapper.BizFundPriceModiMapper mapper;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private static FundPriceModiSaveReq req(long id, String type, String fund, Double aft, Double cmps, Boolean ksd) {
        return new FundPriceModiSaveReq(id, type, "시험운용", fund, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 2), false,
                100.0, null, null, null, null, null, null, null,
                aft, null, null, null, null, null, null, null,
                "발견자", "경위", "사유", "대책", ksd, null, cmps);
    }

    @Test
    void 목록은_변경년월과_검색어로_읽는다() {
        List<FundPriceModiRes> all = service.search(user(), "2026.09", "");
        assertThat(all).extracting(FundPriceModiRes::fundPriceModiId).contains(EXISTING);
        FundPriceModiRes row = all.stream().filter(r -> r.fundPriceModiId() == EXISTING).findFirst().orElseThrow();
        assertThat(row.reportTypeName()).isNotBlank();
        assertThat(row.ksdNoticeYn()).isTrue();
        assertThat(service.search(user(), "2026.09", "없는펀드명zzz")).isEmpty();
        assertThat(service.search(user(), "2026.08", "")).isEmpty();
    }

    @Test
    void 새_행은_넣고_있는_행은_고친다() {
        long id = service.newId();
        FundPriceModiRes saved = service.save(user(), req(id, "1", "시험펀드", 110.0, 5000.0, true));
        assertThat(saved.fundName()).isEqualTo("시험펀드");
        assertThat(saved.ksdNoticeYn()).isTrue();
        assertThat(saved.kofiaNoticeYn()).isFalse(); // null → 'false'
        assertThat(saved.updName()).isEqualTo("시험");
        assertThat(jdbc.queryForObject("select biz60_ksd_notice_yn from biz60_fund_price_modi where biz60_fund_price_modi_id = ?", String.class, id)).isEqualTo("true");

        FundPriceModiRes again = service.save(user(), req(id, "2", "바뀐펀드", 120.0, null, false));
        assertThat(again.fundName()).isEqualTo("바뀐펀드");
        assertThat(again.reportType()).isEqualTo("2");
        assertThat(again.aftPrice()).isEqualTo(120.0);
        assertThat(again.cmpsAmt()).isNull();
        assertThat(jdbc.queryForObject("select count(*) from biz60_fund_price_modi where biz60_fund_price_modi_id = ?", Integer.class, id)).isEqualTo(1);
    }

    @Test
    void 필수값이_없으면_저장하지_않는다() {
        long id = service.newId();
        assertThrows(BusinessException.class, () -> service.save(user(), req(id, "", "펀드", null, null, false)));
        assertThrows(BusinessException.class, () -> service.save(user(), req(id, "1", " ", null, null, false)));
        assertThat(jdbc.queryForObject("select count(*) from biz60_fund_price_modi where biz60_fund_price_modi_id = ?", Integer.class, id)).isZero();
    }

    @Test
    void 결재문서_ID_기록과_삭제는_로그인_회사_행만() {
        long id = service.newId();
        service.save(user(), req(id, "1", "시험펀드", null, null, false));
        assertThat(service.updateApprId(user(), id, 77L)).isEqualTo(1);
        assertThat(service.search(user(), "2026.09", "시험펀드").get(0).apprId()).isEqualTo(77L);
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).name("x").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> service.updateApprId(other, id, 78L));
        assertThat(service.delete(other, List.of(id))).isZero();
        assertThat(service.delete(user(), List.of(id))).isEqualTo(1);
        assertThat(service.delete(user(), List.of())).isZero();
    }

    @Test
    void 월_통합_상신은_없으면_넣고_있으면_고친다() {
        String ym = "2099.01";
        assertThat(service.month(user(), ym)).isNull();
        service.saveMonth(user(), ym, 11L);
        FundPriceModiMonthRes m = service.month(user(), ym);
        assertThat(m).isNotNull();
        assertThat(m.apprId()).isEqualTo(11L);
        service.saveMonth(user(), ym, 12L);
        assertThat(service.month(user(), ym).apprId()).isEqualTo(12L);
        assertThat(jdbc.queryForObject("select count(*) from biz61_modi_rpt_relate_appr where biz61_company_id = 28000 and biz61_modi_ym = ?", Integer.class, ym)).isEqualTo(1);
        assertThrows(BusinessException.class, () -> service.saveMonth(user(), ym, null));
    }

    @Test
    void 상신하면_보고의_첨부파일을_결재문서에_연결한다() {
        long id = service.newId();
        service.save(user(), req(id, "1", "첨부펀드", null, null, false));
        long fileId = service.newId();
        jdbc.update("insert into sys10_file (sys10_file_id, sys10_parent_id, sys10_file_nm, sys10_reg_date, sys10_server_path) values (?, ?, 'v32.txt', now(), '/tmp/v32')", fileId, id);
        service.updateApprId(user(), id, 4242L);
        service.updateApprId(user(), id, 4242L); // 두 번 해도 한 번만 연결
        assertThat(jdbc.queryForObject("select count(*) from sys11_relate_file where sys11_file_id = ? and sys11_parent_id = 4242 and sys11_parent_table = 'apr01_appr'", Integer.class, fileId)).isEqualTo(1);
    }

    @Test
    void 월_상신_문서_자동등록은_고른_보고의_결재문서를_준다() {
        var rows = mapper.selectRelateApprs(28000L, List.of(EXISTING));
        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).targetApprId()).isEqualTo(jdbc.queryForObject("select biz60_appr_id from biz60_fund_price_modi where biz60_fund_price_modi_id = ?", Long.class, EXISTING));
        assertThat(rows.get(0).title()).isNotBlank();
        assertThat(mapper.selectRelateApprs(1L, List.of(EXISTING))).isEmpty();
    }
}
