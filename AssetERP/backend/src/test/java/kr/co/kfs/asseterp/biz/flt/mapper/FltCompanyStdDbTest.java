package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupItemRes;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdLockupReq;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdRes;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltBuyLockupService;
import kr.co.kfs.asseterp.biz.flt.service.FltCompanyStdService;
import kr.co.kfs.asseterp.biz.flt.service.FltItemTypeService;
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
 * J09 기준관리(Flt01_Tab_CompanyStd)와 조회창(매수제한종목·종목유형설정)을 asseterpdb에서 돌린다. 회사 28000.
 * 쓰기는 테스트 트랜잭션이라 롤백된다(03 원칙 2)
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FltCompanyStdService.class, FltBuyLockupService.class, FltItemTypeService.class})
class FltCompanyStdDbTest {

    @Autowired FltCompanyStdService stdService;
    @Autowired FltBuyLockupService lockupService;
    @Autowired FltItemTypeService itemTypeService;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    @Test
    void 기준관리는_회사_행이_적용시작일_내림차순으로_읽히고_등록_수정_삭제가_된다() {
        List<CompanyStdRes> rows = stdService.search(user);
        assertThat(rows).hasSize(4);  // AS-IS flt01_company_std.selectByCompanyId 4행
        assertThat(rows.get(0).startDate()).isEqualTo("2025-01-01");
        assertThat(rows).allMatch(r -> r.lockUpDetailName() != null && r.investAmtCalcTargetName() != null && r.stdDateTypeName() != null);
        // 보유기간 체크는 "보유기간 (…)", 매수 주문건수 체크는 "매수주문횟수 …" (2022-01-01 행)
        assertThat(rows.get(2).lockUpDetailName()).startsWith("매수주문횟수 ").endsWith(" 초과 체크");

        // 등록(복사): 첫 행을 복사해 새 행(임시 ID -1)으로 저장
        CompanyStdRes src = rows.get(0);
        CompanyStdSaveReq copy = new CompanyStdSaveReq(-1L, "2026-10-21", src.totalInvestAmt(), src.investAmtCalcTargetCode(),
                src.investAmtOverCheckYn(), src.investLimitUnvisibleYn(), src.turnoverRate(), src.apprOverRate(), src.apprQtyOverRate(),
                src.apprValidDays(), src.stdDateType(), src.fundHoldStkYn(), src.rptStartDate(), src.trFileEvidYn(), src.noAccountSkipYn(),
                src.lockUpCode(), src.lockUpDays(), src.lockUpCalcStdCode(), src.buyOprDayYn(), src.buyOprMonthYn());
        CompanyStdRes created = stdService.update(user, List.of(copy)).get(0);
        assertThat(created.companyStdId()).isPositive().isNotEqualTo(src.companyStdId());
        assertThat(created.startDate()).isEqualTo("2026-10-21");
        assertThat(created.lockUpDetailName()).isEqualTo(src.lockUpDetailName());
        assertThat(stdService.search(user)).hasSize(5);

        // 수정: 그리드 열만 바뀌고 의무보유기간 열은 그대로
        CompanyStdSaveReq edit = new CompanyStdSaveReq(created.companyStdId(), "2026-10-22", 123456L, "2", "true", "true", 7L, 8L, 9L, 10L, "2",
                "true", "2026-10-01", "true", "true", null, null, null, null, null);
        CompanyStdRes edited = stdService.update(user, List.of(edit)).get(0);
        assertThat(edited.startDate()).isEqualTo("2026-10-22");
        assertThat(edited.totalInvestAmt()).isEqualTo(123456L);
        assertThat(edited.investAmtCalcTargetName()).isEqualTo("입출금액");
        assertThat(edited.noAccountSkipYn()).isEqualTo("true");
        assertThat(edited.rptStartDate()).isEqualTo("2026-10-01");
        assertThat(edited.lockUpCode()).isEqualTo(src.lockUpCode());

        assertThat(stdService.delete(user, List.of(created.companyStdId()))).isEqualTo(1);
        assertThat(stdService.search(user)).hasSize(4);
    }

    @Test
    void 의무보유기간_체크방식은_검사를_거쳐_그_행만_바뀐다() {
        CompanyStdRes first = stdService.search(user).get(0);
        assertThatThrownBy(() -> stdService.updateLockup(user, first.companyStdId(), new CompanyStdLockupReq("1", null, "D", "false", "false")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("의무보유기간을 입력하세요");
        assertThatThrownBy(() -> stdService.updateLockup(user, first.companyStdId(), new CompanyStdLockupReq("2", null, "D", "false", "false")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("한 개 이상 반드시 체크");

        CompanyStdRes saved = stdService.updateLockup(user, first.companyStdId(), new CompanyStdLockupReq("2", 30L, "D", "true", "false"));
        assertThat(saved.lockUpCode()).isEqualTo("2");
        assertThat(saved.lockUpDetailName()).isEqualTo("매수주문횟수 일간 3회 초과 체크");
        saved = stdService.updateLockup(user, first.companyStdId(), new CompanyStdLockupReq("1", 30L, "M", "false", "false"));
        assertThat(saved.lockUpDetailName()).contains("30").endsWith(")");
    }

    @Test
    void 매수제한종목은_제한구분과_검색어로_읽히고_등록_수정_삭제가_된다() {
        assertThat(lockupService.search(user, "%", null)).hasSize(8);  // AS-IS flt08_buy_lockup.selectByText 8행
        assertThat(lockupService.search(user, "2", null)).hasSize(5);
        assertThat(lockupService.search(user, "%", "kr7010950004")).hasSize(1).allMatch(r -> r.itemName() != null && r.lockupTypeName() != null);

        BuyLockupItemRes created = lockupService.update(user, List.of(new BuyLockupSaveReq(-1L, "123456789012", "2026-10-21", null, "2"))).get(0);
        assertThat(created.buyLockupId()).isPositive();
        assertThat(created.itemName()).isEqualTo("우양1");
        assertThat(created.closeDate()).isNull();
        BuyLockupItemRes edited = lockupService.update(user, List.of(new BuyLockupSaveReq(created.buyLockupId(), "123456789013", "2026-10-22", "2026-12-31", "1"))).get(0);
        assertThat(edited.itemName()).isEqualTo("우양2");
        assertThat(edited.closeDate()).isEqualTo("2026-12-31");
        assertThat(lockupService.search(user, "%", null)).hasSize(9);
        assertThat(lockupService.delete(user, List.of(created.buyLockupId()))).isEqualTo(1);
        assertThat(lockupService.search(user, "%", null)).hasSize(8);
    }

    /** 종목유형설정 조회창의 삭제 검사 — 매매·보유내역에서 쓰는 유형(10)은 이름이 나오고, 안 쓰는 유형(60)은 null */
    @Test
    void 종목유형_삭제검사는_사용중인_유형_이름을_돌려준다() {
        assertThat(itemTypeService.selectUsedNames(user, List.of(202305251539374L))).isNull();
        assertThat(itemTypeService.selectUsedNames(user, List.of(202305231532875L, 202305251539374L))).isEqualTo("지분증권(국내상장)");
        assertThat(itemTypeService.selectUsedNames(user, List.of())).isNull();
    }
}
