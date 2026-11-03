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

import kr.co.kfs.asseterp.biz.biz.dto.*;
import kr.co.kfs.asseterp.biz.biz.service.BizErpFeeChargeService;

/** EE23 AssetERP 사용료청구(Biz55_Tab_ErpFeeCharge)를 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(BizErpFeeChargeService.class)
class BizErpFeeChargeDbTest {

    @Autowired BizErpFeeChargeService service;
    @Autowired JdbcTemplate jdbc;

    @Test
    void 목록은_청구년월과_검색어로_거른다() {
        LocalDate std = LocalDate.of(2026, 6, 1);
        int expected = jdbc.queryForObject("select count(*) from biz55_erp_fee_charge where biz55_charge_date >= '2026-06-01' and biz55_charge_date < '2026-07-01'", Integer.class);
        List<BizErpFeeChargeRes> rows = service.search(std, "");
        assertThat(rows).hasSize(expected);
        rows.forEach(r -> assertThat(r.fixYn()).isIn("true", "false"));
        assertThat(service.search(std, "없는계약사zzz")).isEmpty();
    }

    @Test
    void 생성_저장_확정_상신연결_삭제는_한_줄을_끝까지_돈다() {
        // 청구가 아직 없는 달 (그 달 사용료 설정이 있는 계약사가 후보)
        LocalDate std = LocalDate.of(2099, 1, 1);
        List<BizErpCompanyRes> cands = service.companies(LocalDate.now().withDayOfMonth(1), "");
        LocalDate useStd = LocalDate.now().withDayOfMonth(1);
        if (cands.isEmpty()) {
            cands = service.companies(std, "");
            useStd = std;
        }
        if (cands.isEmpty()) {
            return; // 후보가 없으면 만들 수 없다 (결과확인에 미확인으로 적는다)
        }
        BizErpCompanyRes corp = cands.get(0);
        String ym = String.format("%04d.%02d", useStd.getYear(), useStd.getMonthValue());
        int made = service.create(new BizErpFeeChargeCreateReq(ym, List.of(corp.erpContCorpId())));
        List<BizErpFeeChargeRes> rows = service.search(useStd, "").stream().filter(r -> r.erpContCorpId().equals(corp.erpContCorpId())).toList();
        assertThat(made).isEqualTo(1);   // 후보는 그 달 사용료 설정이 있는 계약사라 한 줄이 만들어진다
        assertThat(rows).hasSize(1);
        BizErpFeeChargeRes row = rows.get(0);
        assertThat(row.fixYn()).isEqualTo("false");
        assertThat(row.totalAmt()).isEqualTo(row.erpFee() + row.dataFee() + row.addSmsFee() + row.addServerFee() + row.addUserFee() + row.etcAmt());

        // 같은 값으로 저장 + 기타금액 반영
        BizErpFeeChargeRes saved = service.save(new BizErpFeeChargeSaveReq(row.erpFeeChargeId(), row.erpContCorpId(), row.corpNm(), row.chargeDate(),
                row.startDate(), row.closeDate(), row.erpFee(), row.dataFee(), row.smsCount(), row.addSmsFee(), row.serverUsage(), row.addServerFee(),
                row.userCount(), row.addUserFee(), 1000L, "시험", row.totalAmt(), row.totalVat(), row.chargeAmt()));
        assertThat(saved.etcAmt()).isEqualTo(1000L);
        assertThat(saved.etcDesc()).isEqualTo("시험");

        // 확정 → 확정취소
        service.confirm(new BizErpFeeChargeConfirmReq(List.of(row.erpFeeChargeId()), true));
        assertThat(service.search(useStd, "").stream().filter(r -> r.erpFeeChargeId().equals(row.erpFeeChargeId())).findFirst().get().fixYn()).isEqualTo("true");
        service.confirm(new BizErpFeeChargeConfirmReq(List.of(row.erpFeeChargeId()), false));

        // 결재문서 연결 (없는 문서 ID여도 열 갱신만 — 외래키 없음)
        assertThat(service.updateApprId(new BizErpFeeChargeApprReq(null, List.of(row.erpFeeChargeId())))).isEqualTo(1);

        assertThat(service.delete(List.of(row.erpFeeChargeId()))).isEqualTo(1);
        assertThat(service.search(useStd, "").stream().anyMatch(r -> r.erpFeeChargeId().equals(row.erpFeeChargeId()))).isFalse();
    }

    @Test
    void 편집창_기준값은_기존_행의_기간으로_읽는다() {
        List<BizErpFeeChargeRes> rows = service.search(LocalDate.of(2026, 6, 1), "");
        if (rows.isEmpty()) {
            return;
        }
        BizErpFeeChargeRes r = rows.get(0);
        BizErpFeeDefaultRes d = service.defaultData(r.erpContCorpId(), r.companyId(), r.startDate(), r.closeDate());
        if (d != null) {
            assertThat(d.vatCd()).isIn("1", "2");
            assertThat(d.addFeeSmsYn()).isNotNull();
        }
    }
}
